import { Link, useNavigate } from "react-router-dom";
import type { Room } from "../types";
import styles from "./RoomCard.module.css";
import { ArrowRight } from "lucide-react";
import { useContext } from "react";
import { mainContext } from "@/app/providers";

type RoomCard = {
  room: Room;
  index?: number;
  checkInDate?: string;
  checkOutDate?: string;
};

export default function RoomCard({
  room,
  index,
  checkInDate,
  checkOutDate,
}: RoomCard) {
  const bookingState = { room, checkInDate, checkOutDate };
  const { setRoom } = useContext(mainContext) ?? {};
  const navigate = useNavigate();

  return (
    <article
      className={`card h-100 border-0 rounded-3 shadow-sm overflow-hidden ${styles.roomcard}`}
      key={room.id}
    >
      <div
        className={`position-relative d-block overflow-hidden ${styles.roomImageLink}`}
        aria-label={`Book ${room.roomNumber}`}
        onClick={() => {
          if (setRoom) {
            setRoom(room);
            navigate("/book");
          }
        }}
      >
        <img
          className={`card-img-top ${styles.roomImage}`}
          src={room.images[0]}
          alt={`${room.type} room ${room.roomNumber}`}
          loading={index === 0 ? "eager" : "lazy"}
        />
      </div>
      <div className="card-body p-3">
        <div className="d-flex align-items-start justify-content-between gap-2">
          <h3 className="h5 mb-0">{room.roomNumber}</h3>
          <p className="text-success fw-semibold mb-0">
            ${room.pricePerNight}
            <span className="text-secondary fw-normal small"> / night</span>
          </p>
        </div>
        <p className="text-secondary  small mt-2 mb-3">
          {room.type} · Floor {room.floor}
        </p>
        <ul
          className="list-unstyled d-flex flex-wrap gap-2 mb-3"
          aria-label={`${room.bedType} amenities`}
        >
          {room.amenities.map((amenity) => (
            <li
              className={`badge rounded-pill fw-normal ${styles.amenties} `}
              key={amenity}
            >
              {amenity}
            </li>
          ))}
        </ul>
        <Link
          className="d-flex justify-content-between border-top pt-3 text-success fw-semibold small text-decoration-none"
          to={`/booking/${room.id}`}
          state={bookingState}
        >
          Book this room <ArrowRight size={20} />
        </Link>
      </div>
    </article>
  );
}
