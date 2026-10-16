import { api } from "@/lib/api";
import type { Room } from "@/types/room";

type ApiRoom = Omit<Room, "pricePerNight" | "amenities" | "images"> & {
  price: string | number;
  amenities: string[] | null;
  images: string[] | null;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

function mapRoom(room: ApiRoom): Room {
  return {
    ...room,
    pricePerNight: Number(room.price),
    amenities: room.amenities ?? [],
    images: room.images ?? [],
  };
}

export async function getRooms(
  search: { checkIn?: string; checkOut?: string; capacity?: number } = {},
): Promise<Room[]> {
  const response = await api.get<ApiResponse<ApiRoom[]>>("/rooms", {
    params: search,
  });
  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw new Error("Room list response was invalid");
  }
  return response.data.data.map(mapRoom);
}

export async function getRoomById(id: string): Promise<Room> {
  const response = await api.get<ApiResponse<ApiRoom>>(`/rooms/${id}`);
  if (!response.data.success) {
    throw new Error("Room could not be loaded");
  }
  return mapRoom(response.data.data);
}
