import { useState, type FormEvent } from 'react'
import type { BookingSummary } from '../types'
import styles from './BookingFlow.module.css'

type GuestCheckoutModalProps = {
  summary: BookingSummary
  onSendVerificationCode: (email: string) => void
}

export function GuestCheckoutModal({
  summary,
  onSendVerificationCode,
}: GuestCheckoutModalProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSendVerificationCode(email.trim())
  }

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
              <span>Full name</span>
              <input
                autoComplete="name"
                name="fullName"
                onChange={(event) => setFullName(event.target.value)}
                placeholder="e.g. Alex Morgan"
                required
                value={fullName}
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
              <span>Special requests <span className={styles.optional}>(optional)</span></span>
              <textarea
                name="specialRequests"
                onChange={(event) => setSpecialRequests(event.target.value)}
                placeholder="Anything that would make your stay more comfortable?"
                rows={4}
                value={specialRequests}
              />
            </label>

            <button className={styles.primaryButton} type="submit">
              Send verification code <span aria-hidden="true">↗</span>
            </button>
            <p className={styles.privacyNote}>
              Your details are only used to manage this reservation.
            </p>
          </form>
        </section>

        <aside className={styles.summaryCard} aria-labelledby="summary-title">
          <p className={styles.eyebrow}>Your stay</p>
          <h2 id="summary-title">A little time away.</h2>
          <div className={styles.roomArtwork} role="img" aria-label="A calm and welcoming guest room">
            <span>HOTELA · PRIVATE STAY</span>
          </div>
          <h3 className={styles.roomName}>{summary.roomType}</h3>
          <dl className={styles.stayDetails}>
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
          </dl>
          <div className={styles.priceBreakdown}>
            <p>
              ${summary.nightlyRate} <span>× {summary.nights} nights</span>
              <strong>${summary.totalPrice.toLocaleString()}</strong>
            </p>
            <p className={styles.totalLine}>
              Total <span>Taxes included</span>
              <strong>${summary.totalPrice.toLocaleString()}</strong>
            </p>
          </div>
          <p className={styles.summaryFootnote}>
            <span aria-hidden="true">✳</span> Flexible arrival. Thoughtful details.
          </p>
        </aside>
      </div>
    </main>
  )
}
