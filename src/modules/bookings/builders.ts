import type { BookingDetail } from "./types";
import type { Room } from "../../types/room";

/**
 * Builds a booking summary from a room and stay defaults.
 * The date math and price calculation live here so the router stays thin.
 */
export function buildBookingSummary(
  room: Room,
  checkInDate: string,
  checkOutDate: string,
): BookingDetail | null {
  const checkIn = new Date(`${checkInDate}T00:00:00`);
  const checkOut = new Date(`${checkOutDate}T00:00:00`);
  const nights = Math.round(
    (checkOut.getTime() - checkIn.getTime()) / 86_400_000,
  );
  if (!Number.isFinite(nights) || nights < 1) return null;

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return {
    checkIn: formatDate(checkIn),
    checkOut: formatDate(checkOut),
    totalPrice: room.pricePerNight * nights,
    nightlyRate: room.pricePerNight,
    nights,
    checkInDate,
    checkOutDate,
  };
}
