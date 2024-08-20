import ApiService from "./ApiService";

export default class ScheduleService {
  static getMonday(myDate) {
    let monday;
    const current = new Date(myDate);
    const currentDay = current.getDay();
    if (currentDay === 1) {
      monday = current;
    } else {
      const addDays =
        currentDay === 0 ? 1 : currentDay === 6 ? 2 : -(currentDay - 1);
      monday = new Date(current.setDate(current.getDate() + addDays));
    }
  }

  static getDates(startDate, numberOfDays) {
    if (numberOfDays <= 0) {
      return [];
    }
    const startAsDate = new Date(startDate);
    let datesArray =
      startAsDate.getDay() === 0 || startAsDate.getDay() === 6
        ? []
        : [new Date(startAsDate)];
    for (let i = datesArray.length; i < numberOfDays; i++) {
      const addedDate = new Date(
        startAsDate.setDate(startAsDate.getDate() + 1),
      );
      if (addedDate.getDay() === 0 || addedDate.getDay() === 6) {
        i--;
        continue;
      }
      datesArray.push(addedDate);
    }

    return datesArray;
  }

  static #getNumberOfWorkingDays(startDate, untilDate, untilIncluded) {
    if (
      (untilDate - startDate < 86400000 && !untilIncluded) ||
      (untilDate - startDate < 0 && untilIncluded)
    ) {
      return 0;
    }
    let difference = untilDate - startDate;
    let differenceInDays = difference / 86400000;
    if (untilIncluded) {
      differenceInDays++;
    }

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

