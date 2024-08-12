import { useState } from "react";

export default function SystemSelectStatusField({
  defaultValue,
  editable,
  title,
}) {
  const [value, setValue] = useState({ defaultValue });

  return (
    <div>
      <div className="label max-w-xs">{title}</div>
      <select
        defaultValue={defaultValue}
        onChange={(e) => setValue(e.target.value)}
        className="select select-bordered w-full text-accent"
      >
        <option value=""></option>
        <option value="BUILDING">SSP: bezig</option>
        <option value="BUILD">SSP: klaar</option>
      </select>
    </div>
  );
}
