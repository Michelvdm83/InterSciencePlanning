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
    { name: "Bakger001", numberOfDays: "3" },
    { name: "Vakantie", numberOfDays: "4" },
    { name: "10x kolomovens", numberOfDays: "2" },
    { name: "Bakger002", numberOfDays: "5" },
    { name: "Bakger003", numberOfDays: "5" },
    { name: "vakantie", numberOfDays: "1" },
  ];
  const totalEmployees = 4;

  return (
    <div className="flex">
      <div className="grid-rows-[repeat(20, 20px)] grid h-[400px] auto-cols-[100px]">
        {dateCol.map((item, index) => (
          <div
            key={index}
            className={`bg-primary ${(index + 1) % 5 === 0 ? "mb-4" : ""} border-2 border-solid border-black`}
          >
            {item}
          </div>
        ))}
      </div>

      <div className="grid-rows-[repeat(20, 20px)] grid h-[400px] auto-cols-[200px]">
        {employee1Tasks.map((item, taskIndex) =>
          Array.from({ length: item.numberOfDays }).map((_, i) => {
            const overallIndex =
              employee1Tasks
                .slice(0, taskIndex)
                .reduce((acc, task) => acc + parseInt(task.numberOfDays), 10) +
              i;
            return (
              <div
                key={overallIndex}
                className={`border-2 ${(overallIndex + 1) % 5 === 0 ? "mb-4" : ""} border-solid border-black bg-primary`}
              >
                {item.name}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
