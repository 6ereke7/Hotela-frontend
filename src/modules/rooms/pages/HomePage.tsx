import { useEffect, useReducer, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  Headset,
  UserRoundCheck,
} from "lucide-react";
import Filter from "../components/Filter";
import RoomCard from "../components/RoomCard";
import styles from "./HomePage.module.css";
import { getRooms, type RoomFilter } from "../api";
import type { Room } from "../types";
import { CarouselHero } from "../components/CarouselHero";

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
    <main className={`${styles.home} min-vh-100`}>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className="">
          <CarouselHero />
        </div>
      </section>
      <section
        className="container-xl py-5"
        id="stays"
        aria-labelledby="rooms-title"
      >
        <Filter filter={filter} dispatchFilter={dispatchFilter} />
        <div className="d-flex align-items-end justify-content-end gap-3 mb-4">
          <a
            className="text-success fw-semibold text-decoration-none"
            href="#stays"
          >
            Explore all stays <ArrowRight size={20} />
          </a>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 align-items-center g-0">
          {isLoading ? (
            <p role="status">Loading available rooms...</p>
          ) : loadError ? (
            <p role="alert">
              Rooms could not be loaded. Please try again later.
            </p>
          ) : rooms.length ? (
            rooms.map((room, index) => (
              <div className="p-2">
                <RoomCard room={room} index={index} key={room.id} />
              </div>
            ))
          ) : (
            <p>No rooms are available right now.</p>
          )}
        </div>
      </section>
      <section
        className="container-xl bg-success-subtle  p-4 p-lg-5 rounded"
        id="the-hotela-way"
        aria-labelledby="values-title"
      >
        <div className="d-flex flex-row align-items-center justify-content-evenly">
          {benefits.map((benefit) => {
            const BenefitIcon = benefit.icon;

            return (
              <article className="flex-fill gap-3" key={benefit.number}>
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <span
                    className="  border rounded-circle p-2 text-success"
                    aria-hidden="true"
                  >
                    <BenefitIcon size={40} strokeWidth={1.5} />
                  </span>
                </div>

                <h3 className="h5 text-center">{benefit.title}</h3>
                <p className="small text-secondary  text-center mb-0">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>
      <footer className="container-xl d-flex align-items-center justify-content-between gap-3 py-4">
        <a
          className="text-success fs-3 fw-bold text-decoration-none"
          href="/"
          aria-label="Hotela home"
        >
          hotela<span>.</span>
        </a>
        <p className="text-secondary small mb-0">A softer place to land.</p>
        <a className="text-body text-decoration-none small" href="/#stays">
          book now
        </a>
      </footer>
    </main>
  );
}
