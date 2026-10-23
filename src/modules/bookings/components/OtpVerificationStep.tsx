import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import type { Room } from "../../../types/room";
import type {
  BookingConfirmationResult,
  ConfirmedBooking,
  GuestBookingInput,
} from "../types";
import { buildBookingSummary } from "../builders";
import { requestOtp } from "../api";
import styles from "./BookingFlow.module.css";

type OtpVerificationStepProps = {
  booking: GuestBookingInput;
  verificationCode?: string;
  onBackToDetails: () => void;
  onConfirm: (
    code: string,
    quotedTotal: string,
  ) => Promise<BookingConfirmationResult>;
  room: Room;
};

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;
export function OtpVerificationStep({
  booking,
  verificationCode: initialVerificationCode,
  onBackToDetails,
  onConfirm,
  room,
}: OtpVerificationStepProps) {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [verificationCode, setVerificationCode] = useState(
    initialVerificationCode,
  );
  const [confirmedBooking, setConfirmedBooking] =
    useState<ConfirmedBooking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [nightlyRate, setNightlyRate] = useState(room.pricePerNight);
  const [priceChanged, setPriceChanged] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timeoutId = window.setTimeout(
      () => setSecondsLeft((remaining) => Math.max(remaining - 1, 0)),
      1000,
    );
    return () => window.clearTimeout(timeoutId);
  }, [secondsLeft]);

  const fillDigits = (startIndex: number, value: string) => {
    const values = value.replace(/\D/g, "").slice(0, CODE_LENGTH - startIndex);
    if (!values) return;
    setDigits((current) => {
      const updated = [...current];
      for (const [offset, digit] of [...values].entries()) {
        updated[startIndex + offset] = digit;
      }
      return updated;
    });
    setError("");
    const nextIndex = Math.min(startIndex + values.length, CODE_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    fillDigits(index, value);
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    fillDigits(0, event.clipboardData.getData("text"));
  };

  const handleResend = async () => {
    setError("");
    try {
      const response = await requestOtp(booking.email);
      setVerificationCode(response.devCode);
      setSecondsLeft(RESEND_SECONDS);
      setDigits(Array(CODE_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch {
      setError("Could not resend the code. Please try again.");
    }
  };

  const detail = buildBookingSummary(
    { ...room, pricePerNight: nightlyRate },
    booking.checkInDate,
    booking.checkOutDate,
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (digits.some((digit) => digit === "")) {
      setError("Enter all 6 digits to continue.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      if (!detail) {
        setError("Check-out must be after check-in.");
        return;
      }
      const result = await onConfirm(
        digits.join(""),
        detail.totalPrice.toFixed(2),
      );
      if (result.kind === "price_changed") {
        setNightlyRate(result.nightlyRate);
        setPriceChanged(true);
      } else {
        setConfirmedBooking(result.booking);
      }
    } catch {
      setError(
        "That code is invalid or expired, or the room is no longer available.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmedBooking && detail) {
    const bookingReference = confirmedBooking.id.slice(0, 8).toUpperCase();
    const total = Number(confirmedBooking.totalAmount);
    return (
      <main className={`${styles.page} container-xl px-3`}>
        <header className="d-flex align-items-center justify-content-between border-bottom py-3">
          <a className={styles.wordmark} href="/" aria-label="Hotela home">
            hotela<span>.</span>
          </a>
          <span className={styles.secureLabel}>Your stay is confirmed</span>
        </header>

        <section
          className={`${styles.confirmation} mx-auto`}
          aria-labelledby="confirmation-title"
        >
          <div className={styles.successMark} aria-hidden="true">
            ✓
          </div>
          <p className={styles.eyebrow}>A very good choice</p>
          <h1 id="confirmation-title">It’s official. We’ll save you a room.</h1>
          <p className={styles.confirmationIntro}>
            Your stay details are ready for <strong>{booking.email}</strong>.
          </p>
          <article className={styles.ticket}>
            <div className={styles.ticketTop}>
              <div>
                <p className={styles.eyebrow}>Booking reference</p>
                <h2>{bookingReference}</h2>
              </div>
              <span className={styles.confirmedBadge}>Confirmed</span>
            </div>
            <div className={styles.ticketRoom}>
              <img
                alt=""
                aria-hidden="true"
                className={styles.ticketArtwork}
                src={room.images[0]}
              />
              <div>
                <p className={styles.ticketLabel}>Your room</p>
                <h3>{room.roomNumber}</h3>
              </div>
            </div>
            <dl className={styles.ticketDetails}>
              <div>
                <dt>Check in</dt>
                <dd>{detail.checkIn}</dd>
              </div>
              <div>
                <dt>Check out</dt>
                <dd>{detail.checkOut}</dd>
              </div>
              <div>
                <dt>Length of stay</dt>
                <dd>{detail.nights} nights</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>${total.toLocaleString()}</dd>
              </div>
            </dl>
            <p className={styles.ticketNote}>
              Keep this reference handy for your arrival.
            </p>
          </article>
          <a className={styles.secondaryLink} href="/">
            Return to Hotela <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className={`${styles.page} container-xl px-3`}>
      <header className="d-flex align-items-center justify-content-between border-bottom py-3">
        <a className={styles.wordmark} href="/" aria-label="Hotela home">
          hotela<span>.</span>
        </a>
        <span className={styles.secureLabel}>
          <span aria-hidden="true">◇</span> A little security, a lot of peace of
          mind
        </span>
      </header>

      <section className={styles.otpPanel} aria-labelledby="otp-title">
        <button
          className={styles.backLink}
          onClick={onBackToDetails}
          type="button"
        >
          <span aria-hidden="true">←</span> Back to your details
        </button>
        <div className={styles.mailMark} aria-hidden="true">
          ✉
        </div>
        <p className={styles.eyebrow}>Guest checkout · Step 2 of 2</p>
        <h1 id="otp-title">Check your inbox.</h1>
        <p className={styles.intro}>
          Enter the 6-digit code requested for <strong>{booking.email}</strong>{" "}
          to confirm your booking.
        </p>
        {detail && (
          <p className={styles.priceQuote} aria-live="polite">
            Current stay total:{" "}
            <strong>${detail.totalPrice.toLocaleString()}</strong>{" "}
            (${detail.nightlyRate.toFixed(2)} per night × {detail.nights}{" "}
            nights)
          </p>
        )}
        {priceChanged && detail && (
          <p className={styles.priceChangedMessage} role="status">
            The room rate changed. Your booking was not submitted. Review the
            updated total above and select “Verify &amp; confirm booking” again
            to accept it.
          </p>
        )}

        <form className={styles.otpForm} onSubmit={handleSubmit}>
          <fieldset className={styles.codeFieldset}>
            <legend className={styles.visuallyHidden}>
              6-digit verification code
            </legend>
            <div className={styles.codeInputs}>
              {digits.map((digit, index) => (
                <input
                  aria-label={`Verification code digit ${index + 1}`}
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  className="form-control text-center"
                  inputMode="numeric"
                  key={index}
                  maxLength={CODE_LENGTH}
                  onChange={(event) => handleChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  value={digit}
                />
              ))}
            </div>
          </fieldset>
          {error && (
            <p className="alert alert-danger py-2" role="alert">
              {error}
            </p>
          )}
          {verificationCode && (
            <p className={styles.privacyNote} role="status">
              Development verification code: <strong>{verificationCode}</strong>
            </p>
          )}

          <p className={styles.resendText}>
            Didn’t get a code?{" "}
            {secondsLeft > 0 ? (
              <span>Resend in 0:{String(secondsLeft).padStart(2, "0")}</span>
            ) : (
              <button
                className={styles.inlineButton}
                onClick={handleResend}
                type="button"
              >
                Resend code
              </button>
            )}
          </p>

          <button
            className="btn btn-success w-100 py-3"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Verifying..." : "Verify & confirm booking"}{" "}
            <span aria-hidden="true">↗</span>
          </button>
        </form>
      </section>
    </main>
  );
}
