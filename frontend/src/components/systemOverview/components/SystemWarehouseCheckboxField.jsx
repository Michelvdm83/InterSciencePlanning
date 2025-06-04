export default function SystemWarehouseCheckboxField({
  system,
  setSystem,
  editable,
  variable,
}) {
  return (
    <label className="label gap-1.5 pt-7">
      <input
        type="checkbox"
        className={`checkbox-accent checkbox bg-white disabled:opacity-80`}
        checked={system[variable]}
        onChange={(event) =>
          setSystem({ ...system, [variable]: event.target.checked })
        }
        disabled={!editable}
      />
      Magazijn
    </label>
  );
}
