import { useState } from "react";

export default function SystemCheckboxField({ defaultValue, editable, title }) {
  const [checked, setChecked] = useState(defaultValue);

  return (
    <div>
      <label className="label cursor-pointer">
        <span className="label-text">{title}</span>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
          className="checkbox-secondary checkbox"
        />
      </label>
    </div>
  );
}
