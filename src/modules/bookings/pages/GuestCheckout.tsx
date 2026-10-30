import { useContext, useState, type SubmitEvent } from "react";
import styles from "./BookingFlow.module.css";
import { MessageCircleMore } from "lucide-react";
import { mainContext, type Guest } from "@/app/providers";
import type { Room } from "@/types/room";
import { buildBookingSummary } from "../utils";
import { requestOtp } from "../api";
import { useNavigate } from "react-router-dom";

function dateOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function GuestCheckout() {
  const { room, setGuest } = useContext(mainContext) ?? {};
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fayda, setFayda] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [checkInDate, setCheckInDate] = useState(dateOffset(14));
  const [checkOutDate, setCheckOutDate] = useState(dateOffset(17));
  const [specialRequests, setSpecialRequests] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = dateOffset(0);
  const detail = buildBookingSummary(room as Room, checkInDate, checkOutDate);

  const guest: Guest = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phoneNumber,
    fayda: fayda,
    checkIn: new Date(checkInDate),
    checkOut: new Date(checkOutDate),
    guest: numberOfGuests,
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (!room) return;

    setIsSubmitting(true);
    setError("");

    try {
      const requested = await requestOtp({ email });
      if (requested) {
        setGuest?.(guest);
        navigate("/otp");
      } else {
        setError("Failed to send verification code. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Could not send verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={`${styles.page} container-xl px-3`}>
      <div className="row g-4 g-xl-5 py-5">
        <section className="col-lg-7" aria-labelledby="checkout-title">
          <a className={styles.backLink} href="/">
            <span aria-hidden="true">←</span> Back to stays
          </a>
          <p className={styles.eyebrow}>Guest checkout · Step 1 of 2</p>
          <h1 id="checkout-title">Let’s make it yours.</h1>
          <p className={styles.intro}>
            Tell us who’s joining us. No account needed. just a quick email
            verification.
          </p>

          <form className="row g-3 align-items-center" onSubmit={handleSubmit}>
            <label className={`${styles.field} col-md-6`}>
              <span>First name</span>
              <input
                autoComplete="given-name"
                className="form-control"
                name="firstName"
                onChange={(event) => setFirstName(event.target.value)}
                required
                value={firstName}
              />
            </label>
            <label className={`${styles.field} col-md-6`}>
              <span>Last name</span>
              <input
                autoComplete="family-name"
                className="form-control"
                name="lastName"
                onChange={(event) => setLastName(event.target.value)}
                required
                value={lastName}
              />
            </label>

            <label className={`${styles.field} col-md-6`}>
              <span>Email address</span>
              <input
                autoComplete="email"
                className="form-control"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </label>

            <label className={`${styles.field} col-md-6`}>
              <span>Phone number</span>
              <input
                autoComplete="tel"
                className="form-control"
                name="phoneNumber"
                onChange={(event) => setPhoneNumber(event.target.value)}
                required
                type="tel"
                value={phoneNumber}
              />
            </label>
            <label className={`${styles.field} col-md-6`}>
              <span>
                Fayda ID <span className={styles.optional}>(optional)</span>
              </span>
              <input
                className="form-control"
                name="fayda"
                onChange={(event) => setFayda(event.target.value)}
                value={fayda}
              />
            </label>
            <label className={`${styles.field} col-md-6`}>
              <span>Guests</span>
              <select
                className="form-select"
                name="numberOfGuests"
                onChange={(event) =>
                  setNumberOfGuests(Number(event.target.value))
                }
                value={numberOfGuests}
              >
                {Array.from(
                  { length: room?.capacity ?? 0 },
                  (_, index) => index + 1,
                ).map((count) => (
                  <option key={count} value={count}>
                    {count} {count === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </label>
            <label className={`${styles.field} col-md-6`}>
              <span>Check in</span>
              <input
                className="form-control"
                min={today}
                name="checkInDate"
                onChange={(event) => setCheckInDate(event.target.value)}
                required
                type="date"
                value={checkInDate}
              />
            </label>
            <label className={`${styles.field} col-md-6`}>
              <span>Check out</span>
              <input
                className="form-control"
                min={checkInDate || today}
                name="checkOutDate"
                onChange={(event) => setCheckOutDate(event.target.value)}
                required
                type="date"
                value={checkOutDate}
              />
            </label>

            <label className={`${styles.field} col-12`}>
              <span>
                Special requests{" "}
                <span className={styles.optional}>(optional)</span>
              </span>
              <textarea
                className="form-control"
                name="specialRequests"
                onChange={(event) => setSpecialRequests(event.target.value)}
                placeholder="Anything that would make your stay more comfortable?"
                rows={4}
                value={specialRequests}
              />
            </label>

            {error && (
              <p className="alert alert-danger py-2 col-12 mb-0" role="alert">
                {error}
              </p>
            )}
            <button
              className="btn btn-success w-100 py-3"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Requesting code..." : "Send verification code"}{" "}
              <MessageCircleMore size={20} />
            </button>
            <p className="text-center text-secondary small col-12">
              Your details are only used to manage this reservation.
            </p>
          </form>
        </section>
        <aside
          className={`${styles.summaryCard} card p-3 p-md-4 col-lg-5 align-self-start sticky-lg-top`}
          aria-labelledby="summary-title"
        >
          <p className={styles.eyebrow}>Your stay</p>
          <div className={styles.roomArtwork} role="img">
            <img alt="" aria-hidden="true" src={room?.images[0]} />
            <span>HOTELA · PRIVATE STAY</span>
          </div>
          <h3 className={styles.roomName}>{room?.roomNumber}</h3>
          <dl className={styles.stayDetails}>
            <div>
              <dt>Check in</dt>
              <dd>{detail?.checkIn ?? "Choose dates"}</dd>
            </div>
            <div>
              <dt>Check out</dt>
              <dd>{detail?.checkOut ?? "Choose dates"}</dd>
            </div>
            <div>
              <dt>Length of stay</dt>
              <dd>{detail?.nights ?? 0} nights</dd>
            </div>
          </dl>
          <div className={styles.priceBreakdown}>
            <p>
              ${detail?.nightlyRate ?? 0}{" "}
              <span>× {detail?.nights ?? 0} nights</span>
              <strong>${detail?.totalPrice.toLocaleString() ?? 0}</strong>
            </p>
            <p className={styles.totalLine}>
              Total <span>Taxes included</span>
              <strong>${detail?.totalPrice.toLocaleString() ?? 0}</strong>
            </p>
          </div>
          <p className={styles.summaryFootnote}>
            <span aria-hidden="true">✳</span> Flexible arrival. Thoughtful
            details.
          </p>
        </aside>
      </div>
    </main>
  );
}
