import { useGetEmployees } from "../../../hooks/useGetEmployees.js";

export default function TaskSelectEmployeeField({
  editable,
  title,
  task,
  setTask,
  variable,
}) {
  const [employees] = useGetEmployees("/employees/ssp-planning");

  const classes = `
  select select-bordered select-sm w-full text-accent
  ${!editable ? "disabled:bg-white disabled:text-accent" : ""}
`;

  return (
    <div>
      <div>{title}</div>
      <select
        value={task[variable] || ""}
        onChange={(event) => {
          setTask({
            ...task,
            [variable]: event.target.value === "" ? null : event.target.value,
          });
        }}
        className={classes}
        disabled={!editable}
      >
        <option value=""></option>
        {employees.map((employee) => {
          return (
            <option value={employee.id} key={employee.id}>
              {employee.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
