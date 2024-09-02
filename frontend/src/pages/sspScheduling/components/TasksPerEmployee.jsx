import { useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import ApiService from "../../../services/ApiService";
import SystemModalButton from "../../../components/SystemModalButton";
import { MdDragHandle } from "react-icons/md";
import DeleteTaskButton from "./DeleteTaskButton";

export default function TasksPerEmployee({
  employees,
  openTasks,
  updateOpenTasks,
}) {
  const [tasks, setTasks] = useState([]);
  const [currentEmployeeId, setCurrentEmployeeId] = useState("");

  const sortedTasks = tasks
    ? tasks.slice().sort((a, b) => Number(a.index) - Number(b.index))
    : [];
  const firstIndex = sortedTasks.length > 0 ? sortedTasks[0].index : 0;

  useEffect(() => {
    getCurrentEmployeeTasks();
  }, [currentEmployeeId, openTasks]);

  function getCurrentEmployeeTasks() {
    if (currentEmployeeId.length > 1) {
      ApiService.get("/ssptasks/by-employee/" + currentEmployeeId).then(
        (response) => {
          setTasks(response.data);
        },
      );
    }
  }

  function handleReorder(newTasks) {
    newTasks.forEach((t, index) => {
      t.index = firstIndex + index;
      ApiService.patch("/ssptasks/update-order/" + t.id, t);
    });
    setTasks(newTasks);
  }

  function getStandardField(name, textClass) {
    return <div className={textClass + " w-1/3"}>{name}</div>;
  }

  function getField(currentTask) {
    if (currentTask.systemName) {
      return (
        <div className="w-fit whitespace-nowrap">
          <SystemModalButton
            systemName={currentTask.systemName}
            updateOpenTasks={updateOpenTasks}
          >
            {getStandardField(
              "Systeem: " + currentTask.systemName,
              "text-primary cursor-pointer",
            )}
          </SystemModalButton>
        </div>
      );
    } else {
      return getStandardField(
        "Taak: " + currentTask.taskName,
        "text-secondary",
      );
    }
  }

  return (
    <div className="m-4 flex w-1/3 flex-grow flex-col items-center gap-2 rounded-md bg-neutral p-5">
      {employees && (
        <select
          defaultValue={""}
          onChange={(event) => setCurrentEmployeeId(event.target.value)}
          className="select select-bordered select-accent select-sm w-1/2 cursor-pointer"
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
      <Reorder.Group
        values={sortedTasks}
        onReorder={handleReorder}
        className="w-full overflow-auto bg-transparent p-2"
      >
        {sortedTasks.map((sortedTask) => (
          <Reorder.Item
            key={sortedTask.id}
            value={sortedTask}
            className="m-2 flex cursor-ns-resize justify-between rounded-md bg-white p-3"
          >
            {getField(sortedTask)}
            <div className="flex justify-end gap-3">
              {sortedTask.taskId && (
                <DeleteTaskButton
                  question={`Weet je zeker dat je de taak '${sortedTask.taskName}' wilt verwijderen?`}
                  taskId={sortedTask.taskId}
                  afterDelete={getCurrentEmployeeTasks}
                />
              )}
              <MdDragHandle className="self-center text-2xl text-neutral" />
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
