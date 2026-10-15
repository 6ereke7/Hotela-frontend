import type { Room } from "../types";
import styles from './RoomCard.module.css'


export default function RoomCard({ room , index}: {room:Room, index:number}) {
    return (
            <article className={styles.roomCard} key={room.id}>
                <a
                    className={styles.roomImageLink}
                    href={`/booking?room=${room.id}`}
                    aria-label={`Book ${room.name}`}
                >
                    <img
                        className={styles.roomImage}
                        src={room.image}
                        alt={room.imageAlt}
                        loading={index === 0 ? 'eager' : 'lazy'}
                    />
                    <span className={styles.roomNumber}>0{index + 1}</span>
                </a>
                <div className={styles.roomDetails}>
                    <div className={styles.roomTitleRow}>
                        <h3>{room.name}</h3>
                        <p className={styles.roomPrice}>
                            ${room.pricePerNight}
                            <span> / night</span>
                        </p>
                    </div>
                    <p className={styles.roomDescription}>{room.description}</p>
                    <ul className={styles.amenities} aria-label={`${room.name} amenities`}>
                        {room.amenities.map((amenity) => (
                            <li key={amenity}>{amenity}</li>
                        ))}
                    </ul>
                    <a className={styles.bookLink} href={`/booking?room=${room.id}`}>
                        Book this room <span aria-hidden="true">↗</span>
                    </a>
                </div>
            </article>
    )
}