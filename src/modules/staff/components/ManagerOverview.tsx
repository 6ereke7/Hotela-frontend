import type { GuestBooking, ManagedRoom } from "../types";
import ManagerRevenue from "./ManagerRevenue";
import styles from "./StaffDashboardCommon.module.css";

type ManagerOverviewProps = {
  rooms: ManagedRoom[];
  bookings: GuestBooking[];
  onNavigate: (section: "Rooms" | "Team") => void;
};
/* 
TODO:finish the manager dashboard
  - fix backend wiring
  - add a revenue section(recharts)
  - room managment
*/
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
      <div className="row row-cols-2 row-cols-xl-4 g-3 mb-3">
        <article className={`${styles.statCard} card`}>
          <div className={styles.statCardTop}>
            <span>Active rooms</span>
            <span aria-hidden="true">⌂</span>
          </div>
          <strong>{rooms.length}</strong>
          <p>Rooms in the property inventory</p>
        </article>
        <article className={`${styles.statCard} card`}>
          <div className={styles.statCardTop}>
            <span>In-house bookings</span>
            <span aria-hidden="true">♧</span>
          </div>
          <strong>{inHouse}</strong>
          <p>Based on current booking status</p>
        </article>
        <article className={`${styles.statCard} card`}>
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
        <article className={`${styles.statCard} card`}>
          <div className={styles.statCardTop}>
            <span>Upcoming arrivals</span>
            <span aria-hidden="true">↘</span>
          </div>
          <strong>{arrivals}</strong>
          <p>Confirmed bookings not yet checked in</p>
        </article>
      </div>

      <section
        className={`${styles.panelCard} card p-3 mb-3`}
        aria-labelledby="revenue-title"
      >
        <ManagerRevenue />
      </section>
    </>
  );
}
