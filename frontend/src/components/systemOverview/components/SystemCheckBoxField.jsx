import { useState, useEffect } from "react";

export default function SystemCheckboxField({
  editable,
  title,
  system,
  setSystem,
  variable,
}) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(system[variable] || false);
  }, [system, variable]);

  function handleChange() {
    const newCheckedValue = !checked;
    setChecked(newCheckedValue);
    setSystem({ ...system, [variable]: newCheckedValue });
  }

  return (
    <label className="label h-14 w-full border-b-2 border-white">
      <span className="label-text justify-self-start text-accent">{title}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="checkbox-secondary justify-self-end"
        disabled={!editable}
      />
    </label>
  );
}
