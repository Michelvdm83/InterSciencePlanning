import { useEffect, useState } from "react";
import SystemModalButton from "../../components/SystemModalButton.jsx";
import NewTaskModal from "./components/NewTaskModal.jsx";
import UnplannedTasks from "./components/UnplannedTasks.jsx";
import TasksPerEmployee from "./components/TasksPerEmployee.jsx";
import ApiService from "../../services/ApiService.js";

export default function SSPSCheduling() {
  const [employees, setEmployees] = useState([]);
  const [openTasks, setOpenTasks] = useState([]);

  useEffect(() => {
    ApiService.get("ssptasks/unplanned").then((response) => {
      setOpenTasks(response.data);
    });

    ApiService.get("employees/ssp-planning").then((response) => {
      setEmployees(response.data);
    });
  }, []);

  return (
    <div className="flex h-full w-screen flex-grow">
      <div className="m-4 flex w-1/3 flex-col">
        <div
          className="btn btn-accent btn-lg mb-2 rounded-md"
          onClick={() => document.getElementById("new_task_modal").showModal()}
        >
          Nieuwe Taak
        </div>
        <dialog id="new_task_modal" className="modal">
          <NewTaskModal />
        </dialog>
        <SystemModalButton>
          <div className="btn btn-accent btn-lg mb-2 w-full rounded-md">
            Nieuw Systeem
          </div>
        </SystemModalButton>
        <UnplannedTasks
          employees={employees}
          openTasks={openTasks}
          setOpenTasks={setOpenTasks}
        />
      </div>
      <div className="m-4 w-1/3 rounded-md bg-neutral">
        <TasksPerEmployee employees={employees} openTasks={openTasks} />
      </div>
      <div className="m-4 w-1/3 rounded-md bg-neutral">
        Vertraagde systemen placeholder
      </div>
    </div>
  );
}
