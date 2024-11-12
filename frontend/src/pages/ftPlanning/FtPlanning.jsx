import { useEffect, useState } from "react";
import TestsPerEmployee from "./components/TestsPerEmployee.jsx";
import UnplannedTests from "./components/UnplannedTests.jsx";
import ApiService from "../../services/ApiService.js";

export default function FtPlanning() {
  const [employees, setEmployees] = useState([]);
  const [openTests, setOpenTests] = useState([]);

  useEffect(() => {
    updateOpenTests();

    ApiService.get("employees/ft-planning").then((response) => {
      setEmployees(response.data);
    });
  }, []);

  function updateOpenTests() {
    ApiService.get("fttasks/unassigned").then((response) => {
      setOpenTests((old) => response.data);
    });
  }

  return (
    <div className="flex h-full w-screen flex-grow justify-center gap-3">
      <TestsPerEmployee
        employees={employees}
        openTests={openTests}
        updateOpenTests={updateOpenTests}
      />
      <UnplannedTests
        employees={employees}
        openTests={openTests}
        updateOpenTests={updateOpenTests}
      />
    </div>
  );
}
