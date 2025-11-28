import { UserRound, CircleX, Laptop, Palette } from "lucide-react";
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

const UserDetails = ({document}: {document: DocumentHandle}) => {
  const {data, isPending}: useDocumentProjectionResults<UserProjection> = useDocumentProjection({
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

  if (isPending) {
    return <tr><td colSpan={10}>Loading...</td></tr>
  }

  const completedTasks = data?.taskCompletionStatus?.filter(task => task.completed).length || 0
  const totalTasks = data?.taskCompletionStatus?.length || 0

  const getParticipantType = (participantType: string) => {
    if (participantType === 'tech') return <Laptop />
    if (participantType === 'design') return <Palette />
    return <CircleX style={{ color: "#B91C1C" }} />
  }

  return (
    <tr className="table-row">
      <td className="table-cell">{data?.name || '-'}</td>
      <td className="table-cell">{data?.email || '-'}</td>
      <td className="table-cell table-cell-icon">{getParticipantType(data?.participantType || '')}</td>
      <td className={`table-cell ${data?.receivedStickers ? 'table-cell-background-green' : 'table-cell-background-red'}`}>{data?.receivedStickers ? 'Yes' : 'No'}</td>
      <td className={`table-cell ${data?.acceptScoreboard ? 'table-cell-background-green' : 'table-cell-background-red'}`}>{data?.acceptScoreboard ? 'Yes' : 'No'}</td>
      <td className={`table-cell ${data?.acceptSharingWorkPublicly ? 'table-cell-background-green' : 'table-cell-background-red'}`}>{data?.acceptSharingWorkPublicly ? 'Yes' : 'No'}</td>
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
              <th className="table-header">Score</th>
              <th className="table-header">Sharing</th>
              <th className="table-header">Tasks Completed</th>
            </tr>
          </thead>
          <tbody>
            {isPending && data.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-cell table-cell-loading">Loading users...</td>
              </tr>
            ) : (
              data.map((doc) => (
                <UserDetails key={doc.documentId} document={doc} />
              ))
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