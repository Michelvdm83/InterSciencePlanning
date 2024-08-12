import { useState } from "react";

export default function SystemSelectStatusField({
  defaultValue,
  editable,
  title,
}) {
  const [value, setValue] = useState({ defaultValue });

  return (
    <div>
      <div>{title}</div>
      <select
        defaultValue={defaultValue}
        onChange={(e) => setValue(e.target.value)}
        className="select select-bordered select-sm w-full text-accent"
      >
        <option value="TO_BE_PLANNED">aangemaakt</option>
        <option value="PLANNED">SSP: ingepland</option>
        <option value="BUILDING">SSP: in bouw</option>
        <option value="BUILD">overgedragen</option>
        <option value="TESTING">FT: in test</option>
        <option value="FINISHED">FT: testen gereed</option>
        <option value="PROBLEMS">FT: problemen</option>
        <option value="IN_WAIT">in afwachting van klant</option>
        <option value="INSTALLED">geïnstalleerd</option>
      </select>
    </div>
  );
}
