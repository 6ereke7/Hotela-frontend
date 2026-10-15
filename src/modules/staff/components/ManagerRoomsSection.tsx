import { useState, type FormEvent } from 'react'
import type { ManagedRoom } from '../data/mockOperations'
import { ManagedRoomCard } from './ManagedRoomCard'
import sectionStyles from './ManagerRoomsSection.module.css'
import commonStyles from './StaffDashboardCommon.module.css'

const styles = { ...commonStyles, ...sectionStyles }

type ManagerRoomsSectionProps = {
  rooms: ManagedRoom[]
  editingRoom: string | null
  onAddRoom: (name: string) => void
  onToggleEdit: (roomId: string) => void
  onSaveRate: (roomId: string, rate: number) => void
  onDeleteRoom: (roomId: string) => void
}

export function ManagerRoomsSection({
  rooms,
  editingRoom,
  onAddRoom,
  onToggleEdit,
  onSaveRate,
  onDeleteRoom,
}: ManagerRoomsSectionProps) {
  const [newRoomName, setNewRoomName] = useState('')

  const handleAddRoom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = newRoomName.trim()
    if (!name) return
    onAddRoom(name)
    setNewRoomName('')
  }

  return (
    <section className={styles.panelCard} aria-labelledby="room-list-title">
      <div className={styles.panelHeading}>
        <div>
          <p className={styles.eyebrow}>PROPERTY INVENTORY</p>
          <h2 id="room-list-title">All rooms <span className={styles.countBadge}>{rooms.length}</span></h2>
        </div>
        <form className={styles.addRoomForm} onSubmit={handleAddRoom}>
          <input
            aria-label="New room type"
            onChange={(event) => setNewRoomName(event.target.value)}
            placeholder="Room type name"
            value={newRoomName}
          />
          <button className={styles.smallPrimaryButton} type="submit">＋ Add room</button>
        </form>
      </div>
      <div className={styles.manageRoomGrid}>
        {rooms.map((room) => (
          <ManagedRoomCard
            editing={editingRoom === room.id}
            key={room.id}
            onDelete={() => onDeleteRoom(room.id)}
            onEdit={() => onToggleEdit(room.id)}
            onSave={(rate) => onSaveRate(room.id, rate)}
            room={room}
          />
        ))}
      </div>
    </section>
  )
}
