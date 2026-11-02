import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { mainContext } from "@/app/contexts";
import { buildBookingSummary } from "../utils";
import styles from "./PaymentStep.module.css";

export function PaymentStep() {
  const { room, guest } = useContext(mainContext) ?? {};
  const navigate = useNavigate();

  if (!room || !guest) {
    return (
      <main className={styles.page}>
        <section className={styles.card} aria-labelledby="payment-title">
          <p className={styles.eyebrow}>Booking checkout</p>
          <h1 id="payment-title">Booking details unavailable</h1>
          <p className={styles.description}>
            Return to the stays page to start a new booking.
          </p>
          <button
            className={styles.backButton}
            onClick={() => navigate("/")}
            type="button"
          >
            Browse stays
          </button>
        </section>
      </main>
    );
  }

  const summary = buildBookingSummary(
    room,
    guest.checkIn.toISOString().slice(0, 10),
    guest.checkOut.toISOString().slice(0, 10),
  );

  if (!summary) {
    return (
      <main className={styles.page}>
        <section className={styles.card} aria-labelledby="payment-title">
          <p className={styles.eyebrow}>Booking checkout</p>
          <h1 id="payment-title">Check your stay dates</h1>
          <p className={styles.description}>
            The check-out date must be after the check-in date.
          </p>
          <button
            className={styles.backButton}
            onClick={() => navigate("/book")}
            type="button"
          >
            Back to booking details
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="payment-title">
        <button
          className={styles.backLink}
          onClick={() => navigate("/book")}
          type="button"
        >
          <span aria-hidden="true">←</span> Back to your details
        </button>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Booking checkout · Step 3</p>
          <h1 id="payment-title">Review your stay.</h1>
          <p className={styles.description}>
            Your reservation details are ready. Review the total before
            continuing.
          </p>
        </header>

        <section className={styles.staySummary} aria-labelledby="stay-title">
          <div className={styles.stayHeading}>
            <div>
              <p className={styles.eyebrow}>Your stay</p>
              <h2 id="stay-title">{room.type}</h2>
            </div>
            <span className={styles.roomNumber}>Room {room.roomNumber}</span>
          </div>

          <dl className={styles.details}>
            <div>
              <dt>Guest</dt>
              <dd>
                {guest.firstName} {guest.lastName}
              </dd>
            </div>
            <div>
              <dt>Check in</dt>
              <dd>{summary.checkIn}</dd>
            </div>
            <div>
              <dt>Check out</dt>
              <dd>{summary.checkOut}</dd>
            </div>
            <div>
              <dt>Guests</dt>
              <dd>{guest.guest}</dd>
            </div>
          </dl>
        </section>

        <section className={styles.total} aria-label="Price summary">
          <p>
            ${summary.nightlyRate.toFixed(2)} × {summary.nights}{" "}
            {summary.nights === 1 ? "night" : "nights"}
          </p>
          <div>
            <span>Total due</span>
            <strong>${summary.totalPrice.toLocaleString()}</strong>
          </div>
          <p className={styles.taxNote}>Taxes included</p>
        </section>

        <p className={styles.paymentNotice} role="status">
          Payment options are coming soon. Your booking has not been charged.
        </p>
      </section>
    </main>
  );
}
