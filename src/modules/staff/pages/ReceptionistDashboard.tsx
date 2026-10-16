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
  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const matchesFilter =
          filter === "All rooms" || booking.roomStatus === filter;
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          booking.guest.toLowerCase().includes(query) ||
          booking.room.toLowerCase().includes(query) ||
          booking.id.toLowerCase().includes(query);
        return matchesFilter && matchesSearch;
      }),
    [bookings, filter, search],
  );

  const updateBooking = async (
    bookingId: string,
    nextStatus: GuestBooking["bookingStatus"],
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
      booking.checkInDate === getTodayDate(),
  ).length;
  const departuresToday = bookings.filter(
    (booking) =>
      booking.bookingStatus === "In house" &&
      booking.checkOutDate === getTodayDate(),
  ).length;
  const inHouse = bookings.filter(
    (booking) => booking.bookingStatus === "In house",
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
        </>
      }
    >
      <div className={commonStyles.dashboardContent}>
        <div className={commonStyles.pageTitleRow}>
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

        <div className={commonStyles.statsGrid}>
          <article className={commonStyles.statCard}>
            <div className={commonStyles.statCardTop}>
              <span>Arrivals today</span>
              <span aria-hidden="true">↘</span>
            </div>
            <strong>{arrivalsToday}</strong>
            <p>Confirmed reservations</p>
          </article>
          <article className={commonStyles.statCard}>
            <div className={commonStyles.statCardTop}>
              <span>Departures today</span>
              <span aria-hidden="true">↗</span>
            </div>
            <strong>{departuresToday}</strong>
            <p>Guests marked in house</p>
          </article>
          <article className={commonStyles.statCard}>
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
          <article className={commonStyles.statCard}>
            <div className={commonStyles.statCardTop}>
              <span>In-house bookings</span>
              <span aria-hidden="true">♧</span>
            </div>
            <strong>{inHouse}</strong>
            <p>Current reservation status</p>
          </article>
        </div>

        <section
          className={commonStyles.panelCard}
          id="guest-activity"
          aria-labelledby="guest-activity-title"
        >
          <div className={commonStyles.panelHeading}>
            <div>
              <p className={commonStyles.eyebrow}>THE PEOPLE ARRIVING & STAYING</p>
              <h2 id="guest-activity-title">
                Guest activity{" "}
                <span className={commonStyles.countBadge}>
                  {filteredBookings.length}
                </span>
              </h2>
            </div>
            <label className={receptionStyles.searchInput}>
              <span aria-hidden="true">⌕</span>
              <input
                aria-label="Search guests, rooms, or booking ID"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find a guest or room..."
                value={search}
              />
            </label>
          </div>

          {error && <p role="alert">{error}</p>}
          {isLoading && <p role="status">Loading guest activity...</p>}

          <div className={receptionStyles.filterRow} id="room-status">
            <span>Room status</span>
            <div
              className={receptionStyles.filterButtons}
              aria-label="Filter by room status"
            >
              {filters.map((item) => (
                <button
                  aria-pressed={filter === item}
                  className={filter === item ? receptionStyles.filterActive : ""}
                  key={item}
                  onClick={() => setFilter(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className={receptionStyles.tableWrap}>
            <table className={receptionStyles.bookingTable}>
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
                {!isLoading &&
                  filteredBookings.map((booking) => (
                    <tr key={booking.id}>
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
                            booking.bookingStatus === "In house"
                              ? commonStyles.statusOccupied
                              : booking.bookingStatus === "Departed"
                                ? commonStyles.statusNeedsService
                                : commonStyles.statusArriving
                          }
                        >
                          {booking.bookingStatus}
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
                        {booking.bookingStatus === "Arriving" ? (
                          <button
                            className={receptionStyles.tableAction}
                            onClick={() =>
                              updateBooking(booking.id, "In house")
                            }
                            type="button"
                          >
                            Check in
                          </button>
                        ) : booking.bookingStatus === "In house" ? (
                          <button
                            className={receptionStyles.tableActionSecondary}
                            onClick={() =>
                              updateBooking(booking.id, "Departed")
                            }
                            type="button"
                          >
                            Check out
                          </button>
                        ) : (
                          <span className={receptionStyles.completedText}>
                            Complete ✓
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {!isLoading && filteredBookings.length === 0 && (
              <p className={receptionStyles.emptyState}>
                No guest bookings match. Try another room status or search.
              </p>
            )}
          </div>
          <div className={receptionStyles.tableFooter}>
            Showing <strong>{filteredBookings.length}</strong> of{" "}
            <strong>{bookings.length}</strong> bookings
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
