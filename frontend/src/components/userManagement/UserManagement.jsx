import React, { useState, useEffect } from "react";
import AddEmployee from "../addEmployee/AddEmployee";
import EmployeeList from "../employees/EmployeeList";
import ApiService from "../../services/ApiService";

export default function UserManagement() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    ApiService.get("employees").then((response) => {
      setEmployees(response.data);
    });
  }, []);

  return (
    <div className="flex h-full w-screen items-start gap-8 p-8">
      <EmployeeList employees={employees} />{" "}
      <AddEmployee employees={employees} setEmployees={setEmployees} />
    </div>
  );
}
