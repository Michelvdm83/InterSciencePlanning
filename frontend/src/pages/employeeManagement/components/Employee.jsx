import React, { useState } from "react";

import ApiService from "../../../services/ApiService";
import DeleteButton from "../../../components/DeleteButton";

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
      <p className="col-span-1 row-span-1 text-accent">
        {employee.function === "TEAM_LEADER" ? "Teamleider" : employee.function}
      </p>
      <p className="col-span-4 row-span-1">{employee.email}</p>
      <div className="col-start-5 row-span-2 row-start-1 flex items-center justify-end">
        <DeleteButton
          className="col-start-5 row-span-2 row-start-1 flex items-center justify-end"
          question={"Weet je zeker dat je deze medewerker wilt verwijderen?"}
          onClick={handleDeleteEmployee}
          id={`delete-employee-${employee.id}`}
          error={error}
        />
      </div>
    </div>
  );
}
