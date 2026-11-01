import { Link, useNavigate } from "react-router-dom";
import type { Room } from "../types";
import styles from "./RoomCard.module.css";
import { ArrowRight } from "lucide-react";
import { useContext } from "react";
import { mainContext } from "@/app/contexts";

type RoomCard = {
  room: Room;
  index?: number;
};

export default function RoomCard({ room, index }: RoomCard) {
  const { setRoom } = useContext(mainContext) ?? {};
  const navigate = useNavigate();

  return (
    <article className={`${styles.roomcard} ${styles.card}`} key={room.id}>
      <a
        className={`${styles.roomImageLink} ${styles.imageWrapper}`}
        aria-label={`Book ${room.roomNumber}`}
        onClick={(e) => {
          e.preventDefault();
          if (setRoom) {
            setRoom(room);
            navigate("/book");
          }
        }}
      >
        <img
          className={`${styles.roomImage} ${styles.cardImageTop}`}
          src={room.images[0]}
          alt={`${room.type} room ${room.roomNumber}`}
          loading={index === 0 ? "eager" : "lazy"}
        />
      </a>
      <div className={styles.cardBody}>
        <div className={styles.roomHeader}>
          <h3 className={styles.roomNumber}>{room.roomNumber}</h3>
          <p className={styles.roomPrice}>
            ${room.pricePerNight}
            <span className={styles.roomPriceSuffix}> / night</span>
          </p>
        </div>
        <p className={styles.roomDetails}>
          {room.type} · Floor {room.floor}
        </p>
        <ul
          className={styles.roomAmenities}
          aria-label={`${room.bedType} amenities`}
        >
          {room.amenities.map((amenity) => (
            <li className={`${styles.amenties} ${styles.badge}`} key={amenity}>
              {amenity}
            </li>
          ))}
        </ul>
      </div>
      <Link
        className={styles.bookLink}
        to={`/booking/${room.id}`}
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          if (setRoom) {
            setRoom(room);
          }
        }}
      >
        Book this room <ArrowRight size={20} />
      </Link>
    </article>
  );
}
