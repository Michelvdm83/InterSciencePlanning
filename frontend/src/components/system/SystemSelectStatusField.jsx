import { useState } from "react";

export default function SystemSelectStatusField({
  defaultValue,
  editable,
  title,
}) {
  const [value, setValue] = useState({ defaultValue });

  return (
    <div className="max-h-fit">
      <div className="label max-w-xs">{title}</div>
      <select
        defaultValue={defaultValue}
        onChange={(e) => setValue(e.target.value)}
        className="select select-bordered w-full text-accent"
      >
        <option value="TOBEPLANNED">SSP: nog in te plannen</option>
        <option value="PLANNED">SSP: ingepland</option>
        <option value="BUILDING">SSP: in bouw</option>
        <option value="BUILD">overgedragen</option>
        <option value="TESTING">FT: in test</option>
        <option value="FINISHED">FT: testen gereed</option>
        <option value="INSTALLED">geïnstalleerd</option>
      </select>
    </div>
  );
}
