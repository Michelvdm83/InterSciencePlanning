import React, { useState, useEffect } from "react";
import LabeledBasicInput from "../../../components/LabeledBasicInput";
import ApiService from "../../../services/ApiService";
import { translateError, validateHolidayData } from "./validateHoliday.js";

export default function AddHoliday({ employees, setHolidays }) {
  const today = new Date().toISOString().split("T")[0];

  const [holiday, setHoliday] = useState({
    employeeId: "",
    startDate: today,
    endDate: today,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    // Set endDate to startDate when startDate is selected to be after endDate
    if (holiday.startDate > holiday.endDate) {
      setHoliday((prevHoliday) => ({
        ...prevHoliday,
        endDate: prevHoliday.startDate,
      }));
    }
  }, [holiday.startDate]);

  function handleAddHoliday(e) {
    e.preventDefault();

    if (validateHolidayData(holiday, setError)) {
      ApiService.post("holidays", holiday)
        .then(() => {
          return ApiService.get("holidays");
        })
        .then((response) => {
          setHolidays(response.data);
          setHoliday({ employeeId: "", startDate: today, endDate: today });
          setError("");
        })
        .catch((error) =>
          setError(translateError(error.response?.data?.detail)),
        );
    }
  }

  return (
    <div className="w-2/5 rounded-md bg-neutral p-8">
      <h2 className="py-2 font-Effra_Bd text-xl text-secondary">
        Vakantie toevoegen
      </h2>
      <form className="form-control" onSubmit={handleAddHoliday}>
        <label className="label flex flex-col items-start px-0">
          Naam
          <select
            value={holiday.employeeId}
            onChange={(e) =>
              setHoliday({ ...holiday, employeeId: e.target.value })
            }
            className="select select-bordered mt-2 w-full"
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
        </label>

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
