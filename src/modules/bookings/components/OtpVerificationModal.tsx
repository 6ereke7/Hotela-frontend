import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ClipboardEvent } from 'react'
import type { Room } from '../../../types/room'
import type { BookingSummary } from '../types'
import styles from './BookingFlow.module.css'

type OtpVerificationModalProps = {
  email: string
  onBackToDetails: () => void
  room: Room
  summary: BookingSummary
}

const CODE_LENGTH = 6
const RESEND_SECONDS = 30
const MOCK_BOOKING_REFERENCE = 'HTL-482917'

export function OtpVerificationModal({
  email,
  onBackToDetails,
  room,
  summary,
}: OtpVerificationModalProps) {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (secondsLeft === 0) return
    const timeoutId = window.setTimeout(
      () => setSecondsLeft((remaining) => Math.max(remaining - 1, 0)),
      1000,
    )
    return () => window.clearTimeout(timeoutId)
  }, [secondsLeft])

  const fillDigits = (startIndex: number, value: string) => {
    const values = value.replace(/\D/g, '').slice(0, CODE_LENGTH - startIndex)
    if (!values) return
    setDigits((current) => {
      const updated = [...current]
      for (const [offset, digit] of [...values].entries()) {
        updated[startIndex + offset] = digit
      }
      return updated
    })
    setError('')
    const nextIndex = Math.min(startIndex + values.length, CODE_LENGTH - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleChange = (index: number, value: string) => {
    fillDigits(index, value)
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    fillDigits(0, event.clipboardData.getData('text'))
  }

  const handleResend = () => {
    setDigits(Array(CODE_LENGTH).fill(''))
    setError('')
    setSecondsLeft(RESEND_SECONDS)
    inputRefs.current[0]?.focus()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (digits.some((digit) => digit === '')) {
      setError('Enter all 6 digits to continue.')
      return
    }
    setIsConfirmed(true)
  }

  if (isConfirmed) {
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <a className={styles.wordmark} href="/" aria-label="Hotela home">
            hotela<span>.</span>
          </a>
          <span className={styles.secureLabel}>Your stay is confirmed</span>
        </header>

        <section className={styles.confirmation} aria-labelledby="confirmation-title">
          <div className={styles.successMark} aria-hidden="true">✓</div>
          <p className={styles.eyebrow}>A very good choice</p>
          <h1 id="confirmation-title">It’s official. We’ll save you a room.</h1>
          <p className={styles.confirmationIntro}>
            Your stay details are on their way to <strong>{email}</strong>. We
            can’t wait to welcome you.
          </p>

          <article className={styles.ticket}>
            <div className={styles.ticketTop}>
              <div>
                <p className={styles.eyebrow}>Booking reference</p>
                <h2>{MOCK_BOOKING_REFERENCE}</h2>
              </div>
              <span className={styles.confirmedBadge}>Confirmed</span>
            </div>
            <div className={styles.ticketRoom}>
              <img alt="" aria-hidden="true" className={styles.ticketArtwork} src={room.image} />
              <div>
                <p className={styles.ticketLabel}>Your room</p>
                <h3>{room.name}</h3>
              </div>
            </div>
            <dl className={styles.ticketDetails}>
              <div>
                <dt>Check in</dt>
                <dd>{summary.checkIn}</dd>
              </div>
              <div>
                <dt>Check out</dt>
                <dd>{summary.checkOut}</dd>
              </div>
              <div>
                <dt>Length of stay</dt>
                <dd>{summary.nights} nights</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>${summary.totalPrice.toLocaleString()}</dd>
              </div>
            </dl>
            <p className={styles.ticketNote}>
              Keep this reference handy. A confirmation email is on its way.
            </p>
          </article>

          <a className={styles.secondaryLink} href="/">
            Return to Hotela <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.wordmark} href="/" aria-label="Hotela home">
          hotela<span>.</span>
        </a>
        <span className={styles.secureLabel}>
          <span aria-hidden="true">◇</span> A little security, a lot of peace of mind
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
        <div className={styles.mailMark} aria-hidden="true">✉</div>
        <p className={styles.eyebrow}>Guest checkout · Step 2 of 2</p>
        <h1 id="otp-title">Check your inbox.</h1>
        <p className={styles.intro}>
          Enter the 6-digit code sent to <strong>{email}</strong> to confirm your
          booking.
        </p>

        <form className={styles.otpForm} onSubmit={handleSubmit}>
          <fieldset className={styles.codeFieldset}>
            <legend className={styles.visuallyHidden}>6-digit verification code</legend>
            <div className={styles.codeInputs}>
              {digits.map((digit, index) => (
                <input
                  aria-label={`Verification code digit ${index + 1}`}
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  inputMode="numeric"
                  key={index}
                  maxLength={CODE_LENGTH}
                  onChange={(event) => handleChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                  ref={(element) => {
                    inputRefs.current[index] = element
                  }}
                  value={digit}
                />
              ))}
            </div>
          </fieldset>
          {error && <p className={styles.errorMessage} role="alert">{error}</p>}

          <p className={styles.resendText}>
            Didn’t get a code?{' '}
            {secondsLeft > 0 ? (
              <span>Resend in 0:{String(secondsLeft).padStart(2, '0')}</span>
            ) : (
              <button className={styles.inlineButton} onClick={handleResend} type="button">
                Resend code
              </button>
            )}
          </p>

          <button className={styles.primaryButton} type="submit">
            Verify &amp; confirm booking <span aria-hidden="true">↗</span>
          </button>
          <p className={styles.privacyNote}>
            This demo accepts any 6-digit code.
          </p>
        </form>
      </section>
    </main>
  )
}
