import { useState, type FormEvent } from "react";
import type { Room } from "../../../types/room";
import type { GuestBookingDetails } from "../types";
import { buildBookingSummary } from "../builders";
import styles from "./BookingFlow.module.css";

function dateOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

type GuestCheckoutStepProps = {
  room: Room;
  onSendVerificationCode: (details: GuestBookingDetails) => Promise<void>;
  initialCheckInDate?: string;
  initialCheckOutDate?: string;
};

export function GuestCheckoutStep({
  room,
  onSendVerificationCode,
  initialCheckInDate,
  initialCheckOutDate,
}: GuestCheckoutStepProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fayda, setFayda] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [checkInDate, setCheckInDate] = useState(
    () => initialCheckInDate ?? dateOffset(14),
  );
  const [checkOutDate, setCheckOutDate] = useState(
    () => initialCheckOutDate ?? dateOffset(17),
  );
  const [specialRequests, setSpecialRequests] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const detail = buildBookingSummary(room, checkInDate, checkOutDate);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!detail) {
      setError("Check-out must be after check-in.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await onSendVerificationCode({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        ...(fayda.trim() ? { fayda: fayda.trim() } : {}),
        checkInDate,
        checkOutDate,
        numberOfGuests,
        ...(specialRequests.trim()
          ? { specialRequests: specialRequests.trim() }
          : {}),
      });
    } catch {
      setError("Could not start verification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = dateOffset(0);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.wordmark} href="/" aria-label="Hotela home">
          hotela<span>.</span>
        </a>
        <span className={styles.secureLabel}>
          <span aria-hidden="true">◇</span> Your stay, just a few steps away
        </span>
      </header>

      <div className={styles.content}>
        <section className={styles.formPanel} aria-labelledby="checkout-title">
          <a className={styles.backLink} href="/">
            <span aria-hidden="true">←</span> Back to stays
          </a>
          <p className={styles.eyebrow}>Guest checkout · Step 1 of 2</p>
          <h1 id="checkout-title">Let’s make it yours.</h1>
          <p className={styles.intro}>
            Tell us who’s joining us. No account needed — just a quick email
            verification.
          </p>

          <form className={styles.guestForm} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span>First name</span>
              <input
                autoComplete="given-name"
                name="firstName"
                onChange={(event) => setFirstName(event.target.value)}
                required
                value={firstName}
              />
            </label>
            <label className={styles.field}>
              <span>Last name</span>
              <input
                autoComplete="family-name"
                name="lastName"
                onChange={(event) => setLastName(event.target.value)}
                required
                value={lastName}
              />
            </label>

            <label className={styles.field}>
              <span>Email address</span>
              <input
                autoComplete="email"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
              <small>We’ll send your verification code here.</small>
            </label>

            <label className={styles.field}>
              <span>Phone number</span>
              <input
                autoComplete="tel"
                name="phoneNumber"
                onChange={(event) => setPhoneNumber(event.target.value)}
                required
                type="tel"
                value={phoneNumber}
              />
            </label>
            <label className={styles.field}>
              <span>
                Fayda ID <span className={styles.optional}>(optional)</span>
              </span>
              <input
                name="fayda"
                onChange={(event) => setFayda(event.target.value)}
                value={fayda}
              />
            </label>
            <label className={styles.field}>
              <span>Check in</span>
              <input
                min={today}
                name="checkInDate"
                onChange={(event) => setCheckInDate(event.target.value)}
                required
                type="date"
                value={checkInDate}
              />
            </label>
            <label className={styles.field}>
              <span>Check out</span>
              <input
                min={checkInDate || today}
                name="checkOutDate"
                onChange={(event) => setCheckOutDate(event.target.value)}
                required
                type="date"
                value={checkOutDate}
              />
            </label>
            <label className={styles.field}>
              <span>Guests</span>
              <select
                name="numberOfGuests"
                onChange={(event) =>
                  setNumberOfGuests(Number(event.target.value))
                }
                value={numberOfGuests}
              >
                {Array.from(
                  { length: room.capacity },
                  (_, index) => index + 1,
                ).map((count) => (
                  <option key={count} value={count}>
                    {count} {count === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>
                Special requests{" "}
                <span className={styles.optional}>(optional)</span>
              </span>
              <textarea
                name="specialRequests"
                onChange={(event) => setSpecialRequests(event.target.value)}
                placeholder="Anything that would make your stay more comfortable?"
                rows={4}
                value={specialRequests}
              />
            </label>

            {error && (
              <p className={styles.errorMessage} role="alert">
                {error}
              </p>
            )}
            <button
              className={styles.primaryButton}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Requesting code..." : "Send verification code"}{" "}
              <span aria-hidden="true">↗</span>
            </button>
            <p className={styles.privacyNote}>
              Your details are only used to manage this reservation.
            </p>
          </form>
        </section>

        <aside className={styles.summaryCard} aria-labelledby="summary-title">
          <p className={styles.eyebrow}>Your stay</p>
          <h2 id="summary-title">A little time away.</h2>
          <div className={styles.roomArtwork} role="img">
            <img alt="" aria-hidden="true" src={room.images[0]} />
            <span>HOTELA · PRIVATE STAY</span>
          </div>
          <h3 className={styles.roomName}>{room.roomNumber}</h3>
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
