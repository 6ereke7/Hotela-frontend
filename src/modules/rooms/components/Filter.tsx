import React, { useState, type Dispatch, type ReactNode } from "react";
import style from "./Filter.module.css";
type SelectProps = {
  title?: String;
  data: object;
  val: String;
  setVal: Dispatch<React.SetStateAction<string>>;
};
function Select({ title, data, val, setVal }: SelectProps) {
  return (
    <select
      onChange={(e) => {
        setVal(e.target.value);
      }}
      className={val ? "active" : ""}
    >
      {title ? (
        <option value="all" disabled selected hidden>
          {title}
        </option>
      ) : null}

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
  title: ReactNode;
  setVal: Dispatch<React.SetStateAction<boolean>>;
  val: Boolean;
};
function Check({ title, setVal, val = false }: CheckProps) {
  return (
    <>
      <button
        className={val ? "active" : ""}
        onClick={() => setVal((val) => !val)}
      >
        {title}
      </button>
    </>
  );
}
const roomTypes = {
  normal: "normal",
  standard: "standard",
  family: "family",
  delux: "delux",
  vip: "vip",
};
export default function Filter() {
  const [c, setC] = useState(false);
  const [s, setS] = useState("");
  return (
    <div className={style.filterBar}>
      <Select title="rooms" data={roomTypes} val={s} setVal={setS} />
      <Check title="ha" val={c} setVal={setC} />
    </div>
  );
}
