import React, { useState, useEffect } from "react";
import Employee from "./Employee";
import ApiService from "../../services/ApiService";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    ApiService.get("employees").then((response) => {
      setEmployees(response.data);
    });
  }, []);

  return (
    <div className="m-8 flex w-1/2 flex-col gap-4 bg-neutral p-8">
      {employees.map((employee, index) => (
        <Employee employee={employee} key={index} />
      ))}
    </div>
  );
}
