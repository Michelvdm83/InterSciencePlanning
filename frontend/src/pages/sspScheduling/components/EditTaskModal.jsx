import { useEffect, useState } from "react";
import ApiService from "../../../services/ApiService.js";
import EmployeeService from "../../../services/EmployeeService.js";
import TaskTextField from "./TaskTextField.jsx";
import TaskNumberField from "./TaskNumberField.jsx";
import TaskDateField from "./TaskDateField.jsx";
import TaskSelectEmployeeField from "./TaskSelectEmployeeField.jsx";
import { translateError, validateTaskData } from "./validateTaskData.js";

export default function EditTaskModal({ id, modalIsOpen, setModalIsOpen }) {
  const [task, setTask] = useState({});
  const [editedTask, setEditedTask] = useState({});
  const [error, setError] = useState("");
  const [assigned, setAssigned] = useState(false);
  const [loading, setLoading] = useState(true);

  const employeeFunction = EmployeeService.getEmployeeFunction();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.get(
          `http://localhost:8080/api/v1/tasks/${id}`,
        );
        const data = response.data;
        setTask(data);
        setEditedTask(data);

        setAssigned(!!data.employee);
        setLoading(true);
      } catch (error) {
        setError(translateError(error.response?.data?.detail));
      } finally {
        setLoading(false);
      }
    };
    if (modalIsOpen && id) {
      fetchData();
    } else {
      setLoading(true);
    }
  }, [id, modalIsOpen]);

  useEffect(() => {
    const modal = document.getElementById(`edit-${id}`);
    if (!loading && modalIsOpen && modal) {
      modal.showModal();
    }
  }, [loading, modalIsOpen, id]);

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      handleNewTaskSave(e);
    }
    if (e.key === "Escape") {
      e.preventDefault();
    }
  };

  const handleClose = () => {
    setEditedTask({});
    setError("");
    setModalIsOpen(false);
  };

  const handleNewTaskSave = (e) => {
    e.preventDefault();
    // Determine which fields have been edited
    const editedFields = {};
    for (const key in editedTask) {
      if (editedTask[key] !== task[key]) {
        editedFields[key] = editedTask[key];
      }
    }
    if (Object.keys(editedFields).length > 0) {
      if (validateTaskData(editedTask, setError)) {
        ApiService.patch(`tasks/${id}`, editedFields)
          .then(() => handleClose())
          .catch((error) => {
            setError(translateError(error.response?.data?.detail));
          });
      }
    } else {
      handleClose();
    }
  };

  return (
    <dialog id={`edit-${id}` || "new-task"} className="modal">
      <div className="modal-box w-[400px] text-left">
        <form method="dialog" onKeyDown={(e) => handleOnKeyDown(e)}>
          <div className="flex flex-col gap-2">
            <TaskTextField
              task={editedTask}
              setTask={setEditedTask}
              editable={employeeFunction == "TEAM_LEADER"}
              title="Taaknaam"
              variable="name"
            />
            <TaskNumberField
              task={editedTask}
              setTask={setEditedTask}
              editable={employeeFunction == "TEAM_LEADER"}
              title="Aantal Dagen"
              variable="estimatedTime"
            />

            {assigned && (
              <>
                <TaskSelectEmployeeField
                  editable={employeeFunction == "TEAM_LEADER"}
                  title="Medewerker"
                  task={editedTask}
                  setTask={setEditedTask}
                  variable="employee"
                />
                <TaskDateField
                  task={editedTask}
                  setTask={setEditedTask}
                  editable={
                    employeeFunction == "TEAM_LEADER" ||
                    employeeFunction == "SSP"
                  }
                  title="Begindatum"
                  variable="dateStarted"
                />
                <TaskDateField
                  task={editedTask}
                  setTask={setEditedTask}
                  editable={
                    employeeFunction == "TEAM_LEADER" ||
                    employeeFunction == "SSP"
                  }
                  title="Einddatum"
                  variable="dateCompleted"
                />
              </>
            )}

            {error && (
              <div className="-mb-2 mt-3 self-center text-red-600">{error}</div>
            )}
            <div className="flex flex-row justify-center gap-4">
              <button
                className="btn btn-primary mt-5 w-1/3 self-center"
                onClick={() => handleClose()}
              >
                Annuleren
              </button>
              <button
                className="modal-open={open} btn btn-accent mt-5 w-1/3 self-center"
                onClick={(e) => handleNewTaskSave(e)}
              >
                Opslaan
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
}
