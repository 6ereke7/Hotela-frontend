import { useContext, useState, type SubmitEvent } from "react";
import styles from "./BookingCheckoutStep.module.css";
import { MessageCircleMore } from "lucide-react";
import { mainContext, type Guest } from "@/app/contexts";
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

export function BookingCheckoutStep() {
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
    <main className={`${styles.main}`}>
      <section
        className={`${styles.guestSection}`}
        aria-labelledby="checkout-title"
      >
        <a className={styles.backLink} href="/">
          <span aria-hidden="true">←</span> Back to stays
        </a>

        <form className={`${styles.checkoutForm}`} onSubmit={handleSubmit}>
          <label className={`${styles.field} half`}>
            <span>First name</span>
            <input
              autoComplete="given-name"
              className={styles.formInput}
              name="firstName"
              onChange={(event) => setFirstName(event.target.value)}
              required
              value={firstName}
            />
          </label>
          <label className={`${styles.field} half`}>
            <span>Last name</span>
            <input
              autoComplete="family-name"
              className={styles.formInput}
              name="lastName"
              onChange={(event) => setLastName(event.target.value)}
              required
              value={lastName}
            />
          </label>

          <label className={`${styles.field} half`}>
            <span>Email address</span>
            <input
              autoComplete="email"
              className={styles.formInput}
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </label>

          <label className={`${styles.field} half`}>
            <span>Phone number</span>
            <input
              autoComplete="tel"
              className={styles.formInput}
              name="phoneNumber"
              onChange={(event) => setPhoneNumber(event.target.value)}
              required
              type="tel"
              value={phoneNumber}
            />
          </label>
          <label className={`${styles.field} half`}>
            <span>
              Fayda ID <span className={styles.optional}>(optional)</span>
            </span>
            <input
              className={styles.formInput}
              name="fayda"
              onChange={(event) => setFayda(event.target.value)}
              value={fayda}
            />
          </label>
          <label className={`${styles.field} half`}>
            <span>Guests</span>
            <select
              className={styles.formSelect}
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
          <label className={`${styles.field} half`}>
            <span>Check in</span>
            <input
              className={styles.formInput}
              min={today}
              name="checkInDate"
              onChange={(event) => setCheckInDate(event.target.value)}
              required
              type="date"
              value={checkInDate}
            />
          </label>
          <label className={`${styles.field} half`}>
            <span>Check out</span>
            <input
              className={styles.formInput}
              min={checkInDate || today}
              name="checkOutDate"
              onChange={(event) => setCheckOutDate(event.target.value)}
              required
              type="date"
              value={checkOutDate}
            />
          </label>

          <label className={`${styles.field} ${styles.full}`}>
            <span>
              Special requests{" "}
              <span className={styles.optional}>(optional)</span>
            </span>
            <textarea
              className={styles.formInput}
              name="specialRequests"
              onChange={(event) => setSpecialRequests(event.target.value)}
              placeholder="Anything that would make your stay more comfortable?"
              rows={4}
              value={specialRequests}
            />
          </label>

          {error && (
            <p className={styles.errorAlert} role="alert">
              {error}
            </p>
          )}
          <button
            className={styles.submitBtn}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Requesting code..." : "Send verification code"}{" "}
            <MessageCircleMore size={20} />
          </button>
        </form>
        <p className={styles.privacyNote}>
          Your details are only used to manage this reservation.
        </p>
      </section>
      <aside
        className={`${styles.summaryCard}`}
        aria-labelledby="summary-title"
      >
        <p className={styles.eyebrow}>Your stay</p>
        <div className={`${styles.roomArtwork}`} role="img">
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
    </main>
  );
}
