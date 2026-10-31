import styles from "../../components/StaffDashboardCommon.module.css";
import { useEffect, useState } from "react";
import { getRooms } from "@/modules/rooms/api";
import ManagerRevenue from "../components/ManagerRevenue";
/*
TODO:finish the manager dashboard
  - fix backend wiring
  - add a revenue section(recharts)
  - room managment
*/
export function ManagerOverview() {
  const [rooms, setRooms] = useState(0);
  const [inHouse, setInHouse] = useState(0);
  const [occupancy, setOccupancy] = useState(0);
  const [arrivals, setArrivals] = useState(0);

  useEffect(() => {
    async function fetchRooms() {
      const rooms = await getRooms();
      setRooms(rooms?.length ?? 0);
      setOccupancy(
        rooms?.filter((room) => room.status === "occupied").length ?? 0,
      );
      setArrivals(0);
      setInHouse(0);
    }
    fetchRooms();
  }, []);
  return (
    <>
      <div className="row row-cols-2 row-cols-xl-4 g-3 mb-3">
        <article className={`${styles.statCard} card`}>
          <div className={styles.statCardTop}>
            <span>Active rooms</span>
            <span aria-hidden="true">⌂</span>
          </div>
          <strong>{rooms}</strong>
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
