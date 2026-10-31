import { type Dispatch } from "react";
import style from "./Filter.module.css";
import type { RoomFilter } from "../api";
import type { Action } from "../pages/HomePage";
type SelectProps = {
  data: object;
  filter: RoomFilter;
  dispatchFilter: Dispatch<Action>;
};
function Select({ data, filter, dispatchFilter }: SelectProps) {
  return (
    <select
      onChange={(e) => {
        dispatchFilter({ type: "bedType", value: e.target.value });
      }}
      className={filter.bedType !== "all" ? "active" : ""}
    >
      {Object.entries(data).map((op, i) => {
        return (
          <option value={op[0]} key={i}>
            {op[1]}
          </option>
        );
      })}
    </select>
  );
}
type CheckProps = {
  name: string;
  dispatchFilter: Dispatch<Action>;
  filter: RoomFilter;
};
function Check({ name, dispatchFilter, filter }: CheckProps) {
  return (
    <button
      className={filter.amenities?.includes(name) ? "active" : ""}
      onClick={() => dispatchFilter({ type: "amenities", value: name })}
    >
      {name}
      {filter.amenities?.includes(name) && <span>✓</span>}
    </button>
  );
}
const roomTypes = {
  all: "room",
  normal: "normal",
  standard: "standard",
  family: "family",
  delux: "delux",
  vip: "vip",
};
const bedTypes = {
  all: "bed",
  single: "Single",
  double: "Double",
  queen: "Queen",
  king: "King",
};
const amenities = {
  wifi: "WiFi",
  breakfast: "Breakfast",
  parking: "Parking",
  pool: "Swimming Pool",
};

export default function Filter({
  filter,
  dispatchFilter,
}: {
  filter: RoomFilter;
  dispatchFilter: Dispatch<Action>;
}) {
  return (
    <div className={style.filterBar}>
      <Select data={bedTypes} filter={filter} dispatchFilter={dispatchFilter} />
      <Select
        data={roomTypes}
        filter={filter}
        dispatchFilter={dispatchFilter}
      />
      {Object.entries(amenities).map(([key, value]) => (
        <Check
          key={key}
          name={value}
          filter={filter}
          dispatchFilter={dispatchFilter}
        />
      ))}
      <button
        onClick={() => dispatchFilter({ type: "reset" })}
        className="reset-btn"
      >
        Reset
      </button>
    </div>
  );
}
