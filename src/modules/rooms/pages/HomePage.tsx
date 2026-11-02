import { useEffect, useReducer, useState } from "react";
import {
  BadgePercent,
  Headset,
  UserRoundCheck,
} from "lucide-react";
import Filter from "../components/Filter";
import RoomCard from "../components/RoomCard";
import styles from "./HomePage.module.css";
import { getRooms, type RoomFilter } from "../api";
import type { Room } from "../types";
import { HomeHero } from "../components/HomeHero";
import { Loading } from "@/components/Loading";

const benefits = [
  {
    number: "01",
    title: "No account needed",
    description:
      "A simple email verification is all it takes to confirm your stay.",
    icon: UserRoundCheck,
  },
  {
    number: "02",
    title: "Our best rate, always",
    description:
      "Book directly for thoughtful extras and our best available price.",
    icon: BadgePercent,
  },
  {
    number: "03",
    title: "Here when you need us",
    description:
      "Our reception team is ready to help, before and throughout your stay.",
    icon: Headset,
  },
];

export type Action =
  | { type: "bedType"; value: string }
  | { type: "roomNumber"; value: string }
  | { type: "floor"; value: number }
  | { type: "capacity"; value: number }
  | { type: "amenities"; value: string }
  | { type: "roomType"; value: string }
  | { type: "reset" };

function filterReducer(state: RoomFilter, action: Action) {
  switch (action.type) {
    case "bedType":
      return { ...state, bedType: action.value };
    case "roomType":
      return { ...state, roomType: action.value };
    case "roomNumber":
      return { ...state, roomNumber: action.value };
    case "floor":
      return { ...state, floor: action.value };
    case "capacity":
      return { ...state, capacity: action.value };
    case "amenities":
      return {
        ...state,
        amenities: state.amenities?.includes(action.value)
          ? state.amenities.filter((a) => a !== action.value)
          : [...(state.amenities || []), action.value],
      };
    case "reset":
      return {
        bedType: "all",
        roomType: "all",
        amenities: [],
      };
    default:
      return state;
  }
}
export function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filter, dispatchFilter] = useReducer(filterReducer, {} as RoomFilter);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setLoadError(false);

    getRooms({ ...filter })
      .then((rooms) => setRooms(rooms ?? []))
      .catch(() => setLoadError(true))
      .finally(() => setIsLoading(false));
  }, [filter]);

  return (
    <main className={styles.home}>
      <section className={styles.hero} aria-labelledby="hero-title">
        <HomeHero />
      </section>
      <section
        className={styles.staysSection}
        id="stays"
        aria-labelledby="rooms-title"
      >
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Find your stay</p>
          <h2 id="rooms-title">Rooms made for your kind of getaway</h2>
          <p>Explore thoughtful spaces, each with its own little comforts.</p>
        </div>
        <Filter filter={filter} dispatchFilter={dispatchFilter} />

        {!isLoading && !loadError && (
          <p className={styles.resultsCount} aria-live="polite">
            {rooms.length} {rooms.length === 1 ? "room" : "rooms"} available
          </p>
        )}

        <div className={styles.roomsGrid}>
          {isLoading ? (
            <Loading className={styles.loading} label="Loading available rooms" />
          ) : loadError ? (
            <p className={styles.roomMessage} role="alert">
              Rooms could not be loaded. Please try again later.
            </p>
          ) : rooms.length ? (
            rooms.map((room, index) => (
              <RoomCard room={room} index={index} key={room.id} />
            ))
          ) : (
            <p className={styles.roomMessage}>
              No rooms match these filters. Try changing your selection.
            </p>
          )}
        </div>
      </section>
      <section
        className={styles.valuesSection}
        id="the-hotela-way"
        aria-labelledby="values-title"
      >
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>The Hotela way</p>
          <h2 id="values-title">A little more ease in every stay</h2>
        </div>
        <div className={styles.benefitsRow}>
          {benefits.map((benefit) => {
            const BenefitIcon = benefit.icon;

            return (
              <article className={styles.benefitCard} key={benefit.number}>
                <div className={styles.benefitIcon}>
                  <BenefitIcon size={32} strokeWidth={1.5} aria-hidden="true" />
                </div>

                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDescription}>
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>
      <footer className={styles.footer}>
        <a className={styles.footerBrand} href="/" aria-label="Hotela home">
          hotela<span>.</span>
        </a>
        <p className={styles.footerTagline}>A softer place to land.</p>
        <a className={styles.footerCta} href="#stays">
          Browse stays
        </a>
      </footer>
    </main>
  );
}
