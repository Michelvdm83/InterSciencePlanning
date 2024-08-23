import SystemModalButton from "../../../components/SystemModalButton";

export default function PlannableTask({ task, employees, onChange }) {
  const taskName = task.taskName;
  const systemName = task.systemName;
  const estimatedTime = task.estimatedTime;
  let labelClasses = "label rounded-md bg-white p-3";
  if (systemName) {
    labelClasses += " cursor-pointer text-primary";
  }

  function getStandardField(label) {
    return (
      <label className={labelClasses}>
        {label}
        {estimatedTime && (
          <select
            defaultValue={""}
            onChange={onChange}
            className="select select-bordered select-accent select-sm w-1/2 cursor-pointer text-black"
            onClick={(event) => event.stopPropagation()}
          >
            <option value="" disabled>
              Naam
            </option>
            {employees.map((employee) => {
              return (
                <option value={employee.id} key={employee.id}>
                  {employee.name}
                </option>
              );
            })}
          </select>
        )}
        {!estimatedTime && systemName && (
          <p className="text-red-600">
            Productiedagen moet nog ingevuld worden
          </p>
        )}
      </label>
    );
  }
  if (systemName) {
    return (
      <SystemModalButton systemName={systemName}>
        {getStandardField(systemName)}
      </SystemModalButton>
    );
  } else {
    return getStandardField(taskName);
  }
}
