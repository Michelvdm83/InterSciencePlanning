export default function SystemDateField({
  editable,
  title,
  system,
  setSystem,
  variable,
  date,
}) {
  const classes = `
    input input-sm w-full 
    ${date ? "text-accent" : "text-white"} 
    select-text 
    ${editable ? "" : "disabled:bg-white disabled:text-accent"}
  `;

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
