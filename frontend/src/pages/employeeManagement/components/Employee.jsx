import React, { useState } from "react";

import ApiService from "../../../services/ApiService";
import DeleteButton from "../../../components/DeleteButton";
import EditEmployee from "./EditEmployee";

export default function Employee({ employee, employees, setEmployees }) {
  const [error, setError] = useState("");

  function handleDeleteEmployee(e) {
    e.preventDefault();

    ApiService.delete(`employees/${employee.id}`)
      .then(() => {
        const updatedEmployees = employees.filter((e) => e.id !== employee.id);
        setEmployees(updatedEmployees);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setError("Je kunt jezelf niet verwijderen");
        } else {
          setError("Er is een fout opgetreden bij het verwijderen");
        }
      });
  }

  return (
    <div className="grid grid-cols-5 grid-rows-2 rounded-md bg-base-100 p-3">
      <p className="col-span-3 row-span-1 font-Effra_Bd text-secondary">
        {employee.name}
      </p>
      <div className="col-span-1 row-span-2 flex items-center justify-start text-nowrap text-accent">
        <p>
          {employee.function === "SSP_TEAM_LEADER"
            ? "SSP Teamleider"
            : employee.function === "FT_TEAM_LEADER"
              ? "FT Teamleider"
              : employee.function === "WAREHOUSE"
                ? "Warehouse"
                : employee.function}
        </p>
      </div>
      <p className="col-span-3 row-span-1">{employee.email}</p>
      <div className="col-start-5 row-span-2 row-start-1 flex items-center justify-end gap-2">
        <EditEmployee employee={employee} setEmployees={setEmployees} />
        <DeleteButton
          question={`Weet je zeker dat je ${employee.name} wilt verwijderen?`}
          onClick={handleDeleteEmployee}
          id={`delete-employee-${employee.id}`}
          error={error}
        />
      </div>
    </div>
  );
}
