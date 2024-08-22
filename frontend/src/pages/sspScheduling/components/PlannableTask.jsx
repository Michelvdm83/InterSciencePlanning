import SystemModalButton from "../../../components/SystemModalButton";

export default function PlannableTask({ task, employees, onChange }) {
  const taskName = task.taskName;
  const systemName = task.systemName;
  const estimatedTime = task.estimatedTime;

  function getStandardField(label) {
    return (
      <label className="label">
        {label}
        <select
          defaultValue={""}
          onChange={onChange}
          className="select select-bordered mt-2 w-1/2"
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
