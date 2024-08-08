import React from "react";
import Employee from "./Employee";

export default function EmployeeList({ employees }) {
  return (
    <div className="flex h-full w-full flex-col gap-4 rounded-md bg-neutral p-8">
      {employees
        .slice()
        .reverse()
        .map((employee, index) => (
          <Employee employee={employee} key={index} />
        ))}
    </div>
  );
}
