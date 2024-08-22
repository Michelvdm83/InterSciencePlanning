import { useState } from "react";

export default function SystemNumberField({
  editable,
  title,
  system,
  setSystem,
  variable,
}) {
  let classes =
    "input input-bordered bg-white text-accent disabled:text-accent input-sm w-full";
  if (!editable) {
    classes += " input-disabled";
  }

  function checkKeyPressed(event) {
    if (event.key.match(/[0-9]|Backspace|Delete|Arrow/) === null) {
      event.preventDefault();
    }
  }

  return (
    <div>
      <div>{title}</div>
      <input
        type="number"
        min={1}
        className={classes}
        value={system[variable] || ""}
        onChange={(event) =>
          setSystem({ ...system, [variable]: event.target.value })
        }
        onKeyDown={(event) => checkKeyPressed(event)}
      />
    </div>
  );
}
