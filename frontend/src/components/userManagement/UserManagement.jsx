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
    <div className="m-10 flex h-screen gap-8">
      <div className="h-full flex-1">
        <EmployeeList employees={employees} />
      </div>
      <div className="flex-1">
        <AddEmployee employees={employees} setEmployees={setEmployees} />
      </div>
    </div>
  );
}
