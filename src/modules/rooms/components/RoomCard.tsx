import { Link } from "react-router-dom";
import type { Room } from "../types";
import styles from "./RoomCard.module.css";

export default function RoomCard({
  room,
  index,
  checkInDate,
  checkOutDate,
}: {
  room: Room;
  index: number;
  checkInDate?: string;
  checkOutDate?: string;
}) {
  const bookingState = { room, checkInDate, checkOutDate };
  return (
    <article className={styles.roomCard} key={room.id}>
      <Link
        to={`/booking/${room.id}`}
        state={bookingState}
        className={styles.roomImageLink}
        aria-label={`Book ${room.roomNumber}`}
      >
        <img
          className={styles.roomImage}
          src={room.images[0]}
          alt={`${room.type} room ${room.roomNumber}`}
          loading={index === 0 ? "eager" : "lazy"}
        />
        <span className={styles.roomNumber}>0{index + 1}</span>
      </Link>
      <div className={styles.roomDetails}>
        <div className={styles.roomTitleRow}>
          <h3>{room.roomNumber}</h3>
          <p className={styles.roomPrice}>
            ${room.pricePerNight}
            <span> / night</span>
          </p>
        </div>
        <p className={styles.roomDescription}>
          {room.type} · Floor {room.floor}
        </p>
        <ul
          className={styles.amenities}
          aria-label={`${room.bedType} amenities`}
        >
          {room.amenities.map((amenity) => (
            <li key={amenity}>{amenity}</li>
          ))}
        </ul>
        <Link
          className={styles.bookLink}
          to={`/booking/${room.id}`}
          state={bookingState}
        >
          Book this room <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
