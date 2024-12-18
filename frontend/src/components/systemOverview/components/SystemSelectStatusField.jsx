import { addDays } from "date-fns";

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

  function handleChange(status) {
    console.log(system);
    switch (status) {
      case "BUILDING":
        if (!system.startOfConstruction) {
          setStatusAndDate(status, "startOfConstruction");
        }
        break;
      case "TRANSFERRED":
        if (!system.endOfConstruction) {
          setStatusAndDate(status, "endOfConstruction");
        }
        break;
      case "TESTING":
        if (!system.startOfTest) {
          setStatusAndDate(status, "startOfTest");
        }
        break;
      case "FINISHED":
        if (!system.endOfTest) {
          setStatusAndDate(status, "endOfTest");
        }
        break;
      default:
        setSystem({
          ...system,
          [variable]: status === "" ? null : status,
        });
    }
  }

  //updates the system and autofill the date field with the current date
  function setStatusAndDate(status, dateToAutoFill) {
    const newDay = newWeekDay();
    const formattedDefaultDate = newDay.toISOString().split("T")[0];
    setSystem({
      ...system,
      [dateToAutoFill]: formattedDefaultDate,
      [variable]: status === "" ? null : status,
    });
  }

  //returns current workday or the next monday if it is saturday or sunday
  function newWeekDay() {
    const day = new Date();
    if (day.getDay() === 0) {
      return addDays(day, 1);
    } else if (day.getDay() === 7) {
      return addDays(day, 2);
    } else {
      return day;
    }
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
      </select>
    </div>
  );
}
