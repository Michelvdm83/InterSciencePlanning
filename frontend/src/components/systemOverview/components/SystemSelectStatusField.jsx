export default function SystemSelectStatusField({
  editable,
  title,
  system,
  setSystem,
  variable,
  onStatusChange,
}) {
  const classes = `
    select select-bordered select-sm w-full text-accent
    ${!editable ? "disabled:bg-white disabled:text-accent" : ""}
`;

  function handleChange(status) {
    if (onStatusChange) {
      onStatusChange(status);
    }
    setSystem({
      ...system,
      [variable]: status === "" ? null : status,
    });
  }

  return (
    <div>
      <div>{title}</div>
      <select
        value={system[variable]}
        onChange={(event) => {
          handleChange(event.target.value);
        }}
        className={classes}
        disabled={!editable}
      >
        <option value="TO_BE_PLANNED">aangemaakt</option>
        <option value="PLANNED">SSP: ingepland</option>
        <option value="BUILDING">SSP: in bouw</option>
        <option value="TRANSFERRED">overgedragen</option>
        <option value="TESTING">FT: in test</option>
        <option value="FINISHED">FT: testen gereed</option>
        <option value="PROBLEMS">FT: problemen</option>
        <option value="IN_WAIT">in afwachting van klant</option>
        <option value="INSTALLED">geïnstalleerd</option>
      </select>
    </div>
  );
}
