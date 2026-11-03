import type { GuestBooking } from "../../types";
import { Loading } from "@/components/Loading";
import { BookingTable } from "./BookingTable";
import styles from "./BookingHistory.module.css";

type BookingHistoryProps = {
  bookings: GuestBooking[];
  isLoading: boolean;
  onUpdateBooking: (
    bookingId: string,
    nextStatus: "In house" | "Departed",
  ) => void;
  today: string;
};

export function BookingHistory({
  bookings,
  isLoading,
  onUpdateBooking,
  today,
}: BookingHistoryProps) {
  return (
    <section
      className={styles.panel}
      id="booking-history"
      aria-labelledby="booking-history-title"
    >
      <header className={styles.panelHeading}>
        <div>
          <p className={styles.eyebrow}>CHECKED-IN & COMPLETED STAYS</p>
          <h2 id="booking-history-title">
            Booking history <span className={styles.countBadge}>{bookings.length}</span>
          </h2>
        </div>
      </header>
      {isLoading ? (
        <Loading className={styles.loading} label="Loading booking history" />
      ) : (
        <BookingTable
          bookings={bookings}
          emptyMessage="No checked-in or completed bookings found."
          onUpdateBooking={onUpdateBooking}
          today={today}
        />
      )}
    </section>
  );
}
