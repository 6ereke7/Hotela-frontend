import styles from "./ReceptionStats.module.css";

type ReceptionStatsProps = {
  arrivalsToday: number;
  departuresToday: number;
  readyRooms: number;
  inHouse: number;
};

export function ReceptionStats({
  arrivalsToday,
  departuresToday,
  readyRooms,
  inHouse,
}: ReceptionStatsProps) {
  const cards = [
    { label: "Arrivals today", value: arrivalsToday, detail: "Confirmed reservations", icon: "↘" },
    { label: "Departures today", value: departuresToday, detail: "Guests marked in house", icon: "↗" },
    { label: "Rooms not occupied", value: readyRooms, detail: "Based on active room inventory", icon: "⌂", unit: "rooms" },
    { label: "In-house bookings", value: inHouse, detail: "Current reservation status", icon: "♧" },
  ];

  return (
    <section className={styles.stats} aria-label="Reception overview">
      {cards.map(({ label, value, detail, icon, unit }) => (
        <article className={styles.statCard} key={label}>
          <div className={styles.cardTop}>
            <span>{label}</span>
            <span aria-hidden="true">{icon}</span>
          </div>
          <strong>
            {value}
            {unit && <span className={styles.unit}> {unit}</span>}
          </strong>
          <p>{detail}</p>
        </article>
      ))}
    </section>
  );
}
