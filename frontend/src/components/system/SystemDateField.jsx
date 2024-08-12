import { useState } from "react";

export default function SystemDateField({ date, editable, title }) {
  const [value, setValue] = useState(date);
  function getField() {
    const classes =
      "input w-full text-accent select-text" +
      (value ? "" : " text-transparent disabled:text-transparent");
    if (editable) {
      return (
        <div className="max-h-fit">
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
      <div className="max-h-fit">
        <div className="label max-w-xs">{title}</div>
        <input
          type="date"
          defaultValue={date}
          className={classes + " disabled:bg-white disabled:text-accent"}
          disabled
        />
      </div>
    );
  }

  return getField();
}
