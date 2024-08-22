/* Safelist: border-holiday border-started border-planned border-task border-done bg-done bg-task bg-planned bg-holiday bg-started bg-accent */

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

  useEffect(() => {
    setLoading(true);
    ApiService.get("/employees/ssp-planning").then((response) =>
      setEmployees(sortEmployeesOnFunction(response.data)),
    );

    setDateArray(ScheduleService.getDates(beginDate, planningDays));

    setLoading(false);
  }, []);

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

  const employee1Tasks = [
    { name: "Bakger001", numberOfDays: "3", status: "started" },
    { name: "Vakantie", numberOfDays: "4", status: "holiday" },
    { name: "10x kolomovens", numberOfDays: "2", status: "task" },
    { name: "Bakger002", numberOfDays: "5", status: "planned" },
    { name: "Bakger003", numberOfDays: "5", status: "planned" },
    { name: "vakantie", numberOfDays: "1", status: "holiday" },
  ];

  const getTasks = (employeeId) => {
    return ScheduleService.getEmployeeSchedule(
      beginDate,
      planningDays,
      employeeId,
    );
  };

  if (loading === true) {
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

          {employees.map((employee, employeeIndex) => {
            const employeeTasks = getTasks(employee.id);
            {
              return employeeTasks.map((task, taskIndex) => {
                return Array.from({ length: task.numberOfDays }).map((_, i) => {
                  //index of amount of gridboxes of tasks in this column, it is the x't gridbox of this task + numberOfDays (aka gridboxes) of the preceding taks
                  const overallIndex =
                    employeeTasks
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
                    case "planned":
                      bgColor = "planned";
                      break;
                    case "done":
                      bgColor = "done";
                      break;
                    case "task":
                      bgColor = "task";
                      break;
                    default:
                      bgColor = "neutral";
                  }

                  const borderClass =
                    i === task.numberOfDays - 1 && (overallIndex + 1) % 5 != 0
                      ? "border-black"
                      : `border-${bgColor}`;

                  return (
                    <div
                      key={overallIndex}
                      className={`${borderClass} bg-${bgColor} col-start-${employeeIndex + 2} mr-[2px] h-7 border-b-[1.5px] border-solid`}
                    >
                      {i === 0 ? task.name : ""}
                    </div>
                  );
                });
              });
            }
          })}
        </div>
      </div>
    </div>
  );
}
