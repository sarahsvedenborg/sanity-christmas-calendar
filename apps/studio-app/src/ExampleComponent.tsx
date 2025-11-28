import { UserRound, CircleX, Laptop, Palette, ArrowUp, ArrowDown, Filter } from "lucide-react";
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

type ColumnKey = 'name' | 'email' | 'participantType' | 'receivedStickers' | 'acceptScoreboard' | 'acceptSharingWorkPublicly' | 'tasksCompleted'

interface ColumnConfig {
  key: ColumnKey
  label: string
  defaultVisible: boolean
}

const COLUMNS: ColumnConfig[] = [
  { key: 'name', label: 'Navn', defaultVisible: true },
  { key: 'email', label: 'Epost', defaultVisible: true },
  { key: 'participantType', label: 'Type', defaultVisible: true },
  { key: 'receivedStickers', label: 'Klstr', defaultVisible: true },
  { key: 'acceptScoreboard', label: 'Score', defaultVisible: true },
  { key: 'acceptSharingWorkPublicly', label: 'Sharing', defaultVisible: true },
  { key: 'tasksCompleted', label: 'Tasks Completed', defaultVisible: true },
]

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

const UserRow = ({userData, visibleColumns}: {userData: UserData, visibleColumns: Set<ColumnKey>}) => {
  const completedTasks = userData?.taskCompletionStatus?.filter(task => task.completed).length || 0
  const totalTasks = userData?.taskCompletionStatus?.length || 0

  const getParticipantType = (participantType?: string) => {
    if (participantType === 'tech') return <Laptop />
    if (participantType === 'design') return <Palette />
    return <CircleX style={{ color: "#B91C1C" }} />
  }

  return (
    <tr className="table-row">
      {visibleColumns.has('name') && <td className="table-cell">{userData?.name || '-'}</td>}
      {visibleColumns.has('email') && <td className="table-cell">{userData?.email || '-'}</td>}
      {visibleColumns.has('participantType') && <td className="table-cell table-cell-icon">{getParticipantType(userData?.participantType)}</td>}
      {visibleColumns.has('receivedStickers') && <td className={`table-cell ${userData?.receivedStickers ? 'table-cell-background-green' : 'table-cell-background-red'}`}>{userData?.receivedStickers ? 'Yes' : 'No'}</td>}
      {visibleColumns.has('acceptScoreboard') && <td className={`table-cell ${userData?.acceptScoreboard ? 'table-cell-background-green' : 'table-cell-background-red'}`}>{userData?.acceptScoreboard ? 'Yes' : 'No'}</td>}
      {visibleColumns.has('acceptSharingWorkPublicly') && <td className={`table-cell ${userData?.acceptSharingWorkPublicly ? 'table-cell-background-green' : 'table-cell-background-red'}`}>{userData?.acceptSharingWorkPublicly ? 'Yes' : 'No'}</td>}
      {visibleColumns.has('tasksCompleted') && <td className="table-cell">{completedTasks} / {totalTasks}</td>}
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
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(
    new Set(COLUMNS.filter(col => col.defaultVisible).map(col => col.key))
  )
  const [showFilters, setShowFilters] = useState(false)

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

  const toggleColumnVisibility = (columnKey: ColumnKey) => {
    setVisibleColumns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey)
      } else {
        newSet.add(columnKey)
      }
      return newSet
    })
  }

  const visibleColumnsCount = visibleColumns.size

  return (
    <div className="example-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 className="example-heading">Users Table</h2>
          <p>Total documents: {count}</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="filter-toggle-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#1f4638',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d5a47'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1f4638'}
        >
          <Filter size={16} />
          Filter Columns
        </button>
      </div>

      {showFilters && (
        <div className="column-filters">
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>Visible Columns</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {COLUMNS.map((column) => (
              <label
                key={column.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: visibleColumns.has(column.key) ? '#f0fdf4' : '#f9fafb',
                  border: `1px solid ${visibleColumns.has(column.key) ? '#86efac' : '#e5e7eb'}`,
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={visibleColumns.has(column.key)}
                  onChange={() => toggleColumnVisibility(column.key)}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: '#374151' }}>{column.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr className="table-header-row">
              {visibleColumns.has('name') && <th className="table-header">Navn</th>}
              {visibleColumns.has('email') && <th className="table-header">Epost</th>}
              {visibleColumns.has('participantType') && <th className="table-header">Type</th>}
              {visibleColumns.has('receivedStickers') && <th className="table-header">Klstr</th>}
              {visibleColumns.has('acceptScoreboard') && (
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
              )}
              {visibleColumns.has('acceptSharingWorkPublicly') && <th className="table-header">Sharing</th>}
              {visibleColumns.has('tasksCompleted') && <th className="table-header">Tasks Completed</th>}
            </tr>
          </thead>
          <tbody>
            {isPending && userDataList.length === 0 ? (
              <tr>
                <td colSpan={visibleColumnsCount} className="table-cell table-cell-loading">Loading users...</td>
              </tr>
            ) : (
              <>
                {data.map((doc) => (
                  <UserDataCollector key={doc.documentId} document={doc} onDataLoaded={handleDataLoaded} />
                ))}
                {(scoreSortDirection !== null ? sortedUserData : userDataList).map((userData) => (
                  <UserRow key={userData.documentId} userData={userData} visibleColumns={visibleColumns} />
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