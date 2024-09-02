export default function SystemTextArea({
  editable,
  title,
  heightCSS,
  system,
  setSystem,
  variable,
}) {
  let classes =
    "bg-white text-accent disabled:text-accent resize-none input w-full " +
    heightCSS;
  if (!editable) {
    classes += " input-disabled";
  }

  return (
    <div>
      <div>{title}</div>
      <textarea
        className={classes}
        value={system[variable] || ""}
        onChange={(event) =>
          setSystem({ ...system, [variable]: event.target.value })
        }
        disabled={!editable}
        spellcheck="false"
      />
    </div>
  );
}
