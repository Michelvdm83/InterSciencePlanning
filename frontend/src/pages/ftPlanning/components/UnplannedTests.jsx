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
            <div
              className="flex max-h-16 w-3/4 cursor-pointer items-center gap-2 rounded-md bg-white p-3"
              key={test.id}
            >
              <div className="w-1/2">
                <SystemModalButton
                  updateOpenTasks={updateOpenTests}
                  systemName={test.systemName}
                >
                  <div className="w-full overflow-hidden text-ellipsis text-primary">
                    {test.systemName}
                  </div>
                </SystemModalButton>
              </div>
              <div className="w-1/2">
                {test.estimatedDays && (
                  <select
                    defaultValue={""}
                    onChange={(event) => assignEmployee(event, test.id)}
                    className="select select-bordered select-accent select-sm cursor-pointer text-black"
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
                )}
                {!test.estimatedDays && (
                  <p className="line-clamp-2 max-h-14 w-full text-ellipsis text-red-600">
                    Testdagen moet nog ingevuld worden
                  </p>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
