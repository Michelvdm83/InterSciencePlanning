import { useState } from "react";

export default function SystemDateField({ date, editable, title }) {
  const [value, setValue] = useState(date);
  const classes =
    "input input-sm w-full text-accent select-text disabled:bg-white disabled:text-accent" +
    (value ? "" : " text-transparent disabled:text-transparent");

  return (
    <div>
      <div>{title}</div>
      <input
        type="date"
        defaultValue={date}
        className={classes}
        disabled={!editable}
      />
    </div>
  );
}
