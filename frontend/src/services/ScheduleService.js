import ApiService from "./ApiService";

export default class ScheduleService {
  static getDates(startDate, numberOfDays) {
    let datesArray = [startDate];
    const startAsDate = new Date(startDate);
    for (let i = 1; i < numberOfDays; i++) {
      const addedDate = new Date(
        startAsDate.setDate(startAsDate.getDate() + 1),
      );
      if (addedDate.getDay() === 0 || addedDate.getDay() === 6) {
        i--;
        continue;
      }
      let expectedDate = addedDate.toISOString().split("T")[0];
      datesArray.push(expectedDate);
    }

    return datesArray;
  }

  static getEmployeeSchedule(startDate, numberOfDays, employeeId) {
    const allDays = this.getDates(startDate, numberOfDays);

    let schedule = [];

    ApiService.get(
      `employees/schedules/82bc5b5a-8b02-467b-bc93-51bd21fd09b1`,
    ).then((response) => {
      console.log(response.data);
    });

    let test = [];
    test.push({ taskName: "test systeem", numberOfDays: 5 });
    test.push({ taskName: "test systeem", numberOfDays: 5 });
    test.push({ taskName: "test systeem", numberOfDays: 5 });
    // console.log(test);
  }
}
/*
Service functions:
getDates(startDate, numberOfDays): geeft array van Dates terug, weekenden niet meegerekend
getEmployeeSchedule(startDate, numberOfDays, employeeId): geeft lijst terug van: [taskName, numberOfDays]

taskName is systeemnaam indien het om een systeem gaat, naam van Task indien task en "vrij" indien holiday*/
