import NewTaskModal from "./subcomponents/NewTaskModal";

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
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
              <NewTaskModal />
            </form>
          </div>
        </dialog>
        <div className="btn btn-accent btn-lg mb-2 rounded-md">
          Nieuw Systeem
        </div>
        <div className="flex-grow rounded-md bg-neutral">heleuuuu</div>
      </div>
      <div className="m-4 w-1/3 rounded-md bg-neutral">heleuuuu</div>
      <div className="m-4 w-1/3 rounded-md bg-neutral">heleuuuu</div>
    </div>
  );
}
