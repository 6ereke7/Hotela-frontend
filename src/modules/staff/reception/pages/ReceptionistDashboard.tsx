import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutGridIcon } from "lucide-react";
import { authContext } from "@/app/contexts";
import { StaffDashboardShell, type NavItem } from "../../components/StaffDashboardShell";
import { getStaffOperations, updateGuestBooking } from "../../api";
import type { GuestBooking } from "../../types";
import { BookingHistory } from "../components/BookingHistory";
import { GuestActivity, type RoomFilter } from "../components/GuestActivity";
import { ReceptionStats } from "../components/ReceptionStats";
import styles from "./ReceptionistDashboard.module.css";

function matchesSearch(booking: GuestBooking, query: string) {
  return (
    !query ||
    booking.guest.toLowerCase().includes(query) ||
    booking.room.toLowerCase().includes(query) ||
    booking.id.toLowerCase().includes(query)
  );
}

function getTodayDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const navs: NavItem[] = [
  {
    label: "Overview",
    href: "#overview",
    icon: LayoutGridIcon,
  },
];

export function ReceptionistDashboard() {
  const auth = useContext(authContext);
  const navigate = useNavigate();
  const staffName = auth?.staff?.name;
  const isLoggedOut = auth?.staff === null;
  const [bookings, setBookings] = useState<GuestBooking[]>([]);
  const [roomCount, setRoomCount] = useState(0);
  const [filter, setFilter] = useState<RoomFilter>("All rooms");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const today = getTodayDate();

  useEffect(() => {
    if (isLoggedOut) navigate("/staff");
  }, [isLoggedOut, navigate]);

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
  const activeBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.bookingStatus === "Arriving" &&
          (filter === "All rooms" || booking.roomStatus === filter) &&
          matchesSearch(booking, query),
      ),
    [bookings, filter, query],
  );
  const historyBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          (booking.bookingStatus === "In house" ||
            booking.bookingStatus === "Departed") &&
          matchesSearch(booking, query),
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
      booking.checkOutDate.slice(0, 10) === today,
  ).length;
  const inHouse = bookings.filter(
    (booking) => booking.bookingStatus === "In house",
  ).length;
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <StaffDashboardShell navList={navs}>
      <div className={styles.dashboard}>
        <header className={styles.pageHeader} id="overview">
          <div>
            <p className={styles.eyebrow}>{todayLabel}</p>
            <h1>Good morning, {staffName?.split(" ")[0]}.</h1>
            <p className={styles.subtitle}>
              A smooth arrival makes the whole stay.
            </p>
          </div>
          <Link className={styles.newBookingLink} to="/">
            + New guest booking
          </Link>
        </header>

        <ReceptionStats
          arrivalsToday={arrivalsToday}
          departuresToday={departuresToday}
          inHouse={inHouse}
          readyRooms={Math.max(roomCount - inHouse, 0)}
        />

        {error && (
          <p className={styles.errorMessage} role="alert">
            {error}
          </p>
        )}

        <GuestActivity
          bookings={activeBookings}
          filter={filter}
          isLoading={isLoading}
          onFilterChange={setFilter}
          onSearchChange={setSearch}
          onUpdateBooking={updateBooking}
          search={search}
          today={today}
        />

        <BookingHistory
          bookings={historyBookings}
          isLoading={isLoading}
          onUpdateBooking={updateBooking}
          today={today}
        />

        <aside className={styles.deskNote}>
          <span aria-hidden="true">✳</span>
          <p>
            <strong>Room readiness</strong> Cleaning and maintenance status are
            not available from the current backend.
          </p>
        </aside>
      </div>
    </StaffDashboardShell>
  );
}
