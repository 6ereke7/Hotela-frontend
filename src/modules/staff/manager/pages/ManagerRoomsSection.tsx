import { useEffect, useState } from "react";
import { Loading } from "@/components/Loading";
import { ManagedRoomCard, type RoomChanges } from "../components/ManagedRoomCard";
import sectionStyles from "./ManagerRoomsSection.module.css";
import type { Room } from "@/types/room";
import { getRoomInventory } from "@/modules/rooms/api";
import { updateManagedRoom } from "@/modules/staff/api";

export function ManagerRoomsSection() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getRoomInventory()
      .then((data) => {
        if (!data) throw new Error("Could not load rooms");
        setRooms(data);
      })
      .catch(() => setError("Rooms could not be loaded."))
      .finally(() => setIsLoading(false));
  }, []);

  const saveRoom = async (id: string, changes: RoomChanges) => {
    await updateManagedRoom(id, changes);
    setRooms((current) =>
      current.map((room) => (room.id === id ? { ...room, ...changes } : room)),
    );
  };

  return (
    <section className={sectionStyles.rooms} aria-labelledby="rooms-title">
      <header className={sectionStyles.header}>
        <div>
          <p className={sectionStyles.eyebrow}>Property inventory</p>
          <h1 id="rooms-title">Rooms</h1>
        </div>
        <p>{rooms.length} rooms</p>
      </header>

      {error ? (
        <p className={sectionStyles.message} role="alert">
          {error}
        </p>
      ) : isLoading ? (
        <Loading className={sectionStyles.loading} label="Loading rooms" />
      ) : rooms.length ? (
        <div className={sectionStyles.roomList}>
          {rooms.map((room) => (
            <ManagedRoomCard key={room.id} room={room} onSave={saveRoom} />
          ))}
        </div>
      ) : (
        <p className={sectionStyles.message}>
          No rooms have been added yet.
        </p>
      )}
    </section>
  );
}
