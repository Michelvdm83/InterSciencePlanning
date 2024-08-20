import { useGetEmployees } from "../../../hooks/useGetEmployees.js";

export default function SystemSelectEmployeeField({
  editable,
  title,
  system,
  setSystem,
  variable,
}) {
  const [employees] = useGetEmployees();
  let filteredEmployees = [];

  if (variable === "employeeSSP") {
    filteredEmployees = employees.filter(
      (employee) => employee.function === "SSP",
    );
  } else if (variable === "employeeFT") {
    filteredEmployees = employees.filter(
      (employee) => employee.function === "FT",
    );
  } else {
    filteredEmployees = employees;
  }

  return (
    <div>
      <div>{title}</div>
      <select
        value={system[variable] || ""}
        onChange={(event) => {
          setSystem({
            ...system,
            [variable]: event.target.value === "" ? null : event.target.value,
          });
        }}
        className="select select-bordered select-sm w-full text-accent"
        disabled={!editable}
      >
        <option value="" disabled></option>
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
