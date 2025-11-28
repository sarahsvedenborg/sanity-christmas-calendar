import './ExampleComponent.css'
import {DocumentHandle, useDocumentProjection, useDocumentProjectionResults, useDocuments} from '@sanity/sdk-react'

export function ExampleComponent() {
  const {data, hasMore, isPending, loadMore, count} = useDocuments({
    documentType: 'user',
    batchSize: 10,
    orderings: [{field: '_updatedAt', direction: 'desc'}],
  })

  interface NameProjection {
  name: string
}


const  UserDetails = ({document}: {document: DocumentHandle})=>  {
  const {data}: useDocumentProjectionResults<NameProjection> = useDocumentProjection({
    ...document,
    projection: '{ name, email, participantType, receivedStickers, acceptScoreboard, acceptSharingWorkPublicly }',
  })
  return <p>The user's name is {data.name}</p>
}


  return (
    <div>
      Total documents: {count}
      <ol>
        {data.map((doc) => (
          <li>
            <UserDetails document={doc} />
          </li>
        /*   <li key={doc.documentId}>
            <code>{JSON.stringify(doc, null, 2)}</code>
          </li> */
        ))}
      </ol>
      {hasMore && (
        <button onClick={loadMore} disabled={isPending}>
          {isPending ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  )
}