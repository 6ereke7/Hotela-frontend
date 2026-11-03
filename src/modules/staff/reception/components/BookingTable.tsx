import type { GuestBooking } from "../../types";
import commonStyles from "../../components/StaffDashboardCommon.module.css";
import styles from "./BookingTable.module.css";

function isMissedCheckIn(booking: GuestBooking, today: string) {
  return (
    booking.bookingStatus === "Arriving" &&
    booking.checkInDate.slice(0, 10) < today
  );
}

type BookingTableProps = {
  bookings: GuestBooking[];
  today: string;
  onUpdateBooking: (
    bookingId: string,
    nextStatus: "In house" | "Departed",
  ) => void;
  emptyMessage: string;
};

export function BookingTable({
  bookings,
  today,
  onUpdateBooking,
  emptyMessage,
}: BookingTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.bookingTable}>
        <thead>
          <tr>
            <th>Guest</th>
            <th>Room</th>
            <th>Stay</th>
            <th>Booking</th>
            <th>Room status</th>
            <th>
              <span className={styles.visuallyHidden}>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const missedCheckIn = isMissedCheckIn(booking, today);
            return (
              <tr
                className={missedCheckIn ? styles.missedBookingRow : ""}
                key={booking.id}
              >
                <td data-label="Guest">
                  <strong>{booking.guest}</strong>
                  <small>{booking.id}</small>
                </td>
                <td data-label="Room">{booking.room}</td>
                <td data-label="Stay">
                  <strong>{booking.arrival}</strong>
                  <small>Until {booking.departure}</small>
                </td>
                <td data-label="Booking">
                  <span
                    className={
                      missedCheckIn
                        ? styles.statusMissed
                        : booking.bookingStatus === "In house"
                          ? commonStyles.statusOccupied
                          : booking.bookingStatus === "Departed"
                            ? commonStyles.statusNeedsService
                            : commonStyles.statusArriving
                    }
                  >
                    {missedCheckIn ? "Missed check-in" : booking.bookingStatus}
                  </span>
                </td>
                <td data-label="Room status">
                  <span
                    className={
                      booking.roomStatus === "Ready"
                        ? commonStyles.statusReady
                        : booking.roomStatus === "Occupied"
                          ? commonStyles.statusOccupied
                          : commonStyles.statusNeedsService
                    }
                  >
                    {booking.roomStatus}
                  </span>
                </td>
                <td className={styles.actionCell}>
                  {booking.bookingStatus === "Arriving" && !missedCheckIn ? (
                    <button
                      className={styles.actionButton}
                      onClick={() => onUpdateBooking(booking.id, "In house")}
                      type="button"
                    >
                      Check in
                    </button>
                  ) : booking.bookingStatus === "In house" ? (
                    <button
                      className={`${styles.actionButton} ${styles.secondaryButton}`}
                      onClick={() => onUpdateBooking(booking.id, "Departed")}
                      type="button"
                    >
                      Check out
                    </button>
                  ) : missedCheckIn ? (
                    <span className={styles.completedText}>Check-in expired</span>
                  ) : (
                    <span className={styles.completedText}>Complete</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {bookings.length === 0 && (
        <p className={styles.emptyState}>{emptyMessage}</p>
      )}
    </div>
  );
}
