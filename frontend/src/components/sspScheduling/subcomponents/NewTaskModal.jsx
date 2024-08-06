import { useEffect, useState } from "react";
import ApiService from "../../../services/ApiService";

export default function NewTaskModal() {
  const [taskName, setTaskName] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  const handleEstimatedTimeValueChange = (newValue) => {
    if (/^\d*$/.test(newValue)) {
      //check if from beging ^ to end $ of the input string it only consists of numbers \d*
      setEstimatedTime(newValue);
    }
  };

  const handleNewTaskSave = () => {
    const name = taskName;

    const newTask = { name, estimatedTime };

    ApiService.post("tasks", newTask);

    setTaskName("");
    setEstimatedTime("");
  };

  return (
    <div className="flex flex-col">
      <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
        ✕
      </button>

      <div className="flex flex-col">
        <span>Taaknaam:</span>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
      </div>

      <div className="mt-4 flex flex-col">
        <span>verwachte aantal dagen:</span>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          value={estimatedTime}
          onChange={(e) => handleEstimatedTimeValueChange(e.target.value)}
        />
      </div>

      <button
        className="btn btn-accent mt-4 w-20 self-center"
        onClick={() => handleNewTaskSave()}
      >
        Oplsaan
      </button>
    </div>
  );
}
