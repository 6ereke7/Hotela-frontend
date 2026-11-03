import type { GuestBooking } from "../../types";
import { Loading } from "@/components/Loading";
import { BookingTable } from "./BookingTable";
import styles from "./GuestActivity.module.css";

export type RoomFilter = "All rooms" | GuestBooking["roomStatus"];

const filters: RoomFilter[] = ["All rooms", "Ready", "Occupied"];

type GuestActivityProps = {
  bookings: GuestBooking[];
  filter: RoomFilter;
  isLoading: boolean;
  onFilterChange: (filter: RoomFilter) => void;
  onSearchChange: (search: string) => void;
  onUpdateBooking: (
    bookingId: string,
    nextStatus: "In house" | "Departed",
  ) => void;
  search: string;
  today: string;
};

export function GuestActivity({
  bookings,
  filter,
  isLoading,
  onFilterChange,
  onSearchChange,
  onUpdateBooking,
  search,
  today,
}: GuestActivityProps) {
  return (
    <section
      className={styles.panel}
      id="guest-activity"
      aria-labelledby="guest-activity-title"
    >
      <header className={styles.panelHeading}>
        <div>
          <p className={styles.eyebrow}>THE PEOPLE ARRIVING & STAYING</p>
          <h2 id="guest-activity-title">
            Guest activity <span className={styles.countBadge}>{bookings.length}</span>
          </h2>
        </div>
        <label className={styles.searchField}>
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="Search guests, rooms, or booking ID"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Find a guest or room..."
            type="search"
            value={search}
          />
        </label>
      </header>

      <div className={styles.filters} aria-label="Filter by room status">
        <span>Room status</span>
        <div
          className={styles.filterButtons}
          role="group"
          aria-label="Filter by room status"
        >
          {filters.map((item) => (
            <button
              aria-pressed={filter === item}
              className={filter === item ? styles.activeFilter : ""}
              key={item}
              onClick={() => onFilterChange(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Loading className={styles.loading} label="Loading guest activity" />
      ) : (
        <BookingTable
          bookings={bookings}
          emptyMessage="No active or missed bookings match. Try another room status or search."
          onUpdateBooking={onUpdateBooking}
          today={today}
        />
      )}

      <footer className={styles.tableFooter}>
        Showing <strong>{bookings.length}</strong> active bookings
        <button
          className={styles.clearFilters}
          onClick={() => {
            onFilterChange("All rooms");
            onSearchChange("");
          }}
          type="button"
        >
          Clear filters
        </button>
      </footer>
    </section>
  );
}
