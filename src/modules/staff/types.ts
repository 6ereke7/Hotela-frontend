export type ManagedRoom = {
  id: string;
  name: string;
  category: string;
  rate: number;
  status: "Available" | "Occupied" | "Needs service";
};

export type GuestBooking = {
  id: string;
  guest: string;
  room: string;
  roomStatus: "Ready" | "Occupied" | "Needs service";
  arrival: string;
  departure: string;
  bookingStatus: "Arriving" | "In house" | "Departed";
  checkInDate: string;
  checkOutDate: string;
};

export type Receptionist = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
};

export type ReceptionistInput = Pick<
  Receptionist,
  "firstName" | "lastName" | "email" | "phoneNumber"
> & { password: string };

export type ReceptionistUpdate = Partial<ReceptionistInput> & {
  isActive?: boolean;
};
