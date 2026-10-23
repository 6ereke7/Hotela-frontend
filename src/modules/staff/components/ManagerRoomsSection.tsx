import { useState, type FormEvent } from "react";
import type { ManagedRoom } from "../types";
import { ManagedRoomCard } from "./ManagedRoomCard";
import sectionStyles from "./ManagerRoomsSection.module.css";
import commonStyles from "./StaffDashboardCommon.module.css";

type ManagerRoomsSectionProps = {
  rooms: ManagedRoom[];
  editingRoom: string | null;
  onAddRoom: (room: {
    roomNumber: string;
    type: string;
    price: number;
    capacity: number;
    bedType: string;
    floor: number;
  }) => void;
  onToggleEdit: (roomId: string) => void;
  onSaveRate: (roomId: string, rate: number) => void;
  onDeleteRoom: (roomId: string) => void;
};

export function ManagerRoomsSection({
  rooms,
  editingRoom,
  onAddRoom,
  onToggleEdit,
  onSaveRate,
  onDeleteRoom,
}: ManagerRoomsSectionProps) {
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    type: "",
    price: "200",
    capacity: "2",
    bedType: "Queen",
    floor: "1",
  });

  const handleAddRoom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newRoom.roomNumber.trim() || !newRoom.type.trim()) return;
    onAddRoom({
      roomNumber: newRoom.roomNumber.trim(),
      type: newRoom.type.trim(),
      price: Number(newRoom.price),
      capacity: Number(newRoom.capacity),
      bedType: newRoom.bedType.trim(),
      floor: Number(newRoom.floor),
    });
    setNewRoom((current) => ({ ...current, roomNumber: "", type: "" }));
  };

  return (
    <section className={`${commonStyles.panelCard} card p-3`} aria-labelledby="room-list-title">
      <div className={commonStyles.panelHeading}>
        <div>
          <p className={commonStyles.eyebrow}>PROPERTY INVENTORY</p>
          <h2 id="room-list-title">
            All rooms <span className={commonStyles.countBadge}>{rooms.length}</span>
          </h2>
        </div>
        <form className={`${sectionStyles.addRoomForm} row g-2`} onSubmit={handleAddRoom}>
          <input
            aria-label="Room number"
            className="form-control form-control-sm col-6 col-xl-4"
            onChange={(event) =>
              setNewRoom({ ...newRoom, roomNumber: event.target.value })
            }
            placeholder="Room number"
            required
            value={newRoom.roomNumber}
          />
          <input
            aria-label="Room type"
            className="form-control form-control-sm col-6 col-xl-4"
            onChange={(event) =>
              setNewRoom({ ...newRoom, type: event.target.value })
            }
            placeholder="Room type"
            required
            value={newRoom.type}
          />
          <input
            aria-label="Nightly rate"
            className="form-control form-control-sm col-6 col-xl-4"
            min="1"
            onChange={(event) =>
              setNewRoom({ ...newRoom, price: event.target.value })
            }
            placeholder="Rate"
            type="number"
            value={newRoom.price}
          />
          <input
            aria-label="Capacity"
            className="form-control form-control-sm col-6 col-xl-4"
            min="1"
            onChange={(event) =>
              setNewRoom({ ...newRoom, capacity: event.target.value })
            }
            placeholder="Capacity"
            type="number"
            value={newRoom.capacity}
          />
          <input
            aria-label="Bed type"
            className="form-control form-control-sm col-6 col-xl-4"
            onChange={(event) =>
              setNewRoom({ ...newRoom, bedType: event.target.value })
            }
            placeholder="Bed type"
            required
            value={newRoom.bedType}
          />
          <input
            aria-label="Floor"
            className="form-control form-control-sm col-6 col-xl-4"
            min="1"
            onChange={(event) =>
              setNewRoom({ ...newRoom, floor: event.target.value })
            }
            placeholder="Floor"
            type="number"
            value={newRoom.floor}
          />
          <button className="btn btn-success btn-sm col-12" type="submit">
            ＋ Add room
          </button>
        </form>
      </div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3 mt-2">
        {rooms.map((room) => (
          <div className="col" key={room.id}>
            <ManagedRoomCard
              editing={editingRoom === room.id}
              onDelete={() => onDeleteRoom(room.id)}
              onEdit={() => onToggleEdit(room.id)}
              onSave={(rate) => onSaveRate(room.id, rate)}
              room={room}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
