import { useState } from "react";

export default function SystemDateField({ date, editable, title }) {
  const [value, setValue] = useState(date);
  function getField() {
    if (editable) {
      const classes =
        "input w-full text-accent my-date" + (value ? "" : " text-transparent");
      return (
        <div>
          <div className="label max-w-xs">{title}</div>
          <input
            type="date"
            defaultValue={date}
            className={classes}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.preventDefault()}
          />
        </div>
      );
    }

    return (
      <div>
        <div className="label max-w-xs">{title}</div>
        <input
          type="date"
          defaultValue={date}
          className="input w-full select-text disabled:bg-white disabled:text-accent"
          disabled
        />
      </div>
    );
  }

  return getField();
}
