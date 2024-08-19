import React from "react";
import DeleteButton from "../../../components/DeleteButton";
import ApiService from "../../../services/ApiService";

export default function Holiday({ holiday, holidays, setHolidays }) {
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
    <div className="flex justify-between rounded-md bg-base-100 p-3">
      <div>
        <p className="">
          {holiday.startDate} <span className="mx-2">-</span> {holiday.endDate}
        </p>
      </div>
      <DeleteButton
        question="Weet je zeker dat je deze vakantie wilt verwijderen?"
        onClick={handleDeleteHoliday}
        id={`delete-employee-${holiday.id}`}
      />
    </div>
  );
}
