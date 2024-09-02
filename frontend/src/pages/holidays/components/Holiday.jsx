import React from "react";
import DeleteButton from "../../../components/DeleteButton";
import ApiService from "../../../services/ApiService";
import EditHoliday from "./EditHoliday";

export default function Holiday({
  holiday,
  holidays,
  setHolidays,
  selectedEmployee,
}) {
  function formatDate(originalDate) {
    const parts = originalDate.split("-");
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${day}/${month}/${year}`;
  }
  function handleDeleteHoliday(e) {
    e.preventDefault();

    ApiService.delete(`holidays/${holiday.id}`)
      .then(() => {
        const updatedHolidays = holidays.filter((e) => e.id !== holiday.id);
        setHolidays(updatedHolidays);
      })
      .catch(() => {
        setError("Er is een fout opgetreden bij het verwijderen");
      });
  }

  return (
    <div className="mb-2 flex justify-between rounded-md bg-base-100 p-4">
      <div>
        <p className="">
          {formatDate(holiday.startDate)} <span className="mx-2">-</span>
          {formatDate(holiday.endDate)}
          {selectedEmployee.id == "" && (
            <span className="mx-5 text-accent">{holiday.employeeName}</span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <EditHoliday holiday={holiday} setHolidays={setHolidays} />
        <DeleteButton
          question="Weet je zeker dat je deze vakantie wilt verwijderen?"
          onClick={handleDeleteHoliday}
          id={`delete-employee-${holiday.id}`}
        />
      </div>
    </div>
  );
}
