import { useState } from "react";

export default function SystemTextField({
  system,
  setSystem,
  editable,
  title,
  variable,
}) {
  let classes =
    "bg-white text-accent disabled:text-accent input input-sm w-full";
  if (!editable) {
    classes += " input-disabled disabled:bg-white disabled:text-accent";
  }

  const maxLength = variable === "name" ? 15 : undefined;

  return (
    <div>
      <div>{title}</div>
      <input
        type="text"
        className={classes}
        value={system[variable] || ""}
        onChange={(event) =>
          setSystem({ ...system, [variable]: event.target.value })
        }
        disabled={!editable}
        spellCheck="false"
        maxLength={maxLength}
      />
    </div>
  );
}
