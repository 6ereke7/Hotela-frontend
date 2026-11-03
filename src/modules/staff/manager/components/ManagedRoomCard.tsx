import { useState, type FormEvent } from "react";
import { Edit2Icon, SaveIcon, XIcon } from "lucide-react";
import { Loading } from "@/components/Loading";
import type { Room } from "@/types/room";
import styles from "./ManagedRoomCard.module.css";

export type RoomChanges = Pick<
  Room,
  "type" | "pricePerNight" | "capacity" | "floor" | "isActive" | "amenities"
>;

type ManagedRoomCardProps = {
  room: Room;
  onSave: (id: string, changes: RoomChanges) => Promise<void>;
};

export function ManagedRoomCard({ room, onSave }: ManagedRoomCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [changes, setChanges] = useState<RoomChanges>(() => ({
    type: room.type,
    pricePerNight: room.pricePerNight,
    capacity: room.capacity,
    floor: room.floor,
    isActive: room.isActive,
    amenities: room.amenities,
  }));

  const update = <K extends keyof RoomChanges>(
    key: K,
    value: RoomChanges[K],
  ) => setChanges((current) => ({ ...current, [key]: value }));
  const startEditing = () => {
    setChanges({
      type: room.type,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      floor: room.floor,
      isActive: room.isActive,
      amenities: room.amenities,
    });
    setError("");
    setIsEditing(true);
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);
    try {
      await onSave(room.id, changes);
      setIsEditing(false);
    } catch {
      setError("Room details could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className={styles.card}>
      <img
        className={styles.image}
        src={room.images[0]}
        alt={`${room.type} room ${room.roomNumber}`}
      />

      {isEditing ? (
        <form className={styles.form} onSubmit={save}>
          <header className={styles.header}>
            <h2>Edit room {room.roomNumber}</h2>
            <button
              className={styles.iconButton}
              onClick={() => setIsEditing(false)}
              aria-label="Cancel editing"
              type="button"
            >
              <XIcon size={18} />
            </button>
          </header>

          <label>
            Room type
            <input
              required
              value={changes.type}
              onChange={(event) => update("type", event.target.value)}
            />
          </label>
          <label>
            Price per night
            <input
              min="0.01"
              required
              type="number"
              step="0.01"
              value={changes.pricePerNight}
              onChange={(event) =>
                update("pricePerNight", Number(event.target.value))
              }
            />
          </label>
          <label>
            Capacity
            <input
              min="1"
              required
              type="number"
              value={changes.capacity}
              onChange={(event) =>
                update("capacity", Number(event.target.value))
              }
            />
          </label>
          <label>
            Floor
            <input
              min="1"
              required
              type="number"
              value={changes.floor}
              onChange={(event) => update("floor", Number(event.target.value))}
            />
          </label>
          <label className={styles.wideField}>
            Amenities
            <input
              value={changes.amenities.join(", ")}
              onChange={(event) =>
                update(
                  "amenities",
                  event.target.value
                    .split(",")
                    .map((amenity) => amenity.trim())
                    .filter(Boolean),
                )
              }
            />
          </label>
          <label className={styles.activeField}>
            <input
              checked={changes.isActive}
              type="checkbox"
              onChange={(event) => update("isActive", event.target.checked)}
            />
            Active room
          </label>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <button
            className={styles.saveButton}
            disabled={isSaving}
            aria-label={isSaving ? "Saving room changes" : undefined}
            type="submit"
          >
            {isSaving ? (
              <Loading inline label="Saving room changes" />
            ) : (
              <>
                <SaveIcon size={17} />
                Save changes
              </>
            )}
          </button>
        </form>
      ) : (
        <div className={styles.details}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Room {room.roomNumber}</p>
              <h2>{room.type}</h2>
            </div>
            <button
              className={styles.iconButton}
              onClick={startEditing}
              aria-label={`Edit room ${room.roomNumber}`}
              type="button"
            >
              <Edit2Icon size={18} />
            </button>
          </header>

          <dl className={styles.facts}>
            <div>
              <dt>Rate</dt>
              <dd>${room.pricePerNight.toFixed(2)} / night</dd>
            </div>
            <div>
              <dt>Capacity</dt>
              <dd>
                {room.capacity} {room.capacity === 1 ? "guest" : "guests"}
              </dd>
            </div>
            <div>
              <dt>Floor</dt>
              <dd>{room.floor}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd className={room.isActive ? styles.available : styles.inactive}>
                {room.isActive ? room.status : "inactive"}
              </dd>
            </div>
          </dl>

          {room.amenities.length > 0 && (
            <ul className={styles.amenities} aria-label="Room amenities">
              {room.amenities.map((amenity) => (
                <li key={amenity}>{amenity}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}
