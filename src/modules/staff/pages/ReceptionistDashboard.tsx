import { useMemo, useState } from 'react'
import { initialGuestBookings, type GuestBooking } from '../data/mockOperations'
import { StaffDashboardShell } from '../components/StaffDashboardShell'
import shellStyles from '../components/StaffDashboardShell.module.css'
import commonStyles from '../components/StaffDashboardCommon.module.css'
import receptionStyles from '../components/ReceptionistDashboard.module.css'

const styles = { ...shellStyles, ...commonStyles, ...receptionStyles }

type ReceptionistDashboardProps = {
  staffName: string
  onLogout: () => void
}

type RoomFilter = 'All rooms' | GuestBooking['roomStatus']

const filters: RoomFilter[] = ['All rooms', 'Ready', 'Occupied', 'Needs service']

export function ReceptionistDashboard({
  staffName,
  onLogout,
}: ReceptionistDashboardProps) {
  const [bookings, setBookings] = useState(initialGuestBookings)
  const [filter, setFilter] = useState<RoomFilter>('All rooms')
  const [search, setSearch] = useState('')
  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const matchesFilter = filter === 'All rooms' || booking.roomStatus === filter
        const query = search.trim().toLowerCase()
        const matchesSearch =
          !query ||
          booking.guest.toLowerCase().includes(query) ||
          booking.room.toLowerCase().includes(query) ||
          booking.id.toLowerCase().includes(query)
        return matchesFilter && matchesSearch
      }),
    [bookings, filter, search],
  )

  const updateBooking = (bookingId: string, nextStatus: GuestBooking['bookingStatus']) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId
          ? {
            ...booking,
            bookingStatus: nextStatus,
            roomStatus: nextStatus === 'In house' ? 'Occupied' : 'Ready',
          }
          : booking,
      ),
    )
  }

  return (
    <StaffDashboardShell
      breadcrumb={<>Front desk <span>/</span> Guest activity</>}
      liveStatus="Desk is open"
      navigationLabel="Reception navigation"
      onLogout={onLogout}
      sidebarLabel="FRONT DESK"
      staffName={staffName}
      staffTitle="Front desk"
      navigation={
        <>
          <a className={styles.navActive} href="#guest-activity"><span className={styles.navIcon} aria-hidden="true">▤</span>Guest activity</a>
          <a href="#room-status"><span className={styles.navIcon} aria-hidden="true">⌂</span>Room status</a>
          <a href="#guest-activity"><span className={styles.navIcon} aria-hidden="true">◷</span>Arrivals & departures</a>
        </>
      }
    >
      <div className={styles.dashboardContent}>
        <div className={styles.pageTitleRow}>
          <div>
            <p className={styles.eyebrow}>MONDAY · OCTOBER 13</p>
            <h1>Good morning, Riley.</h1>
            <p className={styles.subtitle}>A smooth arrival makes the whole stay.</p>
          </div>
          <button className={styles.outlineButton} type="button" onClick={(event) => event.currentTarget.textContent = 'New booking noted ✓'}>
            <span aria-hidden="true">＋</span> New booking
          </button>
        </div>

        <div className={styles.statsGrid}>
          <article className={styles.statCard}><div className={styles.statCardTop}><span>Arrivals</span><span aria-hidden="true">↘</span></div><strong>8</strong><p>4 still expected today</p></article>
          <article className={styles.statCard}><div className={styles.statCardTop}><span>Departures</span><span aria-hidden="true">↗</span></div><strong>5</strong><p>2 rooms awaiting service</p></article>
          <article className={styles.statCard}><div className={styles.statCardTop}><span>Ready rooms</span><span aria-hidden="true">⌂</span></div><strong>6<span className={styles.statUnit}> rooms</span></strong><p>Ready for a warm welcome</p></article>
          <article className={styles.statCard}><div className={styles.statCardTop}><span>In-house guests</span><span aria-hidden="true">♧</span></div><strong>31</strong><p>Across 25 reservations</p></article>
        </div>

        <section className={styles.panelCard} id="guest-activity" aria-labelledby="guest-activity-title">
          <div className={styles.panelHeading}>
            <div><p className={styles.eyebrow}>THE PEOPLE ARRIVING & STAYING</p><h2 id="guest-activity-title">Guest activity <span className={styles.countBadge}>{filteredBookings.length}</span></h2></div>
            <label className={styles.searchInput}>
              <span aria-hidden="true">⌕</span>
              <input aria-label="Search guests, rooms, or booking ID" onChange={(event) => setSearch(event.target.value)} placeholder="Find a guest or room..." value={search} />
            </label>
          </div>

          <div className={styles.filterRow} id="room-status">
            <span>Room status</span>
            <div className={styles.filterButtons} aria-label="Filter by room status">
              {filters.map((item) => (
                <button
                  aria-pressed={filter === item}
                  className={filter === item ? styles.filterActive : ''}
                  key={item}
                  onClick={() => setFilter(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.bookingTable}>
              <thead><tr><th>Guest</th><th>Room</th><th>Stay</th><th>Booking</th><th>Room status</th><th><span className={styles.visuallyHidden}>Actions</span></th></tr></thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td data-label="Guest"><strong>{booking.guest}</strong><small>{booking.id}</small></td>
                    <td data-label="Room">{booking.room}</td>
                    <td data-label="Stay"><strong>{booking.arrival}</strong><small>Until {booking.departure}</small></td>
                    <td data-label="Booking"><span className={booking.bookingStatus === 'In house' ? styles.statusOccupied : booking.bookingStatus === 'Departed' ? styles.statusNeedsService : styles.statusArriving}>{booking.bookingStatus}</span></td>
                    <td data-label="Room status"><span className={booking.roomStatus === 'Ready' ? styles.statusReady : booking.roomStatus === 'Occupied' ? styles.statusOccupied : styles.statusNeedsService}>{booking.roomStatus}</span></td>
                    <td className={styles.actionCell}>
                      {booking.bookingStatus === 'Arriving' ? (
                        <button className={styles.tableAction} onClick={() => updateBooking(booking.id, 'In house')} type="button">Check in</button>
                      ) : booking.bookingStatus === 'In house' ? (
                        <button className={styles.tableActionSecondary} onClick={() => updateBooking(booking.id, 'Departed')} type="button">Check out</button>
                      ) : (
                        <span className={styles.completedText}>Complete ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBookings.length === 0 && (
              <p className={styles.emptyState}>No guest bookings match. Try another room status or search.</p>
            )}
          </div>
          <div className={styles.tableFooter}>
            Showing <strong>{filteredBookings.length}</strong> of <strong>{bookings.length}</strong> mock bookings
            <button className={`${styles.panelLink} ${receptionStyles.tableFooterLink}`} type="button" onClick={() => { setFilter('All rooms'); setSearch('') }}>Clear filters</button>
          </div>
        </section>

        <div className={styles.deskNote}><span aria-hidden="true">✳</span><p><strong>A little heads-up</strong> Room 308 is waiting for service before Casey’s departure is complete.</p><button onClick={() => setFilter('Needs service')} type="button">See room ↗</button></div>
      </div>
    </StaffDashboardShell>
  )
}
