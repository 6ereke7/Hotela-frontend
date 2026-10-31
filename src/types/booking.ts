export type BookingStatus = "Booked" | "In house" | "Completed" | "Cancelled";

export type Booking = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  fayda?: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  totalGuests: number;
  totalAmount: number;
  specialRequests?: string;
  bookingStatus: BookingStatus;
  createdAt: string;
};
