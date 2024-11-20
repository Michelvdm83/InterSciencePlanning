import SystemModalButton from "../../../components/SystemModalButton";
import DeleteTaskButton from "./DeleteTaskButton";
import TaskModalButton from "./TaskModalButton";

export default function PlannableTask({
  task,
  employees,
  onChange,
  updateOpenTasks,
}) {
  const taskName = task.taskName;
  const systemName = task.systemName;
  const estimatedTime = task.estimatedTime;
  let labelClasses = "label p-3 cursor-pointer w-3/4 overflow-hidden";
  if (systemName) {
    labelClasses += " text-primary";
  }

  function getStandardField(label) {
    return (
      <div className="flex flex-row items-center justify-between rounded-md bg-white p-2">
        <label className={labelClasses}>
          <span className="truncate whitespace-nowrap">{label}</span>
        </label>

        <div className="flex w-3/4 items-center justify-end gap-2">
          {estimatedTime && (
            <select
              defaultValue={""}
              onChange={onChange}
              className="select select-bordered select-accent select-sm w-3/4 cursor-pointer text-black"
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
          <div className="mr-2 w-1/12">
            {taskName && (
              <div onClick={(event) => event.stopPropagation()}>
                <DeleteTaskButton
                  question={`Weet je zeker dat je de taak '${taskName}' wilt verwijderen?`}
                  taskId={task.taskId}
                  afterDelete={updateOpenTasks}
                />
              </div>
            )}
          </div>
        </div>
      </div>
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
    return (
      <TaskModalButton id={task.taskId} updateOpenTasks={updateOpenTasks}>
        {getStandardField(taskName)}
      </TaskModalButton>
    );
  }
}
