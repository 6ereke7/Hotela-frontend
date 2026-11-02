import type { Dispatch } from "react";
import type { RoomFilter } from "../api";
import type { Action } from "../pages/HomePage";
import styles from "./Filter.module.css";

type FilterSelectProps = {
  label: string;
  options: Record<string, string>;
  value: string;
  onChange: (value: string) => void;
};

function FilterSelect({
  label,
  options,
  value,
  onChange,
}: FilterSelectProps) {
  return (
    <label className={styles.selectField}>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {Object.entries(options).map(([optionValue, optionLabel]) => (
          <option value={optionValue} key={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

const roomTypes = {
  all: "Any room type",
  normal: "Normal",
  standard: "Standard",
  family: "Family",
  delux: "Deluxe",
  vip: "VIP",
};

const bedTypes = {
  all: "Any bed type",
  single: "Single",
  double: "Double",
  queen: "Queen",
  king: "King",
};

const amenities = ["WiFi", "Breakfast", "Parking", "Swimming Pool"];

type FilterProps = {
  filter: RoomFilter;
  dispatchFilter: Dispatch<Action>;
};

export default function Filter({ filter, dispatchFilter }: FilterProps) {
  const hasActiveFilters =
    (filter.bedType !== undefined && filter.bedType !== "all") ||
    (filter.roomType !== undefined && filter.roomType !== "all") ||
    Boolean(filter.amenities?.length);

  return (
    <div
      className={styles.filterBar}
      role="group"
      aria-label="Filter available rooms"
    >
      <FilterSelect
        label="Bed"
        options={bedTypes}
        value={filter.bedType ?? "all"}
        onChange={(value) => dispatchFilter({ type: "bedType", value })}
      />
      <FilterSelect
        label="Room type"
        options={roomTypes}
        value={filter.roomType ?? "all"}
        onChange={(value) => dispatchFilter({ type: "roomType", value })}
      />

      <fieldset className={styles.amenityFilters}>
        <legend>Amenities</legend>
        <div className={styles.amenityOptions}>
          {amenities.map((amenity) => {
            const isSelected = filter.amenities?.includes(amenity) ?? false;

            return (
              <button
                aria-pressed={isSelected}
                className={isSelected ? styles.amenitySelected : ""}
                key={amenity}
                onClick={() =>
                  dispatchFilter({ type: "amenities", value: amenity })
                }
                type="button"
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </fieldset>

      <button
        className={styles.resetButton}
        disabled={!hasActiveFilters}
        onClick={() => dispatchFilter({ type: "reset" })}
        type="button"
      >
        Clear filters
      </button>
    </div>
  );
}
