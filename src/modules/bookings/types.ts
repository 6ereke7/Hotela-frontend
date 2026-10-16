export type BookingDetail = {
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  nightlyRate: number;
  nights: number;
  checkInDate: string;
  checkOutDate: string;
};

export type GuestBookingDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  fayda?: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
};

export type GuestBookingInput = GuestBookingDetails & { roomId: string };

export type ConfirmedBooking = {
  id: string;
  status: string;
  totalAmount: string;
};

export type BookingConfirmationResult =
  | { kind: "confirmed"; booking: ConfirmedBooking }
  | { kind: "price_changed"; nightlyRate: number; totalAmount: number };
