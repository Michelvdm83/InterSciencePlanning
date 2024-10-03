import { useEffect, useState } from "react";
import ApiService from "../../../services/ApiService.js";
import EmployeeService from "../../../services/EmployeeService.js";
import TaskTextField from "./TaskTextField.jsx";
import TaskNumberField from "./TaskNumberField.jsx";
import TaskDateField from "./TaskDateField.jsx";
import TaskSelectEmployeeField from "./TaskSelectEmployeeField.jsx";

export default function NewTaskModal({
  updateOpenTasks,
  id,
  modalIsOpen,
  setModalIsOpen,
}) {
  const [task, setTask] = useState({});
  const [editedTask, setEditedTask] = useState({});
  const [error, setError] = useState("");
  const [assigned, setAssigned] = useState(false);

  const employeeFunction = EmployeeService.getEmployeeFunction();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const response = await ApiService.get(
          `http://localhost:8080/api/v1/tasks/${id}`,
        );
        const data = response.data;

        setTask(data);

        if (data.employee) {
          setAssigned(true);
        }
      };
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (modalIsOpen) {
      const modal = document.getElementById(`edit-${id}` || "new-task");
      if (modal) {
        modal.showModal();
      }
      if (id) {
        setEditedTask({ ...task });
      }
    }
  }, [modalIsOpen, id, task]);

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      handleNewTaskSave(e);
    }
    if (e.key === "Escape") {
      e.preventDefault();
    }
  };

  const handleClose = () => {
    setTask({});
    setEditedTask({});
    setError("");
    setModalIsOpen(false);
  };

  const handleNewTaskSave = (e) => {
    e.preventDefault();

    if (!id) {
      if (validateTaskData(task, setError)) {
        ApiService.post("tasks", task)
          .then(() => handleClose())
          .then(updateOpenTasks())
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              setError("Medewerker niet gevonden");
            } else {
              setError(translateError(error.response?.data?.detail));
            }
          });
      }
    } else {
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
    }
  };

  return (
    <dialog id={`edit-${id}` || "new-task"} className="modal">
      <div className="modal-box w-96">
        <form method="dialog" onKeyDown={(e) => handleOnKeyDown(e)}>
          <div className="flex flex-col">
            <button
              type="button"
              className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
              onClick={() => handleClose()}
            >
              ✕
            </button>
            <TaskTextField
              task={id ? editedTask : task}
              setTask={id ? setEditedTask : setTask}
              editable={employeeFunction == "TEAM_LEADER"}
              title="Systeem"
              variable="name"
            />
            <TaskNumberField
              task={id ? editedTask : task}
              setTask={id ? setEditedTask : setTask}
              editable={employeeFunction == "TEAM_LEADER"}
              title="Aantal Dagen"
              variable="estimatedTime"
            />

            {assigned && (
              <>
                <TaskSelectEmployeeField
                  editable={employeeFunction == "TEAM_LEADER"}
                  title="Medewerker"
                  task={id ? editedTask : task}
                  setTask={id ? setEditedTask : setTask}
                  variable="employee"
                />
                <TaskDateField
                  task={id ? editedTask : task}
                  setTask={id ? setEditedTask : setTask}
                  editable={
                    employeeFunction == "TEAM_LEADER" ||
                    employeeFunction == "SSP"
                  }
                  title="Startdatum"
                  variable="dateStarted"
                />
                <TaskDateField
                  task={id ? editedTask : task}
                  setTask={id ? setEditedTask : setTask}
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
            <button
              className="modal-open={open} btn btn-accent mt-5 w-20 self-center"
              onClick={(e) => handleNewTaskSave(e)}
            >
              Opslaan
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
