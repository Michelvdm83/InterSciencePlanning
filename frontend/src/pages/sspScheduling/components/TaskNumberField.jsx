export default function TaskNumberField({
  editable,
  title,
  task,
  setTask,
  variable,
}) {
  let classes =
    "input input-bordered bg-white text-accent disabled:text-accent input-sm w-full";
  if (!editable) {
    classes += " input-disabled disabled:bg-white";
  }

  function checkKeyPressed(event) {
    if (event.key.match(/[0-9]|Backspace|Delete|Arrow/) === null) {
      event.preventDefault();
    }
  }

  return (
    <div>
      <div>{title}</div>
      <input
        type="number"
        min={1}
        className={classes}
        value={task[variable] || ""}
        onChange={(event) =>
          setTask({ ...task, [variable]: event.target.value })
        }
        onKeyDown={(event) => checkKeyPressed(event)}
        readOnly={!editable}
        disabled={!editable}
      />
    </div>
  );
}
