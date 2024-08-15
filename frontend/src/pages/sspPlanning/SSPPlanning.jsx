/* Safelist: border-holiday border-started border-planned border-task border-done bg-done bg-task bg-planned bg-holiday bg-started bg-accent */

export default function SSPPlanning() {
  const dateCol = [
    "12-08-2024",
    "13-08-2024",
    "14-08-2024",
    "15-08-2024",
    "16-08-2024",
    "19-08-2024",
    "20-08-2024",
    "21-08-2024",
    "22-08-2024",
    "23-08-2024",
    "26-08-2024",
    "27-08-2024",
    "28-08-2024",
    "29-08-2024",
    "30-08-2024",
    "02-09-2024",
    "03-09-2024",
    "04-09-2024",
    "05-09-2024",
    "06-09-2024",
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
  const employee4Tasks = [
    { name: "Bakger008", numberOfDays: "3", status: "done" },
    { name: "kolomovens", numberOfDays: "2", status: "task" },
    { name: "vrij", numberOfDays: "5", status: "holiday" },
    { name: "Bakger009", numberOfDays: "3", status: "planned" },
    { name: "Bakger010", numberOfDays: "6", status: "planned" },
    { name: "opruimen", numberOfDays: "1", status: "task" },
  ];
  const employee5Tasks = [
    { name: "Bakger011", numberOfDays: "2", status: "done" },
    { name: "bakger111", numberOfDays: "3", status: "done" },
    { name: "Bakger012", numberOfDays: "5", status: "started" },
    { name: "bakger222", numberOfDays: "4", status: "planned" },
    { name: "Bakger013", numberOfDays: "3", status: "planned" },
    { name: "vrij", numberOfDays: "3", status: "holiday" },
  ];
  const employee6Tasks = [
    { name: "Bakger014", numberOfDays: "4", status: "started" },
    { name: "vrij", numberOfDays: "1", status: "holiday" },
    { name: "Bakger015", numberOfDays: "6", status: "planned" },
    { name: "opruimen", numberOfDays: "3", status: "task" },
    { name: "Bakger016", numberOfDays: "5", status: "planned" },
    { name: "bakger834", numberOfDays: "1", status: "planned" },
  ];
  const employee7Tasks = [
    { name: "Bakger004", numberOfDays: "2", status: "done" },
    { name: "bakger005", numberOfDays: "7", status: "started" },
    { name: "Opruimen", numberOfDays: "2", status: "task" },
    { name: "Bakger006", numberOfDays: "5", status: "planned" },
    { name: "vakantie", numberOfDays: "1", status: "holiday" },
    { name: "Bakger007", numberOfDays: "3", status: "planned" },
  ];
  const employees = [
    "employee1",
    "employee2",
    "employee3",
    "employee4",
    "employee5",
    "employee6",
    "employee7",
  ];

  const getTasks = (employee) => {
    //this function will get the correct task list from the service when that is done
    switch (employee) {
      case "employee1":
        return employee1Tasks;
      case "employee2":
        return employee2Tasks;
      case "employee3":
        return employee3Tasks;
      case "employee4":
        return employee4Tasks;
      case "employee5":
        return employee5Tasks;
      case "employee6":
        return employee6Tasks;
      case "employee7":
        return employee7Tasks;
    }
  };

  return (
    <div className="flex h-full w-full justify-center overflow-auto p-8">
      <div className="flex h-max max-w-full flex-col overflow-hidden rounded-lg border border-secondary p-4">
        <div
          className={`grid p-4 grid-cols-[repeat(${employees.length + 1},150px)] max-w-full grid-flow-col grid-rows-[repeat(21,auto)] overflow-scroll bg-base-100 text-center font-Effra_Md`}
        >
          {employees.map((employee, index) => {
            const col = index + 2;
            return (
              <div
                key={index}
                className={`row-start-1 col-start-${index + 2} h-10 w-48 font-Effra_Bd text-2xl text-secondary`}
              >
                {employee}
              </div>
            );
          })}

          {dateCol.map((date, index) => (
            <div
              key={index}
              className={`bg-base-100 text-secondary ${(index + 1) % 5 === 0 ? "mb-2" : ""} row-start-${index + 2} h-7 w-28 border-b-[1.5px] border-solid border-neutral px-3 font-Effra_Md`}
            >
              {date}
            </div>
          ))}

          {employees.map((employee, employeeIndex) => {
            const employeeTasks = getTasks(employee);
            {
              return employeeTasks.map((task, taskIndex) => {
                return Array.from({ length: task.numberOfDays }).map((_, i) => {
                  const overallIndex =
                    employeeTasks
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
                    i === task.numberOfDays - 1 && (overallIndex + 1) % 5 != 0
                      ? "border-black"
                      : `border-${bgColor}`;

                  return (
                    <div
                      key={overallIndex}
                      className={`${borderClass} bg-${bgColor} col-start-[${employeeIndex + 1}] mr-[2px] h-7 border-b-[1.5px] border-solid`}
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
