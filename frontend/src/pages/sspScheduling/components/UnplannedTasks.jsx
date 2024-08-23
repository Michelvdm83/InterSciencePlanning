import { useState } from "react";
import ApiService from "../../../services/ApiService";
import PlannableTask from "./PlannableTask";

export default function UnplannedTasks({ employees, openTasks, setOpenTasks }) {
  const [error, setError] = useState("");

  function translateError(error) {
    switch (error.toString()) {
      case "Employee required":
        return "Medewerker moet gekozen worden";
      case "No enabled employee found":
        return "Geen actieve medewerker gevonden";
      default:
        return "Er is een onbekende fout opgetreden. Probeer het later opnieuw.";
    }
  }

  function assignEmployee(event, taskId) {
    const newAssignee = event.target.value;
    if (newAssignee !== "") {
      ApiService.patch("ssptasks", {
        id: taskId,
        assignee: event.target.value,
      })
        .then(() => {
          const updatedOpenTasks = openTasks.filter((t) => t.id !== taskId);
          setOpenTasks(updatedOpenTasks);
        })
        .catch((error) => {
          setError(translateError(error.response?.data?.detail));
        });
    }
  }

  return (
    <div className="flex flex-grow flex-col gap-2 rounded-md bg-neutral p-5">
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {openTasks.length > 0 &&
        openTasks.map((task) => {
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
