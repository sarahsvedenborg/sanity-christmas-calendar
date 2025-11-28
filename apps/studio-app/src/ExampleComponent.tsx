import { UserRound, CircleX, Laptop, Palette, ArrowUp, ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import './ExampleComponent.css'
import {DocumentHandle, useDocumentProjection, useDocumentProjectionResults, useDocuments} from '@sanity/sdk-react'

interface UserProjection {
  _id: string
  _updatedAt: string
  name?: string
  email?: string
  receivedStickers?: boolean
  participantType?: string
  acceptScoreboard?: boolean
  acceptSharingWorkPublicly?: boolean
  publicworkurl?: string
  taskCompletionStatus?: Array<{
    _key?: string
    calendarDay?: {
      _ref?: string
      _type?: string
    }
    completed?: boolean
  }>
}

type UserData = UserProjection & { documentId: string }

const UserDataCollector = ({document, onDataLoaded}: {document: DocumentHandle, onDataLoaded: (data: UserData) => void}) => {
  const {data}: useDocumentProjectionResults<UserProjection> = useDocumentProjection({
    ...document,
    projection: `{
      _id,
      _updatedAt,
      name,
      email,
      receivedStickers,
      participantType,
      acceptScoreboard,
      acceptSharingWorkPublicly,
      publicworkurl,
      taskCompletionStatus[] {
        _key,
        calendarDay {
          _ref,
          _type
        },
        completed
      }
    }`,
  })

  useEffect(() => {
    if (data) {
      onDataLoaded({
        ...data,
        documentId: document.documentId,
      })
    }
  }, [data, document.documentId, onDataLoaded])

  return null
}

const UserRow = ({userData}: {userData: UserData}) => {
  const completedTasks = userData?.taskCompletionStatus?.filter(task => task.completed).length || 0
  const totalTasks = userData?.taskCompletionStatus?.length || 0

  const getParticipantType = (participantType?: string) => {
    if (participantType === 'tech') return <Laptop />
    if (participantType === 'design') return <Palette />
    return <CircleX style={{ color: "#B91C1C" }} />
  }

  return (
    <tr className="table-row">
      <td className="table-cell">{userData?.name || '-'}</td>
      <td className="table-cell">{userData?.email || '-'}</td>
      <td className="table-cell table-cell-icon">{getParticipantType(userData?.participantType)}</td>
      <td className={`table-cell ${userData?.receivedStickers ? 'table-cell-background-green' : 'table-cell-background-red'}`}>{userData?.receivedStickers ? 'Yes' : 'No'}</td>
      <td className={`table-cell ${userData?.acceptScoreboard ? 'table-cell-background-green' : 'table-cell-background-red'}`}>{userData?.acceptScoreboard ? 'Yes' : 'No'}</td>
      <td className={`table-cell ${userData?.acceptSharingWorkPublicly ? 'table-cell-background-green' : 'table-cell-background-red'}`}>{userData?.acceptSharingWorkPublicly ? 'Yes' : 'No'}</td>
      <td className="table-cell">{completedTasks} / {totalTasks}</td>
    </tr>
  )
}

export function ExampleComponent() {
  const {data, hasMore, isPending, loadMore, count} = useDocuments({
    documentType: 'user',
    batchSize: 50,
    orderings: [{field: '_updatedAt', direction: 'desc'}],
  })

  const [userDataMap, setUserDataMap] = useState<Map<string, UserData>>(new Map())
  const [scoreSortDirection, setScoreSortDirection] = useState<'asc' | 'desc' | null>(null)

  const handleDataLoaded = (userData: UserData) => {
    setUserDataMap(prev => {
      const newMap = new Map(prev)
      newMap.set(userData.documentId, userData)
      return newMap
    })
  }

  const userDataList = Array.from(userDataMap.values())

  // Sort user data based on score sort direction
  const sortedUserData = [...userDataList].sort((a, b) => {
    if (scoreSortDirection === null) return 0
    
    const aValue = a.acceptScoreboard ? 1 : 0
    const bValue = b.acceptScoreboard ? 1 : 0
    
    if (scoreSortDirection === 'asc') {
      return aValue - bValue
    } else {
      return bValue - aValue
    }
  })

  const handleScoreSort = () => {
    if (scoreSortDirection === null) {
      setScoreSortDirection('asc')
    } else if (scoreSortDirection === 'asc') {
      setScoreSortDirection('desc')
    } else {
      setScoreSortDirection(null)
    }
  }

  return (
    <div className="example-container">
      <h2 className="example-heading">Users Table</h2>
      <p>Total documents: {count}</p>
      
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr className="table-header-row">
              <th className="table-header">Navn</th>
              <th className="table-header">Epost</th>
              <th className="table-header">Type</th>
              <th className="table-header">Klstr</th>
              <th 
                className="table-header table-header-sortable" 
                onClick={handleScoreSort}
                style={{ cursor: 'pointer' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Score
                  {scoreSortDirection === 'asc' && <ArrowUp size={16} />}
                  {scoreSortDirection === 'desc' && <ArrowDown size={16} />}
                </span>
              </th>
              <th className="table-header">Sharing</th>
              <th className="table-header">Tasks Completed</th>
            </tr>
          </thead>
          <tbody>
            {isPending && userDataList.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-cell table-cell-loading">Loading users...</td>
              </tr>
            ) : (
              <>
                {data.map((doc) => (
                  <UserDataCollector key={doc.documentId} document={doc} onDataLoaded={handleDataLoaded} />
                ))}
                {(scoreSortDirection !== null ? sortedUserData : userDataList).map((userData) => (
                  <UserRow key={userData.documentId} userData={userData} />
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <button 
          onClick={loadMore} 
          disabled={isPending}
          style={{
            marginTop: '1rem',
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.6 : 1
          }}
        >
          {isPending ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  )
}