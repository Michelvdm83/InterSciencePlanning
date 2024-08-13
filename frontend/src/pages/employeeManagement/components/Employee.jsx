import React from "react";

export default function Employee({ employee }) {
  return (
    <div className="grid grid-cols-5 grid-rows-2 rounded-md bg-base-100 p-3">
      <p className="col-span-3 row-span-1 font-Effra_Bd text-secondary">
        {employee.name}
      </p>
      <p className="col-span-1 row-span-1 text-accent">
        {employee.function === "TEAM_LEADER" ? "Teamleider" : employee.function}
      </p>
      <p className="col-span-4 row-span-1">{employee.email}</p>
      <p className="col-start-5 row-span-2 row-start-1 flex items-center justify-end">
        X
      </p>
    </div>
  );
}
