import { api } from "@/lib/api";
import type {
  GuestBooking,
  ManagedRoom,
  Receptionist,
  ReceptionistInput,
  ReceptionistUpdate,
} from "./types";

type ApiResponse<T> = { success: boolean; data: T };

type ApiRoom = {
  id: string;
  roomNumber: string;
  type: string;
  price: string | number;
};

type ApiBooking = {
  id: string;
  roomId: string;
  firstName: string;
  lastName: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
};

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function mapBooking(
  booking: ApiBooking,
  roomNames: Map<string, string>,
): GuestBooking | null {
  if (booking.status === "cancelled") return null;
  const bookingStatus =
    booking.status === "in_house"
      ? "In house"
      : booking.status === "departed"
        ? "Departed"
        : "Arriving";

  return {
    id: booking.id,
    guest: `${booking.firstName} ${booking.lastName}`,
    room: roomNames.get(booking.roomId) ?? "Room unavailable",
    roomStatus: bookingStatus === "In house" ? "Occupied" : "Ready",
    arrival: formatDate(booking.checkInDate),
    departure: formatDate(booking.checkOutDate),
    bookingStatus,
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
  };
}

export async function getStaffOperations() {
  const [roomResponse, bookingResponse] = await Promise.all([
    api.get<ApiResponse<ApiRoom[]>>("/rooms"),
    api.get<ApiResponse<ApiBooking[]>>("/bookings"),
  ]);

  if (!roomResponse.data.success || !bookingResponse.data.success) {
    throw new Error("Could not load hotel operations");
  }

  const occupiedRoomIds = new Set(
    bookingResponse.data.data
      .filter((booking) => booking.status === "in_house")
      .map((booking) => booking.roomId),
  );
  const rooms: ManagedRoom[] = roomResponse.data.data.map((room) => ({
    id: room.id,
    name: room.roomNumber,
    category: room.type,
    rate: Number(room.price),
    status: occupiedRoomIds.has(room.id) ? "Occupied" : "Available",
  }));
  const roomNames = new Map(
    rooms.map((room) => [room.id, `${room.name} · ${room.category}`]),
  );
  const bookings = bookingResponse.data.data
    .map((booking) => mapBooking(booking, roomNames))
    .filter((booking): booking is GuestBooking => booking !== null);

  return { rooms, bookings };
}

export async function createManagedRoom(room: {
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  bedType: string;
  floor: number;
}) {
  const response = await api.post<ApiResponse<ApiRoom>>("/rooms", room);
  const created = response.data.data;
  return {
    id: created.id,
    name: created.roomNumber,
    category: created.type,
    rate: Number(created.price),
    status: "Available" as const,
  };
}

export async function updateManagedRoomRate(id: string, rate: number) {
  await api.patch(`/rooms/${id}`, { price: rate });
}

export async function removeManagedRoom(id: string) {
  await api.delete(`/rooms/${id}`);
}

export async function updateGuestBooking(
  id: string,
  status: "in_house" | "departed",
) {
  await api.patch(`/bookings/${id}`, { status });
}

export async function getReceptionists() {
  const response = await api.get<ApiResponse<Receptionist[]>>("/staff");
  return response.data.data;
}

export async function createReceptionist(input: ReceptionistInput) {
  const response = await api.post<ApiResponse<Receptionist>>("/staff", input);
  return response.data.data;
}

export async function updateReceptionist(
  id: string,
  changes: ReceptionistUpdate,
) {
  const response = await api.patch<ApiResponse<Receptionist>>(
    `/staff/${id}`,
    changes,
  );
  return response.data.data;
}
