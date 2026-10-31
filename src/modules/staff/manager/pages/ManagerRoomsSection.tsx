import { useEffect, useState } from "react";
import { ManagedRoomCard } from "../components/ManagedRoomCard";
import sectionStyles from "./ManagerRoomsSection.module.css";
import type { Room } from "@/types/room";
import { getRooms } from "@/modules/rooms/api";

export function ManagerRoomsSection() {
  const [rooms, setRooms] = useState<Room[]>([]);
  useEffect(() => {
    async function fetchRooms() {
      const data = await getRooms();
      setRooms(data ?? []);
    }
    fetchRooms();
  }, []);

  return (
    <section className="" aria-labelledby="room-list-title">
      <div className={sectionStyles.roomList}>
        {rooms.map((room) => (
          <div className="" key={room.id}>
            <ManagedRoomCard room={room} />
          </div>
        ))}
      </div>
    </section>
  );
}
