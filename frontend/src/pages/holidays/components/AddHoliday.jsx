import React, { useState } from "react";
import LabeledBasicInput from "../../../components/LabeledBasicInput";

export default function AddHoliday({ employees }) {
  const today = new Date().toISOString().split("T")[0];

  const [holiday, setHoliday] = useState({
    employeeId: "",
    startDate: today,
    endDate: today,
  });
  const [error, setError] = useState("");

  function translateError() {}

  function handleAddHoliday() {}

  return (
    <div className="w-2/5 rounded-md bg-neutral p-8">
      <h2 className="px-1 py-2 font-Effra_Bd text-xl text-secondary">
        Vakantie toevoegen
      </h2>
      <form className="form-control" onSubmit={handleAddHoliday}>
        <label className="label">Naam</label>
        <select
          value={holiday.employeeId}
          onChange={(e) =>
            setHoliday({ ...holiday, employeeId: e.target.value })
          }
          className="select select-bordered w-full"
        >
          <option value="" disabled>
            Naam
          </option>
          {employees.map((employee) => {
            return (
              <option value={employee.id} key={employee.id}>
                {employee.name}
              </option>
            );
          })}
        </select>
        <LabeledBasicInput
          label="Van"
          type="date"
          value={holiday.startDate}
          onChange={(e) =>
            setHoliday({ ...holiday, startDate: e.target.value })
          }
        />
        <LabeledBasicInput
          label="Tot"
          type="date"
          value={holiday.endDate}
          onChange={(e) => setHoliday({ ...holiday, endDate: e.target.value })}
        />
        {error && <p className="mt-4 text-red-600">{error}</p>}
        <button
          type="submit"
          className="btn btn-accent mt-6 self-center whitespace-nowrap"
        >
          Opslaan
        </button>
      </form>
    </div>
  );
}