  static #getStatus(
    startDateTask,
    startDateNextTask,
    estimatedDays,
    isSystem,
    nrOfDays,
    endDateTask,
  ) {
    let returnStatus = "";
    if (!isSystem) {
      returnStatus = "task";
    } else if (startDateTask === null) {
      returnStatus = "planned";
    } else if (startDateNextTask === null && endDateTask === null) {
      returnStatus = nrOfDays > estimatedDays ? "delayed" : "construction";
    } else {
      returnStatus = "finished";
    }

    return returnStatus;
  }

  static #getDaysOfHolidays(holidays) {
    let daysOfHolidays = [];
    holidays.forEach((period) => {
      const lengthInWorkingDays = this.#getNumberOfWorkingDays(
        new Date(period.startDate),
        new Date(period.endDate),
        true,
      );
      let allDaysInPeriod = this.getDates(
        period.startDate,
        lengthInWorkingDays,
      );
      allDaysInPeriod.forEach((day) => {
        daysOfHolidays.push(new Date(day));
      });
    });
    daysOfHolidays.sort(function (a, b) {
      return a - b;
    });
    for (let i = 0; i < daysOfHolidays.length; i++) {
      while (
        i + 1 < daysOfHolidays.length &&
        this.#getNumberOfWorkingDays(
          daysOfHolidays[i],
          daysOfHolidays[i + 1],
          true,
        ) <= 1
      ) {
        daysOfHolidays.splice(i + 1, 1);
      }
    }
    return daysOfHolidays;
  }

  static #getDaysWithTypes(
    currentDay,
    numberOfTaskDays,
    holidays,
    allDays,
    endDateSet,
  ) {
    const daysWithTypes = [];

    for (
      let i = currentDay;
      i < allDays.length && i < currentDay + numberOfTaskDays;
      i++
    ) {
      const dayAsHolidayIndex = holidays.findIndex(function (day) {
        return allDays[i] - day < 86400000 && allDays[i] - day > -86400000;
      });
      const type = dayAsHolidayIndex === -1 ? "task" : "holiday";
      if (!endDateSet && type === "holiday") {
        numberOfTaskDays++;
      }
      daysWithTypes.push({ dayIndex: i, type: type });
    }
    return daysWithTypes;
  }

  static #getScheduleEntries(
    daysWithTypes,
    taskName,
    task,
    nextTask,
    calculatedNrOfDays,
  ) {
    const scheduleEntries = [];

    let currentIterationNumber = 0;
    while (currentIterationNumber < daysWithTypes.length) {
      let currentNumberOfDays = 1;
      let currentType = daysWithTypes[currentIterationNumber].type;
      while (
        daysWithTypes[currentIterationNumber + 1] &&
        daysWithTypes[currentIterationNumber + 1].type === currentType
      ) {
        currentIterationNumber++;
        currentNumberOfDays++;
      }
      const thisBlock = {
        taskName: currentType === "holiday" ? "holiday" : taskName,
        numberOfDays: currentNumberOfDays,
        status:
          currentType === "holiday"
            ? "holiday"
            : taskName === ""
              ? "empty"
              : taskName === "conflict"
                ? "conflict"
                : this.#getStatus(
                    task.dateStarted,
                    nextTask?.dateStarted,
                    task.estimatedDays,
                    task.systemName,
                    calculatedNrOfDays,
                    task.dateCompleted,
                  ),
      };
      scheduleEntries.push(thisBlock);
      currentIterationNumber++;
    }
    return scheduleEntries;
  }

  static getEmployeeSchedule(startDate, numberOfDays, employeeId) {
    const allDays = this.getDates(startDate, numberOfDays);
    const today = new Date(new Date().toISOString().split("T")[0]);
    const todayIndex = allDays.findIndex(function (day) {
      return today - day < 86400000 && today - day > -86400000;
    });

    let schedule = [];

    ApiService.get(
      `employees/schedules/82bc5b5a-8b02-467b-bc93-51bd21fd09b1`,
    ).then((response) => {
      const tasks = response.data.allTasks ? response.data.allTasks : [];
      let tasksEditable = JSON.parse(JSON.stringify(tasks));

      const holidays = this.#getDaysOfHolidays(response.data.holidays);

      let currentDay = 0;
      const firstDayHolidayIndex = holidays.findIndex(function (day) {
        return allDays[0] - day < 86400000 && allDays[0] - day > -86400000;
      });

      if (firstDayHolidayIndex !== -1) {
        let firstTaskStart;
        if (tasks[0]) {
          if (tasks[0].dateStarted) {
            firstTaskStart = tasks[0].dateStarted;
          } else {
            if (todayIndex === -1 || todayIndex < currentDay) {
              firstTaskStart = allDays[currentDay];
            } else {
              firstTaskStart = allDays[todayIndex];
            }
          }
        } else {
          firstTaskStart = allDays[allDays.length - 1];
        }
        const numberOfDaysUntillStart = this.#getNumberOfWorkingDays(
          allDays[currentDay],
          firstTaskStart,
          false,
        );
        const daysBeforeStart = this.#getDaysWithTypes(
          currentDay,
          numberOfDaysUntillStart,
          holidays,
          allDays,
          tasks[0] && tasks[0].dateStarted,
        );
        const scheduleEntries = this.#getScheduleEntries(daysBeforeStart);
        for (let i = 0; i < scheduleEntries.length; i++) {
          schedule.push(scheduleEntries[i]);
        }
        currentDay += daysBeforeStart.length;
      }

      for (let index = 0; index < tasks.length; index++) {
        if (currentDay >= allDays.length) {
          break;
        }
        let task = tasksEditable[index];

        const currentName = task.systemName ? task.systemName : task.taskName;
        let nrOfDays = task.estimatedDays;
        let taskStartDate;
        let trailingTask;

        if (index === 0) {
          if (!task.dateStarted) {
            if (todayIndex === -1 || todayIndex < currentDay) {
              task.dateStarted = allDays[currentDay];
            } else {
              task.dateStarted = allDays[todayIndex];
            }
          }
          taskStartDate = new Date(task.dateStarted);
          if (taskStartDate < allDays[currentDay]) {
            nrOfDays -= this.#getNumberOfWorkingDays(
              taskStartDate,
              allDays[currentDay],
            );
            task.dateStarted = allDays[currentDay];
          } else if (taskStartDate > allDays[currentDay]) {
            const daysUntillStart = this.#getNumberOfWorkingDays(
              allDays[currentDay],
              taskStartDate,
              false,
            );
            const daysInThisPeriod = this.#getDaysWithTypes(
              currentDay,
              daysUntillStart,
              holidays,
              allDays,
              tasks[1] !== null && tasks[1].dateStarted !== null,
            );
            const scheduleEntries = this.#getScheduleEntries(
              daysInThisPeriod,
              "",
              task,
              tasksEditable[index + 1],
              daysUntillStart,
            );
            for (let i = 0; i < scheduleEntries.length; i++) {
              schedule.push(scheduleEntries[i]);
            }
            currentDay += daysInThisPeriod.length;
          }
        }

        if (task.dateCompleted) {
          taskStartDate = new Date(task.dateStarted);
          let taskCompletedDate = new Date(task.dateCompleted);

          if (tasks[index + 1]) {
            let nextTask = tasksEditable[index + 1];
            if (!nextTask.dateStarted) {
              nrOfDays = this.#getNumberOfWorkingDays(
                taskStartDate,
                taskCompletedDate,
                true,
              );
              if (currentDay + nrOfDays < allDays.length) {
                nextTask.dateStarted = allDays[currentDay + nrOfDays];
              }
            } else {
              let nextStartDate = new Date(
                tasksEditable[index + 1].dateStarted,
              );
              if (
                this.#getNumberOfWorkingDays(
                  taskCompletedDate,
                  nextStartDate,
                  false,
                ) === 0
              ) {
                const nrOfConflictingDays = this.#getNumberOfWorkingDays(
                  nextStartDate,
                  taskCompletedDate,
                  true,
                );
                nrOfDays -= nrOfConflictingDays;

                taskCompletedDate = new Date(
                  taskCompletedDate.setDate(
                    taskCompletedDate.getDate() - nrOfConflictingDays,
                  ),
                );
                task.dateCompleted = taskCompletedDate;

                nextStartDate = new Date(
                  nextStartDate.setDate(
                    nextStartDate.getDate() + nrOfConflictingDays,
                  ),
                );
                nextTask.dateStarted = nextStartDate;
                trailingTask = {
                  taskName: "conflict",
                  numberOfDays: nrOfConflictingDays,
                  status: "conflict",
                };
              } else {
                nrOfDays = this.#getNumberOfWorkingDays(
                  taskStartDate,
                  taskCompletedDate,
                  true,
                );
                const daysUntillNext =
                  this.#getNumberOfWorkingDays(
                    taskCompletedDate,
                    nextStartDate,
                    false,
                  ) - 1;
                if (daysUntillNext > 0) {
                  trailingTask = {
                    taskName: "",
                    numberOfDays: daysUntillNext,
                    status: "empty",
                  };
                }
              }
            }
          }
        } else {
          if (tasks[index + 1]) {
            let nextTask = tasksEditable[index + 1];
            if (nextTask.dateStarted) {
              const nextStartDate = new Date(tasks[index + 1].dateStarted);
              nrOfDays = this.#getNumberOfWorkingDays(
                taskStartDate,
                nextStartDate,
                false,
              );
            } else {
              if (todayIndex !== -1) {
                if (currentDay + task.estimatedDays < todayIndex) {
                  nrOfDays = todayIndex - currentDay;
                }
              }
            }
          }
        }

        if (currentDay + nrOfDays >= allDays.length) {
          nrOfDays = allDays.length - currentDay;
        }

        let endDateIsSet = true;
        if (nrOfDays + currentDay === allDays.length - 1) {
          endDateIsSet = true;
        } else if (!tasks[index + 1]) {
          endDateIsSet = false;
        } else if (!tasks[index + 1].dateStarted) {
          endDateIsSet = false;
        }
        const daysInThisPeriod = this.#getDaysWithTypes(
          currentDay,
          nrOfDays,
          holidays,
          allDays,
          endDateIsSet,
        );
        const scheduleEntries = this.#getScheduleEntries(
          daysInThisPeriod,
          currentName,
          tasks[index],
          tasks[index + 1],
          nrOfDays,
        );
        for (let i = 0; i < scheduleEntries.length; i++) {
          schedule.push(scheduleEntries[i]);
        }
        currentDay += daysInThisPeriod.length;

        if (tasks[index + 1] && !tasksEditable[index + 1].dateStarted) {
          tasksEditable[index + 1].dateStarted = allDays[currentDay];
        }

        if (currentDay < allDays.length && trailingTask) {
          if (currentDay + trailingTask.numberOfDays >= allDays.length) {
            trailingTask.numberOfDays = allDays.length - currentDay;
          }
          const daysInThisPeriod = this.#getDaysWithTypes(
            currentDay,
            trailingTask.numberOfDays,
            holidays,
            allDays,
            true,
          );
          const scheduleEntries = this.#getScheduleEntries(
            daysInThisPeriod,
            trailingTask.taskName,
          );
          for (let i = 0; i < scheduleEntries.length; i++) {
            schedule.push(scheduleEntries[i]);
          }
          currentDay += daysInThisPeriod.length;
        }
      }

      if (currentDay < allDays.length) {
        const extraDays = allDays.length - currentDay;
        const daysInThisPeriod = this.#getDaysWithTypes(
          currentDay,
          extraDays,
          holidays,
          allDays,
          true,
        );
        const scheduleEntries = this.#getScheduleEntries(daysInThisPeriod, "");
        for (let i = 0; i < scheduleEntries.length; i++) {
          schedule.push(scheduleEntries[i]);
        }
      }
    });
  }
}
