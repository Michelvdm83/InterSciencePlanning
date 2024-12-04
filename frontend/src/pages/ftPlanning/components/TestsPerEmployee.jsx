import { useState, useEffect } from "react";
import ApiService from "../../../services/ApiService";
import SystemModalButton from "../../../components/SystemModalButton";

export default function TestsPerEmployee({
  employees,
  openTests,
  updateOpenTests,
}) {
  const [currentEmployeeId, setCurrentEmployeeId] = useState("");
  const [tests, setTests] = useState([]);

  useEffect(() => {
    getCurrentEmployeeTasks();
  }, [currentEmployeeId, openTests]);

  function getCurrentEmployeeTasks() {
    if (currentEmployeeId.length > 1) {
      ApiService.get("/fttasks/by-employee/" + currentEmployeeId).then(
        (response) => {
          const tests = updateStatus(response.data);
          const sortedTests = sortTests(tests);
          setTests(sortedTests);
        },
      );
    }
  }

  function sortTests(updatedTests) {
    return updatedTests.sort(function (test1, test2) {
      const test1StatusNumber = getStatusNumber(test1.status);
      const test2StatusNumber = getStatusNumber(test2.status);
      return test1StatusNumber - test2StatusNumber;
    });
  }

  function getStatusNumber(updatedStatus) {
    switch (updatedStatus) {
      case "Geïnstalleerd":
        return 7;
      case "In afwachting klant":
        return 6;
      case "Testen gereed":
        return 5;
      case "SSP":
        return 4;
      case "Overgedragen":
        return 3;
      case "Problemen":
        return 2;
      case "In test":
        return 1;
      default:
        return 0;
    }
  }

  function updateStatus(tests) {
    const updatedTests = tests.slice();
    updatedTests.forEach((test) => {
      switch (test.status) {
        case "TO_BE_PLANNED":
        case "PLANNED":
        case "BUILDING":
          test.status = "SSP";
          break;
        case "TRANSFERRED":
          test.status = "Overgedragen";
          break;
        case "TESTING":
          test.status = "In test";
          break;
        case "PROBLEMS":
          test.status = "Problemen";
          break;
        case "FINISHED":
          test.status = "Testen gereed";
          break;
        case "INSTALLED":
          test.status = "Geïnstalleerd";
          break;
        case "IN_WAIT":
          test.status = "In afwachting klant";
          break;
        default:
          break;
      }
    });

    return updatedTests;
  }

  function getColorClass(testStatus) {
    switch (testStatus) {
      case "SSP":
        return "text-orange-500";
      case "Overgedragen":
        return "text-indigo-500";
      case "In test":
        return "text-green-500";
      case "Problemen":
        return "text-red-500";
      case "Testen gereed":
        return "text-green-500";
      case "In afwachting klant":
        return "text-blue-500";
      case "Geïnstalleerd":
        return "text-teal-500";
      default:
        return "";
    }
  }

  return (
    <div className="m-4 flex w-1/3 flex-col items-center gap-3 overflow-auto rounded-md bg-neutral p-5">
      {employees && (
        <select
          defaultValue={""}
          onChange={(event) => setCurrentEmployeeId(event.target.value)}
          className="select select-bordered select-accent select-sm w-1/2 cursor-pointer"
        >
          <option value="" disabled>
            Naam
          </option>
          {employees.map((employee) => {
            return (
              <option value={employee.id} key={employee.id}>
                {employee.name}
              </option>
            );
          })}
        </select>
      )}
      {tests && (
        <div className="flex w-3/4 justify-between border-b-2 border-black">
          <div className="w-1/2">Systeem</div>
          <div className="w-1/2">Status</div>
        </div>
      )}
      {tests &&
        tests.map((test) => {
          const colorClass = getColorClass(test.status);
          return (
            <div
              className="w-3/4 whitespace-nowrap rounded-md bg-white p-3"
              key={test.systemName}
            >
              <SystemModalButton
                systemName={test.systemName}
                functionOnModalClose={() => {
                  getCurrentEmployeeTasks();
                  updateOpenTests();
                }}
              >
                <div className="bg-transparant flex w-full justify-between overflow-auto">
                  <div className="w-1/2 text-left">{test.systemName}</div>
                  <div className={`w-1/2 text-left ${colorClass}`}>
                    {test.status}
                  </div>
                </div>
              </SystemModalButton>
            </div>
          );
        })}
    </div>
  );
}
