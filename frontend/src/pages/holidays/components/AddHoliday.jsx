import React, { useState } from "react";
import LabeledBasicInput from "../../../components/LabeledBasicInput";
import ApiService from "../../../services/ApiService";

export default function AddHoliday({ employees, holidays, setHolidays }) {
  const today = new Date().toISOString().split("T")[0];

  const [holiday, setHoliday] = useState({
    employeeId: "",
    startDate: today,
    endDate: today,
  });

  const [error, setError] = useState("");

  function translateError(error) {
    switch (error.toString()) {
      case "EmployeeId can't be null":
        return "Medewerker moet gekozen worden";
      case "Start date can't be null":
        return "Begindatum moet gekozen worden";
      case "End date can't be null":
        return "Einddatum moet gekozen worden";
      case "Start date can't be after end date":
        return "De begindatum mag niet na de einddatum zijn";
      default:
        return "Er is een onbekende fout opgetreden. Probeer het later opnieuw.";
    }
  }

  function handleAddHoliday(e) {
    e.preventDefault();

    if (!holiday.employeeId) {
      setError("Medewerker moet gekozen worden");
    } else if (!holiday.startDate) {
      setError("Begindatum moet gekozen worden");
    } else if (!holiday.endDate) {
      setError("Einddatum moet gekozen worden");
    } else if (holiday.startDate > holiday.endDate) {
      setError("De begindatum mag niet na de einddatum zijn");
    } else {
      ApiService.post("holidays", holiday)
        .then((response) => {
          setHolidays([...holidays, response.data]);
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
      <h2 className="px-1 py-2 font-Effra_Bd text-xl text-secondary">
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
