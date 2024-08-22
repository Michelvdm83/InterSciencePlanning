import NewTaskModal from "./components/NewTaskModal.jsx";
import UnplannedTasks from "./components/UnplannedTasks.jsx";

export default function SSPSCheduling() {
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
        <div className="btn btn-accent btn-lg mb-2 rounded-md">
          Nieuw Systeem
        </div>
        <UnplannedTasks />
      </div>
      <div className="m-4 w-1/3 rounded-md bg-neutral">
        Wachtlijst taken/systemen ssp medewerker placeholder
      </div>
      <div className="m-4 w-1/3 rounded-md bg-neutral">
        Vertraagde systemen placeholder
      </div>
    </div>
  );
}
