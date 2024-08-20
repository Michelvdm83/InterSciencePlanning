import { useGetEmployees } from "../../../hooks/useGetEmployees.js";

export default function SystemSelectEmployeeField({
  editable,
  title,
  system,
  setSystem,
  variable,
}) {
  const [employees] = useGetEmployees();

  return (
    <div>
      <div>{title}</div>
      <select
        defaultValue={system[variable]}
        onChange={(event) => {
          setSystem({
            ...system,
            [variable]: event.target.value === "" ? null : event.target.value,
          });
        }}
        className="select select-bordered select-sm w-full text-accent"
        disabled={!editable}
      >
        <option value="" disabled>
          Medewerker
        </option>
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
