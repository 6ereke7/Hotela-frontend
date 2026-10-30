import {
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ClipboardEvent,
  type SubmitEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { mainContext, type Guest } from "@/app/providers";
import { buildBookingSummary } from "../utils";
import { requestOtp, verifyOtp } from "../api";
import styles from "./BookingFlow.module.css";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

function toBookingDetails(guest: Guest): {
  email: string;
  checkInDate: string;
  checkOutDate: string;
} {
  const pad = (value: number) => String(value).padStart(2, "0");
  return {
    email: guest.email,
    checkInDate: `${guest.checkIn.getFullYear()}-${pad(guest.checkIn.getMonth() + 1)}-${pad(guest.checkIn.getDate())}`,
    checkOutDate: `${guest.checkOut.getFullYear()}-${pad(guest.checkOut.getMonth() + 1)}-${pad(guest.checkOut.getDate())}`,
  };
}

export function OtpVerificationStep() {
  const { room, guest } = useContext(mainContext) ?? {};
  const navigate = useNavigate();

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [verificationCode, setVerificationCode] = useState<string>();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const nightlyRate = room?.pricePerNight ?? 0;
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

  if (!room || !guest) {
    return (
      <main className={`${styles.page} container-xl px-3`}>
        <p>No booking details found. Please start over.</p>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/")}
          type="button"
        >
          Return home
        </button>
      </main>
    );
  }

  const booking = toBookingDetails(guest);
  const detail = buildBookingSummary(
    { ...room, pricePerNight: nightlyRate },
    booking.checkInDate,
    booking.checkOutDate,
  );

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
      const response = await requestOtp({ email: booking.email });
      if (response) {
        setVerificationCode("");
        setSecondsLeft(RESEND_SECONDS);
        setDigits(Array(CODE_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      } else {
        setError("Could not resend the code. Please try again.");
      }
    } catch {
      setError("Could not resend the code. Please try again.");
    }
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (digits.some((digit) => digit === "")) {
      setError("Enter all 6 digits to continue.");
      return;
    }
    if (!detail) {
      setError("Check-out must be after check-in.");
      return;
    }
    setError("");
    setPriceChanged(false);
    setIsVerifying(true);
    try {
      const confirmed = await verifyOtp({
        email: booking.email,
        code: digits.join(""),
      });
      if (confirmed) {
        navigate("/payment");
      } else {
        setError("That code is invalid or expired. Please try again.");
      }
    } catch {
      setError(
        "That code is invalid or expired, or the room is no longer available.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className={`${styles.page} container-xl px-3`}>
      <header className="d-flex align-items-center justify-content-between border-bottom py-3">
        <a className={styles.wordmark} href="/" aria-label="Hotela home">
          hotela<span>.</span>
        </a>
        <span className={styles.secureLabel}>
          <span aria-hidden="true">Shield</span> A little security, a lot of
          peace of mind
        </span>
      </header>

      <section className={styles.otpPanel} aria-labelledby="otp-title">
        <button
          className={styles.backLink}
          onClick={() => navigate("/book")}
          type="button"
        >
          <span aria-hidden="true">Back</span> Back to your details
        </button>
        <div className={styles.mailMark} aria-hidden="true">
          Mail
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
            <strong>${detail.totalPrice.toLocaleString()}</strong> ($
            {detail.nightlyRate.toFixed(2)} per night × {detail.nights} nights)
          </p>
        )}
        {priceChanged && detail && (
          <p className={styles.priceChangedMessage} role="status">
            The room rate changed. Your booking was not submitted. Review the
            updated total above and select "Verify &amp; confirm booking" again
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
            Didn't get a code?{" "}
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
            disabled={isVerifying}
            type="submit"
          >
            {isVerifying ? "Verifying..." : "Verify & confirm booking"}
          </button>
        </form>
      </section>
    </main>
  );
}
