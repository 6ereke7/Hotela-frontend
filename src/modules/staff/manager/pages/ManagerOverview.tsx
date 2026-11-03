import { useEffect, useState } from "react";
import { api, type ApiResponse } from "@/lib/api";
import { Loading } from "@/components/Loading";
import { getRoomInventory } from "@/modules/rooms/api";
import ManagerRevenue from "../components/ManagerRevenue";
import styles from "./ManagerOverview.module.css";

type BookingStats = {
  totalBookings: number;
  byStatus: Record<string, number>;
};

type OverviewStats = {
  rooms: number;
  bookings: BookingStats;
};

export function ManagerOverview() {
  const [stats, setStats] = useState<OverviewStats>();
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      getRoomInventory(),
      api.get<ApiResponse<BookingStats>>("/stats/bookings", {
        signal: controller.signal,
      }),
    ])
      .then(([rooms, bookingResponse]) => {
        if (!bookingResponse.data.success) {
          throw new Error("Dashboard statistics response was invalid");
        }
        setStats({
          rooms: rooms?.length ?? 0,
          bookings: bookingResponse.data.data,
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError("Dashboard statistics could not be loaded.");
        }
      });

    return () => controller.abort();
  }, []);

  const cards = stats
    ? [
        { label: "Active rooms", value: stats.rooms },
        { label: "Total bookings", value: stats.bookings.totalBookings },
        { label: "Confirmed", value: stats.bookings.byStatus.confirmed ?? 0 },
        { label: "In house", value: stats.bookings.byStatus.in_house ?? 0 },
      ]
    : [];

  return (
    <section className={styles.overview} aria-label="Manager dashboard overview">
      <section className={styles.stats} aria-label="Hotel overview">
        {error ? (
          <p className={styles.message} role="alert">
            {error}
          </p>
        ) : stats ? (
          cards.map(({ label, value }) => (
            <article className={styles.statCard} key={label}>
              <h2>{label}</h2>
              <strong>{value.toLocaleString()}</strong>
            </article>
          ))
        ) : (
          <Loading className={styles.loading} label="Loading hotel overview" />
        )}
      </section>

      <ManagerRevenue />
    </section>
  );
}
