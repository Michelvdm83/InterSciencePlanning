import {
  addBusinessDays,
  differenceInBusinessDays,
  eachDayOfInterval,
  formatDate,
  isAfter,
  isBefore,
  isMonday,
  isSameDay,
  isWeekend,
  nextMonday,
  previousMonday,
} from "date-fns";
import ApiService from "./ApiService";

export default class ScheduleServiceNew {
  /* static #formatMyDate(date) {
  //   return formatDate(new Date(date), "dd-MM-yyyy");
  // }
*/

  // get the date of the monday of the week
  static getMonday(myDate) {
    let monday;
    if (isMonday(myDate)) {
      monday = new Date(myDate);
    } else if (isWeekend(new Date(myDate))) {
      monday = nextMonday(new Date(myDate));
    } else {
      monday = previousMonday(new Date(myDate));
    }
    // onderstaand is hetzelfde, maar in 1 regel. wat is duidelijker?
    //const monday = isMonday(myDate)? new Date(myDate) : isWeekend(new Date(myDate))? nextMonday(new Date(myDate)) : previousMonday(new Date(myDate));
    //of als we altijd de maandag van de huidige week doen:
    // const monday = startOfWeek(new Date(myDate), { weekStartsOn: 1 });
    return monday;
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

  //get a list of dates, ordered old-new, of all holidays. filters duplicate dates
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

  //returns the schedule of the employee with employeeId in a period of numberOfDays, starting at startDate
  static async getEmployeeSchedule(startDate, numberOfDays, employeeId) {
    const allDays = this.getDates(startDate, numberOfDays);
    const scheduling = [];

    //hoe dit goed op te delen?
    await ApiService.get(`employees/schedules/` + employeeId)
      .then((response) => {
        const tasks = response.data.allTasks ? response.data.allTasks : [];
        const holidays = response.data.holidays
          ? this.#getDaysOfHolidays(response.data.holidays)
          : [];

        let allDaysWithTasks = [];
        allDays.forEach((day) => {
          if (holidays.findIndex((hday) => isSameDay(hday, day)) !== -1) {
            allDaysWithTasks.push({
              date: day,
              taskName: "Vakantie",
              status: "holiday",
            });
          } else {
            allDaysWithTasks.push({ date: day, taskName: "", status: "empty" });
            //hier komt nog id bij, zodat een taak ook klikbaar gemaakt kan worden in de planning
          }
        });
        let dayIndex = allDaysWithTasks.findIndex((d) => d.status === "empty");

        for (
          let index = 0;
          index < tasks.length &&
          dayIndex < allDaysWithTasks.length &&
          dayIndex !== -1;
          index++
        ) {
          const task = tasks[index];
          let currentStatus = task.systemName ? task.status : "task";

          let startDate;
          if (!task.dateStarted) {
            startDate = allDaysWithTasks[dayIndex].date;
          } else {
            startDate = new Date(task.dateStarted);
          }

          if (isBefore(startDate, allDaysWithTasks[0].date)) {
            startDate = allDaysWithTasks[dayIndex].date;
          } else if (isBefore(startDate, allDaysWithTasks[dayIndex].date)) {
            currentStatus = "conflict";
          } else if (
            //hiervoor check voor isAfter allDaysWithTasks laatste date?
            isAfter(startDate, allDaysWithTasks[dayIndex].date)
          ) {
            dayIndex = allDaysWithTasks.findIndex((d) =>
              isSameDay(d.date, startDate),
            );
          }

          let daysTillEnd;
          let endSet;
          if (task.dateCompleted) {
            const completedDate = new Date(task.dateCompleted);
            daysTillEnd = this.#getNumberOfWorkingDays(
              allDaysWithTasks[dayIndex].date,
              completedDate,
              true,
            );
            endSet = true;
          } else {
            daysTillEnd = task.estimatedDays;
            endSet = false;
            //hier berekening voor delayed
            //voorwaarde: task.dateStarted && !task.dateCompleted && task.systemName?
            //ook checken voor volgende taak geen startdatum?
          }

          let scheduleDays = 0;
          do {
            const currentDay = allDaysWithTasks[dayIndex];

            if (endSet === true || currentDay.status === "empty") {
              daysTillEnd--;
            }

            if (currentDay.status === "empty") {
              currentDay.status = currentStatus;
              currentDay.taskName = task.systemName
                ? task.systemName
                : task.taskName;

              scheduleDays++;
            } else if (
              currentDay.status !== "holiday" &&
              currentStatus !== "conflict"
            ) {
              currentStatus = "conflict";
              let tempIndex = dayIndex - 1;
              //extra veiligheid of overbodig?
              while (
                allDaysWithTasks[tempIndex].taskName === task.taskName &&
                tempIndex >= 0
              ) {
                allDaysWithTasks[tempIndex].status = "conflict";
                tempIndex--;
              }
            }

            dayIndex++;
          } while (daysTillEnd > 0 && dayIndex < allDaysWithTasks.length);

          //als de taak op geen enkele dag in de planning staat, probeer hem dan op iig 1 dag neer te zetten
          if (scheduleDays === 0) {
            const nextOpenIndex = allDaysWithTasks.findIndex(
              (d, index) => index >= dayIndex && d.status === "empty",
            );
            if (nextOpenIndex !== -1) {
              const nextOpenDay = allDaysWithTasks[nextOpenIndex];
              nextOpenDay.status = "conflict";
              nextOpenDay.taskName = currentDay.taskName = task.systemName
                ? task.systemName
                : task.taskName;
              dayIndex = nextOpenIndex + 1;
            } //hier nog een regel voor wanneer er geen "empty" dag is?
          }
        }

        //vul de schedule van de return
        let currentTaskName;
        let currentTaskDays = 0;
        let currentTaskStatus;
        let loopIndex = 0;
        do {
          if (
            loopIndex === allDaysWithTasks.length ||
            allDaysWithTasks[loopIndex].taskName !== currentTaskName
          ) {
            if (currentTaskDays > 0) {
              scheduling.push({
                taskName: currentTaskName,
                numberOfDays: currentTaskDays,
                status: currentTaskStatus,
              });
            }
            if (loopIndex < allDaysWithTasks.length) {
              currentTaskName = allDaysWithTasks[loopIndex].taskName;
              currentTaskDays = 0;
              //nu nog zo voor testen, status straks eerder goed gezet
              currentTaskStatus =
                allDaysWithTasks[loopIndex].status === "BUILDING"
                  ? "started"
                  : allDaysWithTasks[loopIndex].status;
            }
          }
          loopIndex++;
          currentTaskDays++;
        } while (loopIndex <= allDaysWithTasks.length);
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
