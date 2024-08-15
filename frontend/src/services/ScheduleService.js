import ApiService from "./ApiService";

export default class ScheduleService {
  static getDates(startDate, numberOfDays) {
    if (numberOfDays <= 0) {
      return [];
    }
    const startAsDate = new Date(startDate);
    let datesArray = [new Date(startAsDate)];
    for (let i = 1; i < numberOfDays; i++) {
      const addedDate = new Date(
        startAsDate.setDate(startAsDate.getDate() + 1),
      );
      console.log(addedDate);
      if (addedDate.getDay() === 0 || addedDate.getDay() === 6) {
        i--;
        continue;
      }
      //   let expectedDate = addedDate.toISOString().split("T")[0];
      datesArray.push(addedDate);
    }

    return datesArray;
  }

  static #getNumberOfWorkingDays(startDate, untilDate) {
    let difference = untilDate - startDate;
    let differenceInDays = difference / 86400000;

    const currentDate = new Date(startDate);
    let nrOfWorkingDays = 0;
    if (!(currentDate.getDay() === 0 || currentDate.getDay() === 6)) {
      nrOfWorkingDays++;
    }
    for (let i = 1; i < differenceInDays; i++) {
      const addedDate = new Date(
        currentDate.setDate(currentDate.getDate() + 1),
      );
      if (addedDate.getDay() === 0 || addedDate.getDay() === 6) {
        continue;
      }
      nrOfWorkingDays++;
    }
    return nrOfWorkingDays;
  }

  static getEmployeeSchedule(startDate, numberOfDays, employeeId) {
    const allDays = this.getDates(startDate, numberOfDays);

    let schedule = [];

    ApiService.get(
      `employees/schedules/82bc5b5a-8b02-467b-bc93-51bd21fd09b1`,
    ).then((response) => {
      let tasks = response.data.allTasks;

      let currentDay = 0;
      for (let index = 0; index < tasks.length; index++) {
        if (currentDay >= allDays.length) {
          break;
        }
        let task = tasks[index];

        const currentName = task.systemName ? task.systemName : task.taskName;
        let nrOfDays = task.estimatedDays;
        if (
          task.dateStarted !== null &&
          task.dateStarted !== undefined &&
          currentDay === 0
        ) {
          const taskStartDate = new Date(task.dateStarted);

          if (allDays[currentDay] > taskStartDate) {
            nrOfDays -= this.#getNumberOfWorkingDays(
              taskStartDate,
              allDays[currentDay],
            );
          }
        }

        if (currentDay + nrOfDays >= allDays.length) {
          nrOfDays = allDays.length - currentDay;
        }
        currentDay += nrOfDays;

        schedule.push({
          taskName: currentName,
          numberOfDays: nrOfDays,
        });
      }
      console.log(schedule);
    });
  }
}
/*
Service functions:
getDates(startDate, numberOfDays): geeft array van Dates terug, weekenden niet meegerekend
getEmployeeSchedule(startDate, numberOfDays, employeeId): geeft lijst terug van: [taskName, numberOfDays]

taskName is systeemnaam indien het om een systeem gaat, naam van Task indien task en "vrij" indien holiday*/
