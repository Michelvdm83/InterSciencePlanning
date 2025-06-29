import {
  addBusinessDays,
  differenceInBusinessDays,
  eachDayOfInterval,
  formatDate,
  isAfter,
  isBefore,
  isMonday,
  isSameDay,
  isToday,
  isWeekend,
  nextMonday,
  previousMonday,
  startOfWeek,
  subDays,
} from "date-fns";
import ApiService from "./ApiService";

export default class ScheduleService {
  // get the date of the monday of the week
  static getMonday(myDate) {
    return startOfWeek(new Date(myDate), { weekStartsOn: 1 });
  }

  //get a list of dates of workdays starting at startDate. Length of list is equal to numberOfDays
  static getDates(startDate, numberOfDays) {
    if (numberOfDays <= 0) {
      return [];
    }

    const firstDay = isWeekend(new Date(startDate))
      ? nextMonday(new Date(startDate))
      : new Date(startDate);
    const lastDay = addBusinessDays(firstDay, numberOfDays - 1);
    const allDay = eachDayOfInterval({ start: firstDay, end: lastDay });
    const returnArray = [];
    allDay.forEach((day) => {
      if (!isWeekend(day)) {
        returnArray.push(day);
      }
    });
    return returnArray;
  }

  //get the number of working days between startDate (included) and untilDate (excluded unless untilIncluded = true)
  static #getNumberOfWorkingDays(startDate, untilDate, untilIncluded) {
    const workingDays = differenceInBusinessDays(
      new Date(untilDate),
      new Date(startDate),
    );
    if (untilIncluded && !isWeekend(new Date(untilDate))) {
      return workingDays + 1;
    } else {
      return workingDays;
    }
  }

  //get a list of dates, ordered old-new, of all holidays
  static #getDaysOfHolidays(holidays) {
    let daysOfHolidays = [];
    holidays.forEach((period) => {
      const daysInPeriod = eachDayOfInterval({
        start: period.startDate,
        end: period.endDate,
      });
      daysInPeriod.forEach((day) => daysOfHolidays.push(day));
    });
    return daysOfHolidays;
  }

  //converts the allDaysWithTasks array to the schedule array used in SSPPlanning.jsx
  static #getSchedule(allDaysWithTasks) {
    const scheduling = [];

    let currentTaskName;
    let currentTaskDays = 0;
    let currentPoNumber;
    let currentOrderPickedByWarehouse;
    let currentTaskStatus;
    let currentTaskId;
    let currentIsSystem;
    let loopIndex = 0;
    do {
      if (
        loopIndex === allDaysWithTasks.length ||
        allDaysWithTasks[loopIndex].taskName !== currentTaskName
      ) {
        if (currentTaskDays > 0) {
          scheduling.push({
            taskName: currentTaskName,
            poNumber: currentPoNumber,
            orderPickedByWarehouse: currentOrderPickedByWarehouse,
            numberOfDays: currentTaskDays,
            status: currentTaskStatus,
            taskId: currentTaskId,
            isSystem: currentIsSystem,
          });
        }
        if (loopIndex < allDaysWithTasks.length) {
          currentTaskName = allDaysWithTasks[loopIndex].taskName;
          currentPoNumber = allDaysWithTasks[loopIndex].poNumber;
          currentOrderPickedByWarehouse =
            allDaysWithTasks[loopIndex].orderPickedByWarehouse;
          currentTaskDays = 0;
          currentTaskStatus = allDaysWithTasks[loopIndex].status;
          currentTaskId = allDaysWithTasks[loopIndex].taskId;
          currentIsSystem = allDaysWithTasks[loopIndex].isSystem;
        }
      }
      loopIndex++;
      currentTaskDays++;
    } while (loopIndex <= allDaysWithTasks.length);

    return scheduling;
  }

  //returns the schedule of the employee with employeeId in a period of numberOfDays, starting at startDate
  static async getEmployeeSchedule(startDate, numberOfDays, employeeId) {
    const allDays = this.getDates(startDate, numberOfDays);
    let scheduling = [];

    await ApiService.get(`employees/schedules/` + employeeId, {
      startDate: allDays.at(0),
      endDate: allDays.at(-1),
    })
      .then((response) => {
        const tasks = response.data.allTasks ? response.data.allTasks : [];
        const holidays = response.data.holidays
          ? this.#getDaysOfHolidays(response.data.holidays)
          : [];

        //allDaysWithTasks array is used to keep track of when tasks are scheduled and find possible conflicts
        let allDaysWithTasks = [];
        allDays.forEach((day) => {
          if (holidays.findIndex((hday) => isSameDay(hday, day)) !== -1) {
            allDaysWithTasks.push({
              date: day,
              taskName: "Vakantie",
              status: "holiday",
              taskId: null,
              isSystem: false,
            });
          } else {
            allDaysWithTasks.push({
              date: day,
              taskName: "",
              status: "empty",
              taskId: null,
              isSystem: false,
            });
          }
        });
        //the dayIndex variable is used to keep track of at what day the scheduling is at that moment
        let dayIndex = allDaysWithTasks.findIndex((d) => d.status === "empty");

        //this loops through the tasks array 1 by 1, updating the allDaysWithTasks array at the end each time
        for (
          let index = 0;
          index < tasks.length &&
          dayIndex < allDaysWithTasks.length &&
          dayIndex !== -1;
          index++
        ) {
          const task = tasks[index];
          let currentStatus = task.systemName ? task.status : "task";

          //if the first task doesn't have a startdate, it is set to start 'today'
          if (index === 0 && !task.dateStarted) {
            let today = new Date();
            if (isWeekend(today)) {
              task.dateStarted = nextMonday(today);
            } else {
              task.dateStarted = today;
            }
          }

          let startDate;
          if (task.dateStarted === null) {
            startDate = allDaysWithTasks[dayIndex].date;
            task.dateStarted = startDate;
          } else {
            startDate = new Date(task.dateStarted);
          }

          //checks for situations where adjustments are necessary
          if (isBefore(startDate, allDaysWithTasks[0].date)) {
            startDate = allDaysWithTasks[dayIndex].date;
          } else if (isBefore(startDate, allDaysWithTasks[dayIndex].date)) {
            currentStatus = "conflict";
          } else if (isAfter(startDate, allDaysWithTasks[dayIndex].date)) {
            dayIndex = allDaysWithTasks.findIndex((d) =>
              isSameDay(d.date, startDate),
            );
            if (dayIndex === -1) {
              dayIndex = allDaysWithTasks.length;
            }
          }

          let daysTillEnd;
          let endSet;
          //if the task has an enddate, the daysTillEnd are set to that period, else it is either set to the estimatedDays or
          //if a system is still being build make sure that they are working on it 'today'
          if (task.dateCompleted !== null) {
            if (dayIndex < allDaysWithTasks.length) {
              const completedDate = new Date(task.dateCompleted);
              daysTillEnd = this.#getNumberOfWorkingDays(
                allDaysWithTasks[dayIndex].date,
                completedDate,
                true,
              );
            }
            endSet = true;
          } else {
            //if the dateCompleted is null and the status is BUILDING, it is a system that is currently being build
            if (task.status === "BUILDING") {
              let daysBuilding = 1;
              if (isBefore(task.dateStarted, new Date())) {
                daysBuilding = this.#getNumberOfWorkingDays(
                  task.dateStarted,
                  new Date(),
                  true,
                );
              }

              const thisDays = this.getDates(task.dateStarted, daysBuilding);
              thisDays.forEach((d) => {
                if (holidays.findIndex((hday) => isSameDay(hday, d)) !== -1) {
                  daysBuilding--;
                }
              });

              if (currentStatus !== "conflict") {
                if (daysBuilding <= task.estimatedDays) {
                  currentStatus = "started";
                } else {
                  currentStatus = "delayed";
                  task.estimatedDays = daysBuilding;
                }
              }
            }

            daysTillEnd = task.estimatedDays;
            endSet = false;
            if (task.dateStarted && isBefore(task.dateStarted, startDate)) {
              const daysInBetween = eachDayOfInterval({
                start: task.dateStarted,
                end: subDays(startDate, 1),
              });

              daysInBetween.forEach((d) => {
                if (
                  holidays.findIndex((hday) => isSameDay(hday, d)) === -1 &&
                  !isWeekend(d)
                ) {
                  daysTillEnd--;
                }
              });
            }
          }

          //if daysTillEnd > 0, add it to allDaysWithTasks so it will be on the schedule
          if (daysTillEnd > 0) {
            let scheduleDays = 0;
            while (daysTillEnd > 0 && dayIndex < allDaysWithTasks.length) {
              const currentDay = allDaysWithTasks[dayIndex];

              if (endSet === true || currentDay.status === "empty") {
                daysTillEnd--;
              }

              if (currentDay.status === "empty") {
                currentDay.status = currentStatus;
                currentDay.taskName = task.systemName
                  ? task.systemName
                  : task.taskName;
                currentDay.poNumber = task.poNumber;
                currentDay.orderPickedByWarehouse = task.orderPickedByWarehouse;
                currentDay.taskId = task.systemName ? null : task.taskId;
                currentDay.isSystem = task.systemName !== null;

                scheduleDays++;
              } else if (
                currentDay.status !== "holiday" &&
                currentStatus !== "conflict"
              ) {
                currentStatus = "conflict";
                let tempIndex = dayIndex - 1;

                while (
                  allDaysWithTasks[tempIndex].taskName === task.taskName &&
                  tempIndex >= 0
                ) {
                  allDaysWithTasks[tempIndex].status = "conflict";
                  tempIndex--;
                }
              }

              dayIndex++;
            }

            //if scheduleDays = 0, then it isn't on the schedule. if it is a task with an enddate,
            //then this can put it on a later date, so it isn't lost on the schedule
            if (scheduleDays === 0) {
              const nextOpenIndex = allDaysWithTasks.findIndex(
                (d, index) => index >= dayIndex && d.status === "empty",
              );
              if (nextOpenIndex !== -1) {
                let nextOpenDay = allDaysWithTasks[nextOpenIndex];
                nextOpenDay.status = "conflict";
                nextOpenDay.taskName = task.systemName
                  ? task.systemName
                  : task.taskName;
                nextOpenDay.poNumber = task.poNumber;
                nextOpenDay.orderPickedByWarehouse =
                  task.orderPickedByWarehouse;
                nextOpenDay.taskId = task.systemName ? null : task.taskId;
                nextOpenDay.isSystem = task.systemName !== null;
                dayIndex = nextOpenIndex + 1;
              } else {
                dayIndex = -1;
              }
            }
          } else {
            //if there is another task in the tasks array and it doesn't have a startdate while calculating before the first date of allDaysWithTasks
            //, set it to start directly after this task
            if (tasks[index + 1] && !tasks[index + 1].dateStarted) {
              const nextStart = task.dateCompleted
                ? addBusinessDays(task.dateCompleted, 1)
                : addBusinessDays(task.dateStarted, task.estimatedDays);

              tasks[index + 1].dateStarted = nextStart;
            }
          }
        }

        scheduling = this.#getSchedule(allDaysWithTasks);
      })
      .catch(() => {
        return [
          {
            taskName: "fout bij ophalen",
            numberOfDays: numberOfDays,
            status: "error",
          },
        ];
      });
    return scheduling;
  }
}
