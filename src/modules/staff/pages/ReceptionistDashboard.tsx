import { useEffect, useMemo, useState } from "react";
import type { GuestBooking } from "../types";
import { StaffDashboardShell } from "../components/StaffDashboardShell";
import shellStyles from "../components/StaffDashboardShell.module.css";
import commonStyles from "../components/StaffDashboardCommon.module.css";
import receptionStyles from "../components/ReceptionistDashboard.module.css";
import { getStaffOperations, updateGuestBooking } from "../api";
import { Link } from "react-router-dom";

type ReceptionistDashboardProps = {
  staffName: string;
  onLogout: () => void;
};

type RoomFilter = "All rooms" | GuestBooking["roomStatus"];

const filters: RoomFilter[] = ["All rooms", "Ready", "Occupied"];

function getTodayDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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

function BookingTable({
  bookings,
  today,
  onUpdateBooking,
  emptyMessage,
}: BookingTableProps) {
  return (
    <div className={receptionStyles.tableWrap}>
      <table
        className={`${receptionStyles.bookingTable} table table-hover align-middle mb-0`}
      >
        <thead>
          <tr>
            <th>Guest</th>
            <th>Room</th>
            <th>Stay</th>
            <th>Booking</th>
            <th>Room status</th>
            <th>
              <span className={receptionStyles.visuallyHidden}>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const missedCheckIn = isMissedCheckIn(booking, today);
            return (
              <tr
                className={missedCheckIn ? receptionStyles.missedBookingRow : ""}
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
                        ? receptionStyles.statusMissed
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
                <td className={receptionStyles.actionCell}>
                  {booking.bookingStatus === "Arriving" && !missedCheckIn ? (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => onUpdateBooking(booking.id, "In house")}
                      type="button"
                    >
                      Check in
                    </button>
                  ) : booking.bookingStatus === "In house" ? (
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => onUpdateBooking(booking.id, "Departed")}
                      type="button"
                    >
                      Check out
                    </button>
                  ) : missedCheckIn ? (
                    <span className={receptionStyles.completedText}>
                      Check-in expired
                    </span>
                  ) : (
                    <span className={receptionStyles.completedText}>
                      Complete ✓
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {bookings.length === 0 && (
        <p className={receptionStyles.emptyState}>{emptyMessage}</p>
      )}
    </div>
  );
}

export function ReceptionistDashboard({
  staffName,
  onLogout,
}: ReceptionistDashboardProps) {
  const [bookings, setBookings] = useState<GuestBooking[]>([]);
  const [roomCount, setRoomCount] = useState(0);
  const [filter, setFilter] = useState<RoomFilter>("All rooms");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const today = getTodayDate();

  useEffect(() => {
    getStaffOperations()
      .then((data) => {
        setBookings(data.bookings);
        setRoomCount(data.rooms.length);
      })
      .catch(() =>
        setError("Guest activity could not be loaded. Please refresh."),
      )
      .finally(() => setIsLoading(false));
  }, []);
  const query = search.trim().toLowerCase();
  const matchesSearch = (booking: GuestBooking) =>
    !query ||
    booking.guest.toLowerCase().includes(query) ||
    booking.room.toLowerCase().includes(query) ||
    booking.id.toLowerCase().includes(query);
  const activeBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.bookingStatus === "Arriving" &&
          (filter === "All rooms" || booking.roomStatus === filter) &&
          matchesSearch(booking),
      ),
    [bookings, filter, query],
  );
  const historyBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          (booking.bookingStatus === "In house" ||
            booking.bookingStatus === "Departed") &&
          matchesSearch(booking),
      ),
    [bookings, query],
  );

  const updateBooking = async (
    bookingId: string,
    nextStatus: "In house" | "Departed",
  ) => {
    try {
      await updateGuestBooking(
        bookingId,
        nextStatus === "In house" ? "in_house" : "departed",
      );
      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                bookingStatus: nextStatus,
                roomStatus: nextStatus === "In house" ? "Occupied" : "Ready",
              }
            : booking,
        ),
      );
      setError("");
    } catch {
      setError("Booking status could not be updated.");
    }
  };

  const arrivalsToday = bookings.filter(
    (booking) =>
      booking.bookingStatus === "Arriving" &&
      booking.checkInDate.slice(0, 10) === today,
  ).length;
  const departuresToday = bookings.filter(
    (booking) =>
      booking.bookingStatus === "In house" &&
      booking.checkOutDate === getTodayDate(),
  ).length;
  const inHouse = bookings.filter(
    (booking) => booking.bookingStatus === "In house",
  ).length;
  const missedCheckIns = bookings.filter((booking) =>
    isMissedCheckIn(booking, today),
  ).length;
  const readyRooms = Math.max(roomCount - inHouse, 0);
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <StaffDashboardShell
      breadcrumb={
        <>
          Front desk <span>/</span> Guest activity
        </>
      }
      liveStatus="Desk is open"
      navigationLabel="Reception navigation"
      onLogout={onLogout}
      sidebarLabel="FRONT DESK"
      staffName={staffName}
      staffTitle="Front desk"
      navigation={
        <>
          <a className={shellStyles.navActive} href="#guest-activity">
            <span className={shellStyles.navIcon} aria-hidden="true">
              ▤
            </span>
            Guest activity
          </a>
          <a href="#room-status">
            <span className={shellStyles.navIcon} aria-hidden="true">
              ⌂
            </span>
            Room status
          </a>
          <a href="#guest-activity">
            <span className={shellStyles.navIcon} aria-hidden="true">
              ◷
            </span>
            Arrivals & departures
          </a>
          <a href="#booking-history">
            <span className={shellStyles.navIcon} aria-hidden="true">
              ↺
            </span>
            Booking history
          </a>
        </>
      }
    >
      <div className={`${commonStyles.dashboardContent} container-fluid py-4`}>
        <div className={`${commonStyles.pageTitleRow} d-flex align-items-center justify-content-between gap-3 mb-4`}>
          <div>
            <p className={commonStyles.eyebrow}>{todayLabel}</p>
            <h1>Good morning, {staffName.split(" ")[0]}.</h1>
            <p className={commonStyles.subtitle}>
              A smooth arrival makes the whole stay.
            </p>
          </div>
          <Link className={commonStyles.outlineButton} to="/">
            ＋ New guest booking
          </Link>
        </div>

        <div className="row row-cols-2 row-cols-xl-4 g-3 mb-3">
          <article className={`${commonStyles.statCard} card`}>
            <div className={commonStyles.statCardTop}>
              <span>Arrivals today</span>
              <span aria-hidden="true">↘</span>
            </div>
            <strong>{arrivalsToday}</strong>
            <p>Confirmed reservations</p>
          </article>
          <article className={`${commonStyles.statCard} card`}>
            <div className={commonStyles.statCardTop}>
              <span>Departures today</span>
              <span aria-hidden="true">↗</span>
            </div>
            <strong>{departuresToday}</strong>
            <p>Guests marked in house</p>
          </article>
          <article className={`${commonStyles.statCard} card`}>
            <div className={commonStyles.statCardTop}>
              <span>Rooms not occupied</span>
              <span aria-hidden="true">⌂</span>
            </div>
            <strong>
              {readyRooms}
              <span className={commonStyles.statUnit}> rooms</span>
            </strong>
            <p>Based on active room inventory</p>
          </article>
          <article className={`${commonStyles.statCard} card`}>
            <div className={commonStyles.statCardTop}>
              <span>In-house bookings</span>
              <span aria-hidden="true">♧</span>
            </div>
            <strong>{inHouse}</strong>
            <p>Current reservation status</p>
          </article>
        </div>

        <section
          className={`${commonStyles.panelCard} card p-3 mb-3`}
          id="guest-activity"
          aria-labelledby="guest-activity-title"
        >
          <div className={commonStyles.panelHeading}>
            <div>
              <p className={commonStyles.eyebrow}>THE PEOPLE ARRIVING & STAYING</p>
              <h2 id="guest-activity-title">
                Guest activity{" "}
                <span className={commonStyles.countBadge}>
                  {activeBookings.length}
                </span>
              </h2>
            </div>
            <label className="input-group input-group-sm w-auto">
              <span className="input-group-text" aria-hidden="true">⌕</span>
              <input
                aria-label="Search guests, rooms, or booking ID"
                className="form-control"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find a guest or room..."
                value={search}
              />
            </label>
          </div>

          {error && <p role="alert">{error}</p>}
          {isLoading && <p role="status">Loading guest activity...</p>}

          <div className="d-flex align-items-center gap-3 my-3" id="room-status">
            <span>Room status</span>
            <div className="d-flex flex-wrap gap-2" aria-label="Filter by room status">
              {filters.map((item) => (
                <button
                  aria-pressed={filter === item}
                  className={`btn btn-sm ${filter === item ? "btn-success" : "btn-outline-success"}`}
                  key={item}
                  onClick={() => setFilter(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {!isLoading && (
            <BookingTable
              bookings={activeBookings}
              emptyMessage="No active or missed bookings match. Try another room status or search."
              onUpdateBooking={updateBooking}
              today={today}
            />
          )}
          <div className={receptionStyles.tableFooter}>
            Showing <strong>{activeBookings.length}</strong> active bookings
            <button
              className={`${commonStyles.panelLink} ${receptionStyles.tableFooterLink}`}
              type="button"
              onClick={() => {
                setFilter("All rooms");
                setSearch("");
              }}
            >
              Clear filters
            </button>
          </div>
        </section>

        <section
          className={`${commonStyles.panelCard} card p-3 mb-3`}
          id="booking-history"
          aria-labelledby="booking-history-title"
        >
          <div className={commonStyles.panelHeading}>
            <div>
              <p className={commonStyles.eyebrow}>CHECKED-IN & COMPLETED STAYS</p>
              <h2 id="booking-history-title">
                Booking history{" "}
                <span className={commonStyles.countBadge}>
                  {historyBookings.length}
                </span>
              </h2>
            </div>
          </div>
          {error && <p role="alert">{error}</p>}
          {isLoading ? (
            <p role="status">Loading booking history...</p>
          ) : (
            <BookingTable
              bookings={historyBookings}
              emptyMessage="No checked-in or completed bookings found."
              onUpdateBooking={updateBooking}
              today={today}
            />
          )}
        </section>

        <div className={receptionStyles.deskNote}>
          <span aria-hidden="true">✳</span>
          <p>
            <strong>Room readiness</strong> Cleaning and maintenance status are
            not available from the current backend.
          </p>
        </div>
      </div>
    </StaffDashboardShell>
  );
}
