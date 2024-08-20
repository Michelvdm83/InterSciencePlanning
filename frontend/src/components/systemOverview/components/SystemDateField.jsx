export default function SystemDateField({
  editable,
  title,
  system,
  setSystem,
  variable,
  date,
}) {
  const classes =
    "input input-sm w-full text-accent select-text disabled:bg-white disabled:text-accent" +
    (system[variable] ? "" : " text-transparent disabled:text-transparent");

  return (
    <div>
      <div>{title}</div>
      <input
        type="date"
        value={date || ""}
        onChange={(event) =>
          setSystem({ ...system, [variable]: event.target.value })
        }
        className={classes}
        disabled={!editable}
      />
    </div>
  );
}
