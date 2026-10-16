import type { GuestBooking, ManagedRoom } from "../types";
import styles from "./StaffDashboardCommon.module.css";

type ManagerOverviewProps = {
  rooms: ManagedRoom[];
  bookings: GuestBooking[];
  onNavigate: (section: "Rooms" | "Team") => void;
};

export function ManagerOverview({
  rooms,
  bookings,
  onNavigate,
}: ManagerOverviewProps) {
  const inHouse = bookings.filter(
    (booking) => booking.bookingStatus === "In house",
  ).length;
  const arrivals = bookings.filter(
    (booking) => booking.bookingStatus === "Arriving",
  ).length;
  const occupancy = rooms.length
    ? Math.round((inHouse / rooms.length) * 100)
    : 0;

  return (
    <>
      <div className={styles.statsGrid}>
        <article className={styles.statCard}>
          <div className={styles.statCardTop}>
            <span>Active rooms</span>
            <span aria-hidden="true">⌂</span>
          </div>
          <strong>{rooms.length}</strong>
          <p>Rooms in the property inventory</p>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statCardTop}>
            <span>In-house bookings</span>
            <span aria-hidden="true">♧</span>
          </div>
          <strong>{inHouse}</strong>
          <p>Based on current booking status</p>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statCardTop}>
            <span>Occupancy</span>
            <span aria-hidden="true">↗</span>
          </div>
          <strong>
            {occupancy}
            <span>%</span>
          </strong>
          <p>In-house bookings compared with active rooms</p>
        </article>
        <article className={styles.statCard}>
          <div className={styles.statCardTop}>
            <span>Upcoming arrivals</span>
            <span aria-hidden="true">↘</span>
          </div>
          <strong>{arrivals}</strong>
          <p>Confirmed bookings not yet checked in</p>
        </article>
      </div>

      <section className={styles.panelCard} aria-labelledby="revenue-title">
        <div className={styles.panelHeading}>
          <div>
            <p className={styles.eyebrow}>PERFORMANCE</p>
            <h2 id="revenue-title">Revenue overview</h2>
          </div>
        </div>
        <p>Revenue reporting is not available from the current backend.</p>
      </section>

      <section className={styles.panelCard} aria-labelledby="rooms-glance">
        <div className={styles.panelHeading}>
          <div>
            <p className={styles.eyebrow}>PROPERTY INVENTORY</p>
            <h2 id="rooms-glance">Rooms at a glance</h2>
          </div>
          <button
            className={styles.panelLink}
            onClick={() => onNavigate("Rooms")}
            type="button"
          >
            View rooms ↗
          </button>
        </div>
        <div className={styles.teamList}>
          {rooms.slice(0, 5).map((room) => (
            <div className={styles.teamMember} key={room.id}>
              <span className={styles.teamMemberInfo}>
                <strong>Room {room.name}</strong>
                <small>{room.category}</small>
              </span>
              <span>${room.rate} / night</span>
            </div>
          ))}
          {rooms.length === 0 && <p>No active rooms found.</p>}
        </div>
      </section>

      <section className={styles.panelCard} aria-labelledby="team-today">
        <div className={styles.panelHeading}>
          <div>
            <p className={styles.eyebrow}>PEOPLE & PERMISSIONS</p>
            <h2 id="team-today">Team management</h2>
          </div>
          <button
            className={styles.panelLink}
            onClick={() => onNavigate("Team")}
            type="button"
          >
            View team ↗
          </button>
        </div>
        <p>
          Staff directory and invitations are not available from the current
          backend.
        </p>
      </section>
    </>
  );
}
