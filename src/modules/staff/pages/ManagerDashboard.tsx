import { useState } from 'react'
import { initialManagedRooms } from '../data/mockOperations'
import { ManagerOverview } from '../components/ManagerOverview'
import { ManagerRoomsSection } from '../components/ManagerRoomsSection'
import { ManagerTeamSection } from '../components/ManagerTeamSection'
import { StaffDashboardShell } from '../components/StaffDashboardShell'
import shellStyles from '../components/StaffDashboardShell.module.css'
import commonStyles from '../components/StaffDashboardCommon.module.css'

const styles = { ...shellStyles, ...commonStyles }

type ManagerDashboardProps = {
  staffName: string
  onLogout: () => void
}

type ManagerSection = 'Overview' | 'Rooms' | 'Team'

const sections: ManagerSection[] = ['Overview', 'Rooms', 'Team']

export function ManagerDashboard({ staffName, onLogout }: ManagerDashboardProps) {
  const [section, setSection] = useState<ManagerSection>('Overview')
  const [rooms, setRooms] = useState(initialManagedRooms)
  const [editingRoom, setEditingRoom] = useState<string | null>(null)

  const handleAddRoom = (name: string) => {
    setRooms((current) => {
      const roomNumber =
        Array.from({ length: current.length + 1 }, (_, index) => 101 + index).find(
          (number) => !current.some((room) => room.name === String(number)),
        ) ?? 101 + current.length

      return [
        ...current,
        {
          id: `r-${Date.now()}`,
          name: String(roomNumber),
          category: name,
          rate: 200,
          status: 'Available',
        },
      ]
    })
  }

  const handleRateChange = (roomId: string, rate: number) => {
    setRooms((current) =>
      current.map((room) => (room.id === roomId ? { ...room, rate } : room)),
    )
    setEditingRoom(null)
  }

  const toggleRoomEdit = (roomId: string) => {
    setEditingRoom((current) => (current === roomId ? null : roomId))
  }

  const sectionTitle = {
    Overview: `Good morning, ${staffName.split(' ')[0]}.`,
    Rooms: 'Room management',
    Team: 'Your people.',
  }[section]

  const sectionDescription = {
    Overview: 'A lovely day to make someone feel at home.',
    Rooms: 'Keep room details and availability up to date.',
    Team: 'A thoughtful team makes a thoughtful stay.',
  }[section]

  return (
    <StaffDashboardShell
      breadcrumb={<>Workspace <span>/</span> {section}</>}
      liveStatus="Hotel is open"
      navigationLabel="Manager sections"
      onLogout={onLogout}
      sidebarLabel="HOTEL OPERATIONS"
      staffName={staffName}
      staffTitle="Hotel manager"
      navigation={
        <>
          {sections.map((item) => (
            <button
              aria-current={section === item ? 'page' : undefined}
              className={section === item ? styles.navActive : ''}
              key={item}
              onClick={() => setSection(item)}
              type="button"
            >
              <span className={styles.navIcon} aria-hidden="true">
                {item === 'Overview' ? '◫' : item === 'Rooms' ? '⌂' : '♧'}
              </span>
              {item}
            </button>
          ))}
        </>
      }
    >
      <div className={styles.dashboardContent}>
        <div className={styles.pageTitleRow}>
          <div>
            <p className={styles.eyebrow}>
              {section === 'Overview' ? 'YOUR HOTEL AT A GLANCE' : 'HOTEL OPERATIONS'}
            </p>
            <h1>{sectionTitle}</h1>
            <p className={styles.subtitle}>{sectionDescription}</p>
          </div>
          <button
            className={styles.outlineButton}
            onClick={() => setSection('Rooms')}
            type="button"
          >
            <span aria-hidden="true">＋</span> Add a room
          </button>
        </div>

        {section === 'Overview' && (
          <ManagerOverview onNavigate={setSection} />
        )}
        {section === 'Rooms' && (
          <ManagerRoomsSection
            editingRoom={editingRoom}
            onAddRoom={handleAddRoom}
            onDeleteRoom={(roomId) => setRooms((current) =>
              current.filter((room) => room.id !== roomId),
            )}
            onSaveRate={handleRateChange}
            onToggleEdit={toggleRoomEdit}
            rooms={rooms}
          />
        )}
        {section === 'Team' && <ManagerTeamSection />}
      </div>
    </StaffDashboardShell>
  )
}
