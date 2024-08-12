import { useState } from "react";

export default function SystemCheckboxField({ defaultValue, editable, title }) {
  const [checked, setChecked] = useState(defaultValue);

  return (
    <div>
      <label className="label cursor-pointer border-b">
        <span className="label-text text-accent">{title}</span>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
          className="checkbox-secondary"
        />
      </label>
    </div>
  );
}
