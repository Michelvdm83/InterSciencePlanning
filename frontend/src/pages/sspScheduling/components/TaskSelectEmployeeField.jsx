import { useGetEmployees } from "../../../hooks/useGetEmployees.js";

export default function TaskSelectEmployeeField({
  editable,
  title,
  task,
  setTask,
  variable,
}) {
  const [employees] = useGetEmployees();

  const classes = `
  select select-bordered select-sm w-full text-accent
  ${!editable ? "disabled:bg-white disabled:text-accent" : ""}
`;

  const filteredEmployees = employees.filter(
    (employee) => employee.function !== "FT",
  );

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
        {filteredEmployees.map((employee) => {
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
