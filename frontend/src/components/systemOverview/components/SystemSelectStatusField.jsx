import { isWeekend, nextMonday } from "date-fns";

import EmployeeService from "../../../services/EmployeeService";

export default function SystemSelectStatusField({
  editable,
  title,
  system,
  setSystem,
  variable,
}) {
  const classes = `
    select select-bordered select-sm w-full text-accent
    ${!editable ? "disabled:bg-white disabled:text-accent" : ""}
`;

  const employeeFunction = EmployeeService.getEmployeeFunction();

  function handleChange(status) {
    //checks if the status change comes with an automatic date fill
    switch (status) {
      case "BUILDING":
        setStatusAndDate(status, "startOfConstruction");
        break;
      case "TRANSFERRED":
        setStatusAndDate(status, "endOfConstruction");
        break;
      case "TESTING":
        setStatusAndDate(status, "startOfTest");
        break;
      case "FINISHED":
        setStatusAndDate(status, "endOfTest");
        break;
      default:
        setStatus(status);
    }
  }

  //checks if the dateToAutoFill already has a date, if not, it will fill in the current workday (or next monday if it is saturday or sunday). if it does have a date already, it will only  set the status with the setStatus() function.
  function setStatusAndDate(status, dateToAutoFill) {
    if (!system[dateToAutoFill]) {
      //returns current workday or the next monday if it is saturday or sunday
      const workingDay = isWeekend(new Date())
        ? nextMonday(new Date())
        : new Date();

      const formattedDate = workingDay.toISOString().split("T")[0];

      setSystem({
        ...system,
        [dateToAutoFill]: formattedDate,
        [variable]: status === "" ? null : status,
      });
    } else {
      setStatus(status);
    }
  }

  //updates the status of the system
  function setStatus(status) {
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
        <option value="DONE" disabled={employeeFunction !== "TEAM_LEADER"}>
          afgerond
        </option>
      </select>
    </div>
  );
}
