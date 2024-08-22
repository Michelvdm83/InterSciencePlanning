import { useEffect, useState } from "react";
import ApiService from "../../../services/ApiService.js";

export default function NewTaskModal() {
  const [taskName, setTaskName] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEstimatedTimeValueChange = (newValue) => {
    if (/^\d*$/.test(newValue)) {
      //check if from beginning ^ to end $ of the input string it only consists of numbers \d*
      setEstimatedTime(newValue);
    }
  };

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      handleNewTaskSave(e);
    }
  };

  const handleClose = () => {
    setTaskName("");
    setEstimatedTime("");
    setErrorMessage(null);
  };

  const handleNewTaskSave = (event) => {
    if (taskName != "" && estimatedTime != "") {
      const name = taskName;

      const newTask = { name, estimatedTime };

      ApiService.post("tasks", newTask);

      setTaskName("");
      setEstimatedTime("");
      setErrorMessage();
    } else {
      event.preventDefault();
      setErrorMessage("Beide velden zijn verplicht");
    }
  };

  return (
    <div className="modal-box w-96">
      <form method="dialog" onKeyDown={(e) => handleOnKeyDown(e)}>
        <div className="flex flex-col">
          <button
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
            onClick={() => handleClose()}
          >
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
            <span>Aantal dagen:</span>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={estimatedTime}
              onChange={(e) => handleEstimatedTimeValueChange(e.target.value)}
            />
          </div>

          {errorMessage && (
            <div className="-mb-2 mt-3 self-center text-red-600">
              {errorMessage}
            </div>
          )}

          <button
            className="modal-open={open} btn btn-accent mt-5 w-20 self-center"
            onClick={(e) => handleNewTaskSave(e)}
          >
            Opslaan
          </button>
        </div>
      </form>
    </div>
  );
}
