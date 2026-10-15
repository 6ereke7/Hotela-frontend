import { useState } from 'react'
import { GuestCheckoutModal } from '../components/GuestCheckoutModal'
import { OtpVerificationModal } from '../components/OtpVerificationModal'
import type { BookingSummary } from '../types'

type BookingCheckoutScreenProps = {
  summary: BookingSummary
}

export function BookingCheckoutScreen({ summary }: BookingCheckoutScreenProps) {
  const [verificationEmail, setVerificationEmail] = useState('')

  if (verificationEmail) {
    return (
      <OtpVerificationModal
        email={verificationEmail}
        onBackToDetails={() => setVerificationEmail('')}
        summary={summary}
      />
    )
  }

  return (
    <GuestCheckoutModal
      onSendVerificationCode={setVerificationEmail}
      summary={summary}
    />
  )
}
