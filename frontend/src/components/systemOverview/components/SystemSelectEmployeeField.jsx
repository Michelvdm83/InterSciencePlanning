import { useGetEmployees } from "../../../hooks/useGetEmployees.js";

export default function SystemSelectEmployeeField({
  editable,
  title,
  system,
  setSystem,
  variable,
}) {
  const [employees] = useGetEmployees("employees");
  let filteredEmployees = [];

  const classes = `
  select select-bordered select-sm w-full text-accent
  ${!editable ? "disabled:bg-white disabled:text-accent" : ""}
`;

  if (variable === "employeeSSP") {
    filteredEmployees = employees.filter(
      (employee) =>
        employee.function === "SSP" || employee.function === "SSP_TEAM_LEADER",
    );
  } else if (variable === "employeeFT") {
    filteredEmployees = employees.filter(
      (employee) =>
        employee.function === "FT" || employee.function === "FT_TEAM_LEADER",
    );
  } else if (variable === "employeeResponsible") {
    filteredEmployees = employees.filter(
      (employee) => employee.function !== "SSP",
    );
  } else {
    filteredEmployees = employees;
  }

  function handleChange(employee) {
    switch (variable) {
      case "employeeSSP":
        setSystem({
          ...system,
          ["startOfConstruction"]: null,
          ["endOfConstruction"]: null,
          [variable]: employee === "" ? null : employee,
        });
        break;
      case "employeeFT":
        setSystem({
          ...system,
          ["startOfTest"]: null,
          ["endOfTest"]: null,
          [variable]: employee === "" ? null : employee,
        });
        break;
    }
  }

  return (
    <div>
      <div>{title}</div>
      <select
        value={system[variable] || ""}
        onChange={(event) => {
          handleChange(event.target.value);
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
