import SystemModalButton from "../../../components/SystemModalButton";
import DeleteTaskButton from "./DeleteTaskButton";

export default function PlannableTask({
  task,
  employees,
  onChange,
  updateOpenTasks,
}) {
  const taskName = task.taskName;
  const systemName = task.systemName;
  const estimatedTime = task.estimatedTime;
  let labelClasses = "label rounded-md bg-white p-3 text-nowrap";
  if (systemName) {
    labelClasses += " cursor-pointer text-primary";
  }

  function getStandardField(label) {
    return (
      <label className={labelClasses}>
        {label}
        <div className="flex w-3/4 items-center justify-end gap-2">
          {estimatedTime && (
            <select
              defaultValue={""}
              onChange={onChange}
              className="select select-bordered select-accent select-sm flex w-1/2 cursor-pointer text-black"
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
          <div className="w-1/12">
            {taskName && (
              <DeleteTaskButton
                question={`Weet je zeker dat je de taak: ${taskName} wilt verwijderen?`}
                taskId={task.taskId}
                afterDelete={updateOpenTasks}
              />
            )}
          </div>
        </div>
      </label>
    );
  }
  if (systemName) {
    return (
      <SystemModalButton
        systemName={systemName}
        updateOpenTasks={updateOpenTasks}
      >
        {getStandardField(systemName)}
      </SystemModalButton>
    );
  } else {
    return getStandardField(taskName); //deleteButton toevoegen
  }
}
