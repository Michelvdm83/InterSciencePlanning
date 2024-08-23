import { useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import ApiService from "../../../services/ApiService";

export default function TasksPerEmployee({ employees }) {
  const [tasks, setTasks] = useState([]);
  const [currentEmployeeId, setCurrentEmployeeId] = useState("");

  const sortedTasks = tasks
    ? tasks.slice().sort((a, b) => Number(a.index) - Number(b.index))
    : [];
  const firstIndex = sortedTasks.length > 0 ? sortedTasks[0].index : 0;
  console.log(firstIndex);

  useEffect(() => {
    if (currentEmployeeId.length > 1) {
      ApiService.get("/ssptasks/by-employee/" + currentEmployeeId).then(
        (response) => {
          setTasks(response.data);
        },
      );
    }
  }, [currentEmployeeId]);

  function handleReorder(newTasks) {
    newTasks.forEach((t, index) => {
      t.index = firstIndex + index;
      ApiService.patch("/ssptasks/update-order/" + t.id, t);
    });
    setTasks(newTasks);
  }

  return (
    <div>
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
      <Reorder.Group values={sortedTasks} onReorder={handleReorder}>
        {sortedTasks.map((sortedTask) => (
          <Reorder.Item key={sortedTask.id} value={sortedTask}>
            {sortedTask.systemName
              ? sortedTask.systemName
              : sortedTask.taskName}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
