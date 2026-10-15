import { useState } from 'react'
import { GuestCheckoutModal } from '../components/GuestCheckoutModal'
import { OtpVerificationModal } from '../components/OtpVerificationModal'
import type { Room } from '../../../types/room'
import type { BookingSummary } from '../types'

type BookingCheckoutScreenProps = {
  room: Room
  summary: BookingSummary
}

export function BookingCheckoutScreen({ room, summary }: BookingCheckoutScreenProps) {
  const [verificationEmail, setVerificationEmail] = useState('')

  if (verificationEmail) {
    return (
      <OtpVerificationModal
        email={verificationEmail}
        onBackToDetails={() => setVerificationEmail('')}
        room={room}
        summary={summary}
      />
    )
  }

  return (
    <GuestCheckoutModal
      onSendVerificationCode={setVerificationEmail}
      room={room}
      summary={summary}
    />
  )
}
