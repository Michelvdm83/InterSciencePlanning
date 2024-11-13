import { useEffect } from "react";

export default function TaskDateField({
  editable,
  title,
  task,
  setTask,
  variable,
}) {
  const classes =
    "input input-sm input-bordered w-full text-accent select-text disabled:bg-white disabled:text-accent" +
    (task[variable] ? "" : " text-transparent disabled:text-transparent");

  return (
    <div>
      <div>{title}</div>
      <input
        type="date"
        value={task[variable] || ""}
        onChange={(event) => {
          setTask({ ...task, [variable]: event.target.value || null });
        }}
        className={classes}
        disabled={!editable}
      />
    </div>
  );
}
