import {
  Edit2Icon,
  FanIcon,
  FenceIcon,
  ForkKnifeCrossed,
  LockKeyholeIcon,
  SaveIcon,
  Tv2Icon,
  WifiIcon,
  WineIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react";
import roomStyles from "./ManagedRoomCard.module.css";
import type { Room } from "@/types/room";
import { useState } from "react";

type ManagedRoomCardProps = {
  room: Room;
};
export function ManagedRoomCard({ room }: ManagedRoomCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <article className={roomStyles.managedRoomCard}>
      <img
        src={room.images[0]}
        alt={`Room ${room.type}`}
        className={roomStyles.roomImage}
      />
      {isEditing ? (
        <EditRoomForm room={room} onClose={() => setIsEditing(false)} />
      ) : (
        <RoomDetails room={room} onEdit={() => setIsEditing(true)} />
      )}
    </article>
  );
}

const amenityMap: Record<string, LucideIcon> = {
  WiFi: WifiIcon,
  tv: Tv2Icon,
  ac: FanIcon,
  minibar: WineIcon,
  safe: LockKeyholeIcon,
  balcony: FenceIcon,
  breakfast: ForkKnifeCrossed,
};

function RoomDetails({ room, onEdit }: { room: Room; onEdit: () => void }) {
  return (
    <div className={roomStyles.details}>
      <div className={roomStyles.header}>
        <h3>
          {room.roomNumber} - {room.type}
        </h3>
        <button onClick={onEdit}>
          <Edit2Icon />
        </button>
      </div>
      <p>Price: ${room.pricePerNight} / night</p>
      <p>
        Capacity: {room.capacity} person{room.capacity > 1 ? "s" : ""}
      </p>
      <p>Floor: {room.floor}</p>
      <p>Status: {room.status}</p>
      <div className={roomStyles.amenitiesContainer}>
        {room.amenities?.map((amenity) => {
          const Icon = amenityMap[amenity];
          return (
            <div key={amenity} className={roomStyles.amenity}>
              {Icon ? <Icon className={roomStyles.amenityIcon} /> : null}
              {amenity}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EditRoomForm({ room, onClose }: { room: Room; onClose: () => void }) {
  return (
    <form>
      <div className={roomStyles.header}>
        <h3>{room.roomNumber}</h3>
        <div className={roomStyles.buttonGroup}>
          <button type="button" onClick={onClose}>
            <XIcon />
          </button>
          <button type="submit">
            <SaveIcon />
          </button>
        </div>
      </div>
      <label htmlFor="type">
        <p>Type:</p>
        <input type="text" id="type" name="type" value={room.type} />
      </label>
      <label htmlFor="pricePerNight">
        <p>Price:</p>
        <input
          type="number"
          id="pricePerNight"
          name="pricePerNight"
          value={room.pricePerNight}
        />
      </label>

      <label htmlFor="capacity">
        <p>Capacity:</p>
        <input
          type="number"
          id="capacity"
          name="capacity"
          value={room.capacity}
        />
      </label>

      <label htmlFor="floor">
        <p>Floor:</p>
        <input type="number" id="floor" name="floor" value={room.floor} />
      </label>
      <label htmlFor="status">
        <p>Status:</p>
        <select id="status" name="status" value={room.status}>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </label>
      <label htmlFor="isActive">
        <p>Active:</p>
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={room.isActive}
        />
      </label>
      <label htmlFor="amenities">
        <p>Amenities:</p>
        <textarea
          id="amenities"
          name="amenities"
          value={room.amenities?.join(", ")}
        />
      </label>
    </form>
  );
}
