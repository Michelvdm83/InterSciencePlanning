import React from "react";
import Employee from "./Employee.jsx";

export default function EmployeeList({ employees, setEmployees }) {
  return (
    <div className="flex h-full w-3/5 flex-col gap-4 overflow-auto rounded-md bg-neutral p-8 font-Effra_Md">
      {employees
        .slice()
        .reverse()
        .map((employee, index) => (
          <Employee
            employee={employee}
            employees={employees}
            setEmployees={setEmployees}
            key={index}
          />
        ))}
    </div>
  );
}
