import { useState } from "react";

export default function SystemSelectEmployeeField({
  employeeName,
  editable,
  title,
}) {
  const [value, setValue] = useState(employeeName);

  return (
    <div className="max-h-fit">
      <div className="label max-w-xs">{title}</div>
      <select
        defaultValue={employeeName}
        onChange={(e) => {
          setValue(e.target.value === "" ? null : e.target.value);
        }}
        className="select select-bordered w-full text-accent"
      >
        <option value={""}></option>
        <option value={employeeName}>{employeeName}</option>
      </select>
    </div>
  );
}
