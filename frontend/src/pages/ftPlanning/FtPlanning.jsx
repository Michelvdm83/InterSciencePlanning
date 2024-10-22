import { useEffect, useState } from "react";
import TestsPerEmployee from "./components/TestsPerEmployee.jsx";
import ApiService from "../../services/ApiService.js";

export default function FtPlanning() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    ApiService.get("employees/ft-planning").then((response) => {
      setEmployees(response.data);
    });
  }, []);

  return (
    <div className="flex h-full w-screen flex-grow justify-evenly">
      <TestsPerEmployee employees={employees} />
      <div className="m-4 flex w-1/3 flex-col bg-neutral">
        nog in te plannen
      </div>
    </div>
  );
}
