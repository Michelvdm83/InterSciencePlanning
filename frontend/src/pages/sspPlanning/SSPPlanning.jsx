/* Safelist: border-primary border-holiday border-started border-planned border-task border-done border-conflict bg-primary bg-done bg-task bg-planned bg-holiday bg-started bg-accent bg-conflict */

import { useEffect, useState } from "react";
import ApiService from "../../services/ApiService.js";
import ScheduleService from "../../services/ScheduleService.js";
import SystemModalButton from "../../components/SystemModalButton.jsx";
import TaskModalButton from "../sspScheduling/components/TaskModalButton.jsx";

export default function SSPPlanning() {
  const planningDays = 20;
  //set begin date needed for later implementation of selecting the period you want to see
  const [beginDate, setBeginDate] = useState(
    ScheduleService.getMonday(new Date()),
  );
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [dateArray, setDateArray] = useState([]);
  const [employeeTasks, setEmployeeTasks] = useState([]);

  useEffect(() => {
    ApiService.get("/employees/ssp-planning")
      .then((response) => {
        return sortEmployeesOnFunction(response.data);
      })
      .then((sortedEmployees) => {
        setEmployees(sortedEmployees);
        getEmployeeTasks(sortedEmployees).then(() => {
          setLoadingSchedule(false);
        });
      });

    setDateArray(ScheduleService.getDates(beginDate, planningDays));
    setLoading(false);
  }, []);

  function update() {
    getEmployeeTasks(employees);
  }

  const getEmployeeTasks = async (employees) => {
    let newEmployeeTasksArray = [];
    for (const employee of employees) {
      const newEmployeeTasks = await ScheduleService.getEmployeeSchedule(
        beginDate,
        planningDays,
        employee.id,
      );

      newEmployeeTasksArray.push(newEmployeeTasks);
    }
    setEmployeeTasks(newEmployeeTasksArray);
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

  if (loading === true || loadingSchedule === true) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex h-full w-full justify-center overflow-auto p-8">
      <div className="flex h-max max-h-full max-w-full flex-col overflow-hidden rounded-lg border border-secondary p-4">
        <div
          className={`grid p-0 grid-cols-[repeat(${employees.length + 1},150px)] max-w-full grid-flow-col grid-rows-[repeat(21,auto)] overflow-scroll bg-base-100 text-center font-Effra_Md`}
        >
          {/* white cell al the coll 1 and row 1 to prevent the names being visible above the dates when you scroll left to show more employees */}
          <div className="sticky left-0 z-50 col-start-1 row-span-1 row-start-1 bg-white"></div>

          {/* employee names on the top row */}
          {employees.map((employee, index) => {
            return (
              <div
                key={index}
                className={`row-start-1 col-start-${index + 2} h-auto w-48 self-end font-Effra_Bd text-2xl text-secondary`}
              >
                {employee.name}
              </div>
            );
          })}

          {/* dates column at the left side */}
          {dateArray.map((date, index) => (
            <div
              key={index}
              className={`bg-base-100 text-secondary ${(index + 1) % 5 === 0 ? "mb-2" : ""} row-start-${index + 2} sticky left-0 h-7 w-28 border-b-[1.5px] border-solid border-neutral px-3 font-Effra_Md`}
            >
              {date.toLocaleDateString()}
            </div>
          ))}
          {employeeTasks.map((currentEmployeeTasks, employeeIndex) => {
            return currentEmployeeTasks.map((task, taskIndex) => {
              return Array.from({ length: task.numberOfDays }).map((_, i) => {
                //index of amount of gridboxes of tasks in this column, it is the x't gridbox of this task + numberOfDays (aka gridboxes) of the preceding taks
                const overallIndex =
                  currentEmployeeTasks
                    .slice(0, taskIndex)
                    .reduce(
                      (acc, task) => acc + parseInt(task.numberOfDays),
                      0,
                    ) + i;

                let bgColor;
                switch (task.status) {
                  case "holiday":
                    bgColor = "holiday";
                    break;
                  case "started":
                    bgColor = "started";
                    break;
                  case "PLANNED":
                  case "TO_BE_PLANNED": //NEED to be REMOVED WHEN the automatic status changed to planned when assigning employee is implemented
                    bgColor = "planned";
                    break;

                  case "TRANSFERRED":
                  case "TESTING":
                  case "FINISHED":
                  case "INSTALLED":
                  case "PROBLEMS":
                  case "IN_WAIT":
                    bgColor = "done";
                    break;
                  case "task":
                    bgColor = "task";
                    break;
                  case "delayed":
                    bgColor = "primary";
                    break;
                  case "conflict":
                  case "error":
                    bgColor = "conflict";
                    break;
                  default:
                    bgColor = "neutral";
                }

                /*
  PLANNED,
  BUILDING,
  TRANSFERRED,
  TESTING,
  FINISHED,
  INSTALLED,
  PROBLEMS,
  IN_WAIT
                */

                const borderClass =
                  i === task.numberOfDays - 1 && (overallIndex + 1) % 5 != 0
                    ? "border-black"
                    : `border-${bgColor}`;

                if (
                  (bgColor === "started" ||
                    bgColor === "planned" ||
                    bgColor === "done" ||
                    bgColor === "primary") &&
                  i === 0
                ) {
                  return (
                    <div
                      key={overallIndex}
                      className={`${borderClass} bg-${bgColor} col-start-${employeeIndex + 2} mr-[2px] flex h-7 w-auto justify-center border-b-[1.5px] border-solid text-start`}
                    >
                      <SystemModalButton
                        systemName={task.taskName}
                        updateOpenTasks={update}
                      >
                        <div className="underline hover:text-white">
                          {task.taskName}
                        </div>
                      </SystemModalButton>
                    </div>
                  );
                } else
                  return (
                    <div
                      key={overallIndex}
                      className={`${borderClass} bg-${bgColor} col-start-${employeeIndex + 2} mr-[2px] h-7 border-b-[1.5px] border-solid`}
                    >
                      <TaskModalButton
                        id={task.taskId}
                        updateOpenTasks={update}
                      >
                        <div className="underline hover:text-white">
                          {i === 0 ? task.taskName : ""}
                        </div>
                      </TaskModalButton>
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
