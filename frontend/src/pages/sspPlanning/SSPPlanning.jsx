import { useEffect, useState } from "react";
import ApiService from "../../services/ApiService.js";
import ScheduleService from "../../services/ScheduleService.js";

export default function SSPPlanning() {
  const planningDays = 20;
  const [beginDate, setBeginDate] = useState(
    ScheduleService.getMonday(new Date()),
  );
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateArray, setDateArray] = useState([]);
  const [employeeTasks, setEmployeeTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesResponse = await getEmployees();
        setEmployees(sortEmployeesOnFunction(employeesResponse));
        const newEmployeeTasksArray = await getEmployeeTasks(employeesResponse);
        setEmployeeTasks(newEmployeeTasksArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchData();
    setDateArray(ScheduleService.getDates(beginDate, planningDays));
  }, []);

  const getEmployees = async () => {
    const employeesResponse = await ApiService.get("/employees/ssp-planning");
    return await employeesResponse.data;
  };

  const getEmployeeTasks = async (employees) => {
    let newEmployeeTasksArray = [];

    for (const employee of employees) {
      try {
        const newEmployeeTasks = await ScheduleService.getEmployeeSchedule(
          beginDate,
          planningDays,
          employee.id,
        );

        // Push only if tasks are retrieved, otherwise push an empty array
        newEmployeeTasksArray.push(newEmployeeTasks || []);
      } catch (error) {
        console.error(
          `Error fetching tasks for employee ${employee.id}:`,
          error,
        );
        // Add an empty array for this employee if an error occurs
        newEmployeeTasksArray.push([]);
      }
    }
    return newEmployeeTasksArray;
  };

  const sortEmployeesOnFunction = (unsortedEmployees) => {
    return unsortedEmployees.sort(function (a, b) {
      if (a.function === "SSP" && b.function !== "SSP") {
        return -1;
      } else if (a.function !== "SSP" && b.function === "SSP") {
        return 1;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  };

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex h-full w-full justify-center overflow-auto p-8">
      <div className="flex h-max max-h-full max-w-full flex-col overflow-hidden rounded-lg border border-secondary p-4">
        <div
          className={`grid p-4 grid-cols-[repeat(${employees.length + 1},150px)] max-w-full grid-flow-col grid-rows-[repeat(21,auto)] overflow-scroll bg-base-100 text-center font-Effra_Md`}
        >
          {employees.map((employee, index) => {
            return (
              <div
                key={index}
                className={`row-start-1 col-start-${index + 2} h-10 w-48 font-Effra_Bd text-2xl text-secondary`}
              >
                {employee.name}
              </div>
            );
          })}

          {dateArray.map((date, index) => (
            <div
              key={index}
              className={`bg-base-100 text-secondary ${(index + 1) % 5 === 0 ? "mb-2" : ""} row-start-${index + 2} h-7 w-28 border-b-[1.5px] border-solid border-neutral px-3 font-Effra_Md`}
            >
              {date.toLocaleDateString()}
            </div>
          ))}

          {employeeTasks.map((currentEmployeeTasks, employeeIndex) => {
            if (
              !Array.isArray(currentEmployeeTasks) ||
              currentEmployeeTasks.length === 0
            ) {
              return null;
            }

            return currentEmployeeTasks.map((task, taskIndex) => {
              const numberOfDays = parseInt(task.numberOfDays, 10);

              return Array.from({ length: numberOfDays }).map((_, i) => {
                //index of amount of gridboxes of tasks in this column, it is the x't gridbox of this task + numberOfDays (aka gridboxes) of the preceding taks
                const overallIndex =
                  currentEmployeeTasks
                    .slice(0, taskIndex)
                    .reduce((acc, task) => {
                      const days = parseInt(task.numberOfDays, 10) || 0;
                      return acc + days;
                    }, 0) + i;

                let bgColor;
                switch (task.status) {
                  case "holiday":
                    bgColor = "holiday";
                    break;
                  case "started":
                    bgColor = "started";
                    break;
                  case "planned":
                    bgColor = "planned";
                    break;
                  case "done":
                    bgColor = "done";
                    break;
                  case "task":
                    bgColor = "task";
                    break;
                  case "conflict":
                    bgColor = "error";
                    break;
                  default:
                    bgColor = "neutral";
                }

                const borderClass =
                  i === numberOfDays - 1 && (overallIndex + 1) % 5 !== 0
                    ? "border-black"
                    : `border-${bgColor}`;

                return (
                  <div
                    key={overallIndex}
                    className={`${borderClass} bg-${bgColor} col-start-${employeeIndex + 2} mr-[2px] h-7 border-b-[1.5px] border-solid`}
                  >
                    {i === 0 ? task.taskName : ""}
                  </div>
                );
              });
            });
          })}
        </div>
      </div>
    </div>
  );
}
