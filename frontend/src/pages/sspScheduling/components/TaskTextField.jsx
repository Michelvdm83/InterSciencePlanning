export default function TaskTextField({
  task,
  setTask,
  editable,
  title,
  variable,
}) {
  let classes =
    "bg-white text-accent disabled:text-accent input input-bordered input-sm w-full";
  if (!editable) {
    classes += " input-disabled disabled:bg-white disabled:text-accent";
  }

  const maxLength = variable === "name" ? 15 : undefined;

  return (
    <div>
      <div>{title}</div>
      <input
        type="text"
        className={classes}
        value={task[variable] || ""}
        onChange={(event) =>
          setTask({ ...task, [variable]: event.target.value })
        }
        disabled={!editable}
        spellCheck="false"
        maxLength={maxLength}
      />
    </div>
  );
}
