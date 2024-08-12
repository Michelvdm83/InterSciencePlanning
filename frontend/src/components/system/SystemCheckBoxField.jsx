import { useState } from "react";

export default function SystemCheckboxField({ defaultValue, editable, title }) {
  const [checked, setChecked] = useState(defaultValue);

  return (
    <label className="label h-14 w-full border-b-2 border-white">
      <span className="label-text justify-self-start text-accent">{title}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
        className="checkbox-secondary justify-self-end"
      />
    </label>
  );
}
