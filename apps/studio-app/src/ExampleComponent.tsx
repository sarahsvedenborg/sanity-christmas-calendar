import { UserRound, CircleX, Laptop, Palette, ArrowUp, ArrowDown, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import './ExampleComponent.css'
import {DocumentHandle, useDocumentProjection, useDocumentProjectionResults, useDocuments} from '@sanity/sdk-react'
import { LogoBronzeNew } from "./icons/LogoBronzeNew";
import { LogoSilverNew } from "./icons/LogoSilverNew";
import { LogoGoldNew } from "./icons/LogoGoldNew";

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
      _id?: string
      dayNumber?: number
    }
    completed?: boolean
  }>
}

type UserData = UserProjection & { documentId: string }

type ColumnKey = 'name' | 'email' | 'participantType' | 'receivedStickers' | 'acceptScoreboard' | 'acceptSharingWorkPublicly' | 'tasksCompleted' | 'bronzePrize' | 'silverPrize' | 'goldPrize'

interface ColumnConfig {
  key: ColumnKey
  label: string
  defaultVisible: boolean
}

const COLUMNS: ColumnConfig[] = [
  { key: 'name', label: 'Navn', defaultVisible: true },
  { key: 'email', label: 'Epost', defaultVisible: false },
  { key: 'participantType', label: 'Type', defaultVisible: true },
  { key: 'receivedStickers', label: 'Klstr', defaultVisible: false },
  { key: 'acceptScoreboard', label: 'Score', defaultVisible: false },
  { key: 'acceptSharingWorkPublicly', label: 'Sharing', defaultVisible: false },
  { key: 'tasksCompleted', label: 'Tasks Completed', defaultVisible: false },
  { key: 'bronzePrize', label: 'Bronje', defaultVisible: true },
  { key: 'silverPrize', label: 'Sølv', defaultVisible: true },
  { key: 'goldPrize', label: 'Gull', defaultVisible: true },
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
        calendarDay-> {
          _id,
          dayNumber
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

  const hasBronzePrize = () => {
    const tasks1to5 = [1, 2, 3, 4, 5]
    const completedDayNumbers = userData?.taskCompletionStatus
      ?.filter(task => task.completed && task.calendarDay?.dayNumber)
      .map(task => task.calendarDay?.dayNumber)
      .filter((dayNumber): dayNumber is number => dayNumber !== undefined) || []
    
    return tasks1to5.every(dayNum => completedDayNumbers.includes(dayNum))
  }

  const hasSilverPrize = () => {
    const tasks8to12 = [8, 9, 10, 11, 12]
    const completedDayNumbers = userData?.taskCompletionStatus
      ?.filter(task => task.completed && task.calendarDay?.dayNumber)
      .map(task => task.calendarDay?.dayNumber)
      .filter((dayNumber): dayNumber is number => dayNumber !== undefined) || []
    
    return tasks8to12.every(dayNum => completedDayNumbers.includes(dayNum))
  }

  const hasGoldPrize = () => {
    const tasks15to19 = [15, 16, 17, 18, 19]
    const completedDayNumbers = userData?.taskCompletionStatus
      ?.filter(task => task.completed && task.calendarDay?.dayNumber)
      .map(task => task.calendarDay?.dayNumber)
      .filter((dayNumber): dayNumber is number => dayNumber !== undefined) || []
    
    return tasks15to19.every(dayNum => completedDayNumbers.includes(dayNum))
  }

  return (
    <tr className="table-row">
      {visibleColumns.has('name') && <td className="table-cell" style={{ textAlign: 'left' }}>{userData?.name || '-'}</td>}
      {visibleColumns.has('email') && <td className="table-cell">{userData?.email || '-'}</td>}
      {visibleColumns.has('participantType') && <td className="table-cell table-cell-icon">{getParticipantType(userData?.participantType)}</td>}
      {visibleColumns.has('receivedStickers') && <td className={`table-cell ${userData?.receivedStickers ? 'table-cell-background-green' : 'table-cell-background-red'}`}>{userData?.receivedStickers ? 'Yes' : 'No'}</td>}
      {visibleColumns.has('acceptScoreboard') && <td className={`table-cell ${userData?.acceptScoreboard ? 'table-cell-background-green' : 'table-cell-background-red'}`}>{userData?.acceptScoreboard ? 'Yes' : 'No'}</td>}
      {visibleColumns.has('acceptSharingWorkPublicly') && <td className={`table-cell ${userData?.acceptSharingWorkPublicly ? 'table-cell-background-green' : 'table-cell-background-red'}`}>{userData?.acceptSharingWorkPublicly ? 'Yes' : 'No'}</td>}
      {visibleColumns.has('tasksCompleted') && <td className="table-cell">{completedTasks} / {totalTasks}</td>}
      {visibleColumns.has('bronzePrize') && (
        <td className={`table-cell ${hasBronzePrize() ? 'table-cell-background-bronze' : ''}`}>
          {hasBronzePrize() ? <LogoBronzeNew width="35" height="35"/> : '-'}
        </td>
      )}
      {visibleColumns.has('silverPrize') && (
        <td className={`table-cell ${hasSilverPrize() ? 'table-cell-background-silver' : ''}`}>
          {hasSilverPrize() ? <LogoSilverNew width="35" height="35"/> : '-'}
        </td>
      )}
      {visibleColumns.has('goldPrize') && (
        <td className={`table-cell ${hasGoldPrize() ? 'table-cell-background-gold' : ''}`}>
          {hasGoldPrize() ? <LogoGoldNew width="35" height="35"/> : '-'}
        </td>
      )}
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
  const [klstrSortDirection, setKlstrSortDirection] = useState<'asc' | 'desc' | null>(null)
  const [sharingSortDirection, setSharingSortDirection] = useState<'asc' | 'desc' | null>(null)
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

  // Sort user data based on active sort direction
  const sortedUserData = [...userDataList].sort((a, b) => {
    let aValue = 0
    let bValue = 0
    let sortDirection: 'asc' | 'desc' | null = null

    if (scoreSortDirection !== null) {
      aValue = a.acceptScoreboard ? 1 : 0
      bValue = b.acceptScoreboard ? 1 : 0
      sortDirection = scoreSortDirection
    } else if (klstrSortDirection !== null) {
      aValue = a.receivedStickers ? 1 : 0
      bValue = b.receivedStickers ? 1 : 0
      sortDirection = klstrSortDirection
    } else if (sharingSortDirection !== null) {
      aValue = a.acceptSharingWorkPublicly ? 1 : 0
      bValue = b.acceptSharingWorkPublicly ? 1 : 0
      sortDirection = sharingSortDirection
    } else {
      return 0
    }
    
    if (sortDirection === 'asc') {
      return aValue - bValue
    } else {
      return bValue - aValue
    }
  })

  const handleScoreSort = () => {
    if (scoreSortDirection === null) {
      setScoreSortDirection('asc')
      setKlstrSortDirection(null)
      setSharingSortDirection(null)
    } else if (scoreSortDirection === 'asc') {
      setScoreSortDirection('desc')
    } else {
      setScoreSortDirection(null)
    }
  }

  const handleKlstrSort = () => {
    if (klstrSortDirection === null) {
      setKlstrSortDirection('asc')
      setScoreSortDirection(null)
      setSharingSortDirection(null)
    } else if (klstrSortDirection === 'asc') {
      setKlstrSortDirection('desc')
    } else {
      setKlstrSortDirection(null)
    }
  }

  const handleSharingSort = () => {
    if (sharingSortDirection === null) {
      setSharingSortDirection('asc')
      setScoreSortDirection(null)
      setKlstrSortDirection(null)
    } else if (sharingSortDirection === 'asc') {
      setSharingSortDirection('desc')
    } else {
      setSharingSortDirection(null)
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
          <h2 className="example-heading">Deltagere</h2>
          <p>Antall: {count}</p>
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
          Filtrer kolonner
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
              {visibleColumns.has('name') && <th className="table-header" style={{ textAlign: 'left' }}>Navn</th>}
              {visibleColumns.has('email') && <th className="table-header">Epost</th>}
              {visibleColumns.has('participantType') && <th className="table-header">Type</th>}
              {visibleColumns.has('receivedStickers') && (
                <th 
                  className="table-header table-header-sortable" 
                  onClick={handleKlstrSort}
                  style={{ cursor: 'pointer' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Klstr
                    {klstrSortDirection === 'asc' && <ArrowUp size={16} />}
                    {klstrSortDirection === 'desc' && <ArrowDown size={16} />}
                  </span>
                </th>
              )}
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
              {visibleColumns.has('acceptSharingWorkPublicly') && (
                <th 
                  className="table-header table-header-sortable" 
                  onClick={handleSharingSort}
                  style={{ cursor: 'pointer' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Sharing
                    {sharingSortDirection === 'asc' && <ArrowUp size={16} />}
                    {sharingSortDirection === 'desc' && <ArrowDown size={16} />}
                  </span>
                </th>
              )}
              {visibleColumns.has('tasksCompleted') && <th className="table-header">Tasks Completed</th>}
              {visibleColumns.has('bronzePrize') && <th className="table-header">Bronze</th>}
              {visibleColumns.has('silverPrize') && <th className="table-header">Silver</th>}
              {visibleColumns.has('goldPrize') && <th className="table-header">Gold</th>}
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
                {((scoreSortDirection !== null || klstrSortDirection !== null || sharingSortDirection !== null) ? sortedUserData : userDataList).map((userData) => (
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