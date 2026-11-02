import { ArrowRight, UsersRound } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { mainContext } from "@/app/contexts";
import type { Room } from "../types";
import styles from "./RoomCard.module.css";

type RoomCardProps = {
  room: Room;
  index?: number;
};

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export default function RoomCard({ room, index = 0 }: RoomCardProps) {
  const { setRoom } = useContext(mainContext) ?? {};
  const image = room.images[0];
  const selectRoom = () => setRoom?.(room);

  return (
    <article className={styles.roomCard}>
      <Link
        className={styles.imageLink}
        to="/book"
        onClick={selectRoom}
        aria-label={`View and book room ${room.roomNumber}`}
      >
        {image ? (
          <img
            className={styles.roomImage}
            src={image}
            alt={`${room.type} room ${room.roomNumber}`}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <span
            className={styles.imageFallback}
            role="img"
            aria-label={`No photo available for room ${room.roomNumber}`}
          >
            Photo coming soon
          </span>
        )}
        <span className={styles.roomType}>{room.type}</span>
      </Link>

      <div className={styles.cardBody}>
        <div className={styles.roomHeader}>
          <div>
            <p className={styles.roomLabel}>Room</p>
            <h3 className={styles.roomNumber}>{room.roomNumber}</h3>
          </div>
          <p className={styles.roomPrice}>
            <strong>{priceFormatter.format(room.pricePerNight)}</strong>
            <span>per night</span>
          </p>
        </div>

        <div className={styles.roomDetails}>
          <span>{room.bedType} bed</span>
          <span aria-hidden="true">·</span>
          <span>Floor {room.floor}</span>
          <span aria-hidden="true">·</span>
          <span className={styles.capacity}>
            <UsersRound size={15} aria-hidden="true" />
            Sleeps {room.capacity}
          </span>
        </div>

        {room.amenities.length > 0 && (
          <ul className={styles.amenities} aria-label="Room amenities">
            {room.amenities.map((amenity) => (
              <li key={amenity}>{amenity}</li>
            ))}
          </ul>
        )}

        <Link className={styles.bookLink} to="/book" onClick={selectRoom}>
          View room <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
