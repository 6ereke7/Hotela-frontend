import { useState, type FormEvent } from 'react'
import type { ManagedRoom } from '../data/mockOperations'
import roomStyles from './ManagedRoomCard.module.css'
import commonStyles from './StaffDashboardCommon.module.css'

const styles = { ...commonStyles, ...roomStyles }

type ManagedRoomCardProps = {
  room: ManagedRoom
  editing: boolean
  onEdit: () => void
  onSave: (rate: number) => void
  onDelete: () => void
}

export function ManagedRoomCard({
  room,
  editing,
  onEdit,
  onSave,
  onDelete,
}: ManagedRoomCardProps) {
  const [rate, setRate] = useState(String(room.rate))

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsedRate = Number(rate)
    if (Number.isFinite(parsedRate) && parsedRate > 0) onSave(parsedRate)
  }

  return (
    <article className={styles.managedRoomCard}>
      <div className={styles.roomCardArtwork}>
        <span>ROOM {room.name}</span>
        <button
          aria-label={`More actions for room ${room.name}`}
          className={`${styles.moreButton} ${roomStyles.roomCardMoreButton}`}
          type="button"
        >
          ···
        </button>
      </div>
      <div className={styles.managedRoomBody}>
        <div className={styles.managedRoomTitle}>
          <div>
            <h3>{room.category}</h3>
            <p>Room {room.name}</p>
          </div>
          <span
            className={
              room.status === 'Available'
                ? styles.statusReady
                : room.status === 'Occupied'
                  ? styles.statusOccupied
                  : styles.statusNeedsService
            }
          >
            {room.status}
          </span>
        </div>
        {editing ? (
          <form className={styles.rateEditForm} onSubmit={handleSave}>
            <label>
              Nightly rate <span>$</span>
              <input
                aria-label={`Nightly rate for ${room.category}`}
                min="1"
                onChange={(event) => setRate(event.target.value)}
                type="number"
                value={rate}
              />
            </label>
            <button className={styles.smallPrimaryButton} type="submit">
              Save rate
            </button>
          </form>
        ) : (
          <p className={styles.rateLine}>
            <strong>${room.rate}</strong> <span>/ night</span>
          </p>
        )}
        <div className={styles.roomCardActions}>
          <button onClick={onEdit} type="button">
            {editing ? 'Cancel' : 'Edit room'}
          </button>
          <button className={styles.deleteAction} onClick={onDelete} type="button">
            Remove
          </button>
        </div>
      </div>
    </article>
  )
}
