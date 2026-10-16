import { useState, type FormEvent } from "react";
import type { ManagedRoom } from "../types";
import roomStyles from "./ManagedRoomCard.module.css";
import commonStyles from "./StaffDashboardCommon.module.css";

type ManagedRoomCardProps = {
  room: ManagedRoom;
  editing: boolean;
  onEdit: () => void;
  onSave: (rate: number) => void;
  onDelete: () => void;
};

export function ManagedRoomCard({
  room,
  editing,
  onEdit,
  onSave,
  onDelete,
}: ManagedRoomCardProps) {
  const [rate, setRate] = useState(String(room.rate));

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedRate = Number(rate);
    if (Number.isFinite(parsedRate) && parsedRate > 0) onSave(parsedRate);
  };

  return (
    <article className={roomStyles.managedRoomCard}>
      <div className={roomStyles.roomCardArtwork}>
        <span>ROOM {room.name}</span>
        <button
          aria-label={`More actions for room ${room.name}`}
          className={`${commonStyles.moreButton} ${roomStyles.roomCardMoreButton}`}
          type="button"
        >
          ···
        </button>
      </div>
      <div className={roomStyles.managedRoomBody}>
        <div className={roomStyles.managedRoomTitle}>
          <div>
            <h3>{room.category}</h3>
            <p>Room {room.name}</p>
          </div>
          <span
            className={
              room.status === "Available"
                ? commonStyles.statusReady
                : room.status === "Occupied"
                  ? commonStyles.statusOccupied
                  : commonStyles.statusNeedsService
            }
          >
            {room.status}
          </span>
        </div>
        {editing ? (
          <form className={roomStyles.rateEditForm} onSubmit={handleSave}>
            <label>
              Nightly rate <span>$</span>
              <input
                aria-label={`Nightly rate for ${room.category}`}
                min="1"
                onChange={(event) => setRate(event.target.value)}
                type="number"
                value={rate}
              />
            </label>
            <button className={commonStyles.smallPrimaryButton} type="submit">
              Save rate
            </button>
          </form>
        ) : (
          <p className={roomStyles.rateLine}>
            <strong>${room.rate}</strong> <span>/ night</span>
          </p>
        )}
        <div className={roomStyles.roomCardActions}>
          <button onClick={onEdit} type="button">
            {editing ? "Cancel" : "Edit room"}
          </button>
          <button
            className={roomStyles.deleteAction}
            onClick={onDelete}
            type="button"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
