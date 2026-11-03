import { api, type ApiResponse } from "@/lib/api";
import type { Room } from "./types";
import QueryString from "qs";

export { getRoomById } from "@/lib/roomsApi";
export type RoomFilter = {
  id?: string;
  roomType?: string;
  roomNumber?: string;
  floor?: number;
  bedType?: string;
  amenities?: string[];
  capacity?: number;
};
export async function getRooms(
  search: RoomFilter = {},
): Promise<Room[] | undefined> {
  return getRoomList("/rooms", search);
}

export async function getRoomInventory(
  search: RoomFilter = {},
): Promise<Room[] | undefined> {
  return getRoomList("/rooms/inventory", search);
}

async function getRoomList(
  path: string,
  search: RoomFilter,
): Promise<Room[] | undefined> {
  try {
    const response = await api.get<ApiResponse<Room[]>>(path, {
      params: search,
      paramsSerializer: (params) => {
        return QueryString.stringify(params, { arrayFormat: "repeat" });
      },
    });
    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error("Room list response was invalid");
    }
    return response.data.data.map((room) => ({
      ...room,
      pricePerNight: Number(room.pricePerNight),
      amenities: room.amenities ?? [],
      images: room.images ?? [],
    }));
  } catch (error) {
    console.error(error);
  }
}
