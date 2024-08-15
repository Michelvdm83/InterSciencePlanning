/* Safelist: border-holiday border-started border-planned border-task border-done bg-done bg-task bg-planned bg-holiday bg-started bg-accent col-start-1 col-start-2 col-start-4 col-start-3 row-start-1 row-start-2 row-start-3 */

export default function SSPPlanning() {
  const dateCol = [
    "2024-08-12",
    "2024-08-13",
    "2024-08-14",
    "2024-08-15",
    "2024-08-16",
    "2024-08-19",
    "2024-08-20",
    "2024-08-21",
    "2024-08-22",
    "2024-08-23",
    "2024-08-26",
    "2024-08-27",
    "2024-08-28",
    "2024-08-29",
    "2024-08-30",
    "2024-09-02",
    "2024-09-03",
    "2024-09-04",
    "2024-09-05",
    "2024-09-06",
  ];
  const employee1Tasks = [
    { name: "Bakger001", numberOfDays: "3", status: "started" },
    { name: "Vakantie", numberOfDays: "4", status: "holiday" },
    { name: "10x kolomovens", numberOfDays: "2", status: "task" },
    { name: "Bakger002", numberOfDays: "5", status: "planned" },
    { name: "Bakger003", numberOfDays: "5", status: "planned" },
    { name: "vakantie", numberOfDays: "1", status: "holiday" },
  ];
  const employee2Tasks = [
    { name: "Bakger004", numberOfDays: "2", status: "done" },
    { name: "bakger005", numberOfDays: "7", status: "started" },
    { name: "Opruimen", numberOfDays: "2", status: "task" },
    { name: "Bakger006", numberOfDays: "5", status: "planned" },
    { name: "vakantie", numberOfDays: "1", status: "holiday" },
    { name: "Bakger007", numberOfDays: "3", status: "planned" },
  ];
  const employee3Tasks = [
    { name: "Bakger004", numberOfDays: "4", status: "done" },
    { name: "bakger005", numberOfDays: "6", status: "started" },
    { name: "Opruimen", numberOfDays: "2", status: "task" },
    { name: "Bakger006", numberOfDays: "4", status: "planned" },
    { name: "vakantie", numberOfDays: "1", status: "holiday" },
    { name: "Bakger007", numberOfDays: "3", status: "planned" },
  ];
  const employees = ["employee1", "employee2", "employee3"];

  const getTasks = (employee) => {
    switch (employee) {
      case "employee1":
        return employee1Tasks;
      case "employee2":
        return employee2Tasks;
      case "employee3":
        return employee3Tasks;
    }
  };

  return (
    <div className="h-full w-full p-12">
      <div className="flex h-full w-full items-center rounded-lg bg-neutral p-5">
        <div
          className={`h-ful grid grid-cols-[repeat(${employees.length + 1},150px)] grid-flow-col grid-rows-[repeat(21,auto)] overflow-auto text-center`}
        >
          {employees.map((employee, index) => {
            const col = index + 2;
            return (
              <div
                className={`row-start-1 col-start-${index + 2} h-12 w-48 font-Effra_Bd text-2xl text-secondary`}
              >
                {employee}
              </div>
            );
          })}

          {dateCol.map((date, index) => (
            <div
              key={index}
              className={`bg-base-100 text-secondary ${(index + 1) % 5 === 0 ? "mb-2" : ""} row-start-${index + 2} mr-4 h-7 border-b-[1.5px] border-solid border-neutral px-3 font-Effra_Md`}
            >
              {date}
            </div>
          ))}

          {employees.map((employee, employeeIndex) => {
            const employeeTasks = getTasks(employee);
            console.log(employeeTasks);

            {
              return employeeTasks.map((task, taskIndex) => {
                return Array.from({ length: task.numberOfDays }).map((_, i) => {
                  const overallIndex =
                    employee1Tasks
                      .slice(0, taskIndex)
                      .reduce(
                        (acc, task) => acc + parseInt(task.numberOfDays),
                        10,
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
                      bgColor = "primary";
                      return;
                  }

                  const borderClass =
                    i === task.numberOfDays - 1
                      ? "border-black"
                      : `border-${bgColor}`;

                  return (
                    <div
                      key={overallIndex}
                      className={`${borderClass} bg-${bgColor} col-start-[${employeeIndex + 1}] mr-1 h-7 border-b-[1.5px] border-solid`}
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
