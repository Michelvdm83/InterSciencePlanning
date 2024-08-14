import React, { useState, useEffect } from "react";
import AddEmployee from "./components/AddEmployee.jsx";
import EmployeeList from "./components/EmployeeList.jsx";
import ApiService from "../../services/ApiService.js";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    ApiService.get("employees").then((response) => {
      setEmployees(response.data);
    });
  }, []);

  return (
    <div className="flex h-full w-screen items-start gap-8 p-8">
      <EmployeeList employees={employees} setEmployees={setEmployees} />{" "}
      <AddEmployee employees={employees} setEmployees={setEmployees} />
    </div>
  );
}
