import { useEffect } from "react";

export default function SystemDateField({
  editable,
  title,
  system,
  setSystem,
  variable,
  date,
}) {
  useEffect(() => {
    if (variable === "agreedDate" && !date) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 12 * 7);
      const formattedDefaultDate = defaultDate.toISOString().split("T")[0];
      setSystem({ ...system, [variable]: formattedDefaultDate });
    }
  }, [date]);

  const classes =
    "input input-sm w-full text-accent select-text disabled:bg-white disabled:text-accent" +
    (date || system[variable]
      ? ""
      : " text-transparent disabled:text-transparent");

  return (
    <div>
      <div>{title}</div>
      <input
        type="date"
        value={
          variable === "expectedFinish" ? date || "" : system[variable] || ""
        }
        onChange={(event) => {
          setSystem({ ...system, [variable]: event.target.value });
        }}
        onBlur={() => {
          if (date === "") {
            setSystem({
              ...system,
              [variable]: null,
            });
          }
        }}
        className={classes}
        disabled={!editable}
      />
    </div>
  );
}
