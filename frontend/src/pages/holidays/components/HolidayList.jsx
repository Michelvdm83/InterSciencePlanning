import React, { useState } from "react";
import { useGetEmployees } from "../../../hooks/useGetEmployees";
import Holiday from "./Holiday";

export default function HolidayList({ holidays, setHolidays }) {
  const [employees] = useGetEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState({
    name: "",
    id: "",
  });

  function handleSelectEmployee(e) {
    const selectedId = e.target.value;
    const employee = employees.find((emp) => emp.id === selectedId);
    setSelectedEmployee(employee || { name: "", id: "" });
  }

  const sortedHolidays = (
    selectedEmployee.id != ""
      ? holidays.filter((holiday) => holiday.employeeId === selectedEmployee.id)
      : holidays
  ).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <div className="flex h-full w-3/5 flex-col gap-2 overflow-auto rounded-md bg-neutral p-8 font-Effra_Md">
      <select
        value={selectedEmployee.id}
        onChange={handleSelectEmployee}
        className="select select-bordered w-2/5"
      >
        <option value="">Alle medewerkers</option>
        {employees.map((employee) => {
          return (
            <option value={employee.id} key={employee.id}>
              {employee.name}
            </option>
          );
        })}
      </select>
      <h2 className="py-2 font-Effra_Bd text-xl text-secondary">
        {selectedEmployee.name
          ? `${selectedEmployee.name.split(" ")[0]}'s vakanties`
          : ""}
      </h2>

      {sortedHolidays.map((holiday) => (
        <Holiday
          key={holiday.id}
          holiday={holiday}
          holidays={holidays}
          setHolidays={setHolidays}
          selectedEmployee={selectedEmployee}
        />
      ))}
    </div>
  );
}
