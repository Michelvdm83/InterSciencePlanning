import { TiPlus } from "react-icons/ti";
import ApiService from "../../../services/ApiService";
import SystemModalButton from "../../../components/SystemModalButton";

export default function UnplannedTasks({
  employees,
  openTests,
  updateOpenTests,
}) {
  function assignEmployee(event, taskId) {
    const newAssignee = event.target.value;
    if (newAssignee !== "") {
      ApiService.patch("fttasks", {
        id: taskId,
        assignee: event.target.value,
      }).then(() => {
        updateOpenTests();
      });
    }
  }

  return (
    <div className="m-4 flex w-1/3 flex-col items-center gap-2 overflow-auto rounded-md bg-neutral p-5">
      <div className="flex w-3/4 justify-between border-b-2 border-black">
        <div className="w-1/2 pb-2 pt-2">Nog in te plannen</div>
        <SystemModalButton updateOpenTasks={updateOpenTests}>
          <TiPlus className="h-full cursor-pointer text-4xl text-accent" />
        </SystemModalButton>
      </div>
      {openTests.length > 0 &&
        openTests.map((test) => {
          return (
            <SystemModalButton
              updateOpenTasks={updateOpenTests}
              systemName={test.systemName}
            >
              <label
                className="label w-3/4 cursor-pointer text-nowrap rounded-md bg-white p-3 text-primary"
                key={test.id}
              >
                {test.systemName}
                <select
                  defaultValue={""}
                  onChange={(event) => assignEmployee(event, test.id)}
                  className="select select-bordered select-accent select-sm flex w-1/2 cursor-pointer text-black"
                  onClick={(event) => event.stopPropagation()}
                >
                  <option value="" disabled>
                    Naam
                  </option>
                  {employees.map((employee) => {
                    return (
                      <option value={employee.id} key={employee.id}>
                        {employee.name}
                      </option>
                    );
                  })}
                </select>
              </label>
            </SystemModalButton>
          );
        })}
    </div>
  );
}
