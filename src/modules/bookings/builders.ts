import type { BookingSummary } from './types'
import type { Room } from '../../types/room'

/**
 * Builds a booking summary from a room and stay defaults.
 * The date math and price calculation live here so the router stays thin.
 * When the backend arrives, this is the only place that changes.
 */
export function buildBookingSummary(
  room: Room,
  checkInOffsetDays = 14,
  nights = 3,
): BookingSummary {
  const checkIn = new Date()
  checkIn.setDate(checkIn.getDate() + checkInOffsetDays)

  const checkOut = new Date(checkIn)
  checkOut.setDate(checkOut.getDate() + nights)

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  return {
    checkIn: formatDate(checkIn),
    checkOut: formatDate(checkOut),
    totalPrice: room.pricePerNight * nights,
    nightlyRate: room.pricePerNight,
    nights,
  }
}