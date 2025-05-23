import { useEffect, useState } from "react";
import SystemModalButton from "../../components/SystemModalButton.jsx";
import TaskModalButton from "./components/TaskModalButton.jsx";
import NewTaskModal from "./components/NewTaskModal.jsx";
import UnplannedTasks from "./components/UnplannedTasks.jsx";
import TasksPerEmployee from "./components/TasksPerEmployee.jsx";
import ApiService from "../../services/ApiService.js";
import DelayedSystems from "./components/DelayedSystems.jsx";
import YearOverviewDownloadComponent from "./components/YearOverviewDownloadComponent.jsx";

export default function SSPSCheduling() {
  const [employees, setEmployees] = useState([]);
  const [openTasks, setOpenTasks] = useState([]);

  useEffect(() => {
    updateOpenTasks();

    ApiService.get("employees/ssp-planning").then((response) => {
      setEmployees(response.data);
    });
  }, []);

  function updateOpenTasks() {
    ApiService.get("ssptasks/unplanned").then((response) => {
      setOpenTasks(response.data);
    });
  }

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
          <NewTaskModal updateOpenTasks={updateOpenTasks} />
        </dialog>
        <SystemModalButton functionOnModalClose={updateOpenTasks}>
          <div className="btn btn-accent btn-lg mb-2 w-full rounded-md">
            Nieuw Systeem
          </div>
        </SystemModalButton>
        <UnplannedTasks
          employees={employees}
          openTasks={openTasks}
          setOpenTasks={setOpenTasks}
          updateOpenTasks={updateOpenTasks}
        />
      </div>
      <TasksPerEmployee
        employees={employees}
        openTasks={openTasks}
        updateOpenTasks={updateOpenTasks}
      />
      <div className="m-4 flex w-1/3 flex-col gap-4">
        <DelayedSystems
          updateOpenTasks={updateOpenTasks}
          openTasks={openTasks}
        />
        <YearOverviewDownloadComponent />
      </div>
    </div>
  );
}
