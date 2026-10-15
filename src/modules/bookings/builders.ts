import type { BookingSummary } from './types'

/**
 * Minimal room fields needed to build a booking summary.
 * Deliberately kept small so the bookings module does not need to import
 * the rooms module — shared code flows shared -> modules, never across modules.
 */
export type RoomSummary = {
  roomId: string
  roomType: string
  pricePerNight: number
}

/**
 * Builds a booking summary from a room and stay defaults.
 * The date math and price calculation live here so the router stays thin.
 * When the backend arrives, this is the only place that changes.
 */
export function buildBookingSummary(
  room: RoomSummary,
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
    roomId: room.roomId,
    roomType: room.roomType,
    checkIn: formatDate(checkIn),
    checkOut: formatDate(checkOut),
    totalPrice: room.pricePerNight * nights,
    nightlyRate: room.pricePerNight,
    nights,
  }
}