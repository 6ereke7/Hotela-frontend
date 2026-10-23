import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CalendarDays, Search, UsersRound } from "lucide-react";
import styles from "./Filter.module.css";

export default function Filter() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [checkIn, setCheckIn] = useState(
    () => searchParams.get("checkIn") ?? "",
  );
  const [checkOut, setCheckOut] = useState(
    () => searchParams.get("checkOut") ?? "",
  );
  const [guests, setGuests] = useState(searchParams.get("guests") ?? "2");
  const today = new Date();
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const minDate = formatDate(today);
  const minCheckOutDate = checkIn ? new Date(`${checkIn}T00:00:00`) : today;
  if (checkIn) {
    minCheckOutDate.setDate(minCheckOutDate.getDate() + 1);
  }

  function handleCheckInChange(value: string) {
    setCheckIn(value);
    if (checkOut && checkOut <= value) {
      setCheckOut("");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    new FormData(event.currentTarget).forEach((value, key) =>
      params.set(key, String(value)),
    );
    navigate(`/catalog?${params.toString()}`);
  }

  return (
    <form
      className={`${styles.searchBar} card shadow-sm p-3 p-lg-4`}
      onSubmit={handleSubmit}
    >
      <div className="row g-2 align-items-stretch">
        <label className="col-12 col-md-6 col-xl-3">
          <CalendarDays
            className="text-success me-2"
            size={20}
            aria-hidden="true"
          />
          <span className="small fw-semibold text-secondary">Check in</span>
          <input
            className="form-control form-control-sm mt-1"
            type="date"
            name="checkIn"
            aria-label="Check-in date"
            min={minDate}
            value={checkIn}
            onChange={(event) => handleCheckInChange(event.target.value)}
            required
          />
        </label>

        <label className="col-12 col-md-6 col-xl-3">
          <CalendarDays
            className="text-success me-2"
            size={20}
            aria-hidden="true"
          />
          <span className="small fw-semibold text-secondary">Check out</span>
          <input
            className="form-control form-control-sm mt-1"
            type="date"
            name="checkOut"
            aria-label="Check-out date"
            min={formatDate(minCheckOutDate)}
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
            required
          />
        </label>

        <label className="col-12 col-md-6 col-xl-3">
          <UsersRound
            className="text-success me-2"
            size={20}
            aria-hidden="true"
          />
          <span className="small fw-semibold text-secondary">Guests</span>
          <select
            className="form-select form-select-sm mt-1"
            name="guests"
            onChange={(event) => setGuests(event.target.value)}
            value={guests}
            aria-label="Number of guests"
          >
            <option value="1">1 guest</option>
            <option value="2">2 guests</option>
            <option value="3">3 guests</option>
            <option value="4">4 guests</option>
          </select>
        </label>

        <button
          className="col-12 col-md-6 col-xl-3 btn btn-success d-flex align-items-center justify-content-center gap-3"
          type="submit"
        >
          <span>Find a room</span>
          <Search size={18} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
