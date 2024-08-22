import { useEffect, useState } from "react";
import ApiService from "../../../services/ApiService";
import { json } from "react-router-dom";
import SystemModalButton from "../../../components/SystemModalButton";
import PlannableTask from "./PlannableTask";

export default function UnplannedTasks() {
  const [openTasks, setOpenTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    ApiService.get("employees/ssp-planning").then((response) => {
      setEmployees(response.data);
    });

    ApiService.get("ssptasks/unplanned").then((response) => {
      setOpenTasks(response.data);
    });
  }, []);

  function assignEmployee(event, taskId) {
    const newAssignee = event.target.value;
    if (newAssignee !== "") {
      ApiService.patch("ssptasks", {
        id: taskId,
        assignee: event.target.value,
      }).then(() => {
        const updatedOpenTasks = openTasks.filter((t) => t.id !== taskId);
        setOpenTasks(updatedOpenTasks);
      });
    }
  }

  return (
    <div className="flex flex-grow flex-col gap-2 rounded-md bg-neutral p-5">
      {openTasks.map((task) => {
        return (
          <PlannableTask
            task={task}
            employees={employees}
            onChange={(event) => assignEmployee(event, task.id)}
            key={task.id}
          />
        );
      })}
    </div>
  );
}
