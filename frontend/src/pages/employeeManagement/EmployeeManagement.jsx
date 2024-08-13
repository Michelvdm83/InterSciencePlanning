import React, { useState, useEffect } from "react";
import AddEmployee from "./components/AddEmployee.jsx";
import EmployeeList from "./components/EmployeeList.jsx";
import { useGetEmployees } from "../../hooks/useGetEmployees.js";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useGetEmployees();

  return (
    <div className="flex h-full w-screen items-start gap-8 p-8">
      <EmployeeList employees={employees} />
      <AddEmployee employees={employees} setEmployees={setEmployees} />
    </div>
  );
}
