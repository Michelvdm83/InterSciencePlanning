import React from "react";
import LabeledBasicInput from "../../../components/LabeledBasicInput";

export default function EmployeeFormFields({ employee, setEmployee }) {
  return (
    <>
      <LabeledBasicInput
        label={"Naam"}
        type="text"
        value={employee.name}
        onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
      />
      <LabeledBasicInput
        label={"E-mailadres"}
        type="text"
        value={employee.email}
        onChange={(e) =>
          setEmployee({
            ...employee,
            email: e.target.value,
          })
        }
      />
      <label className="label flex flex-col items-start px-0">
        Functie
        <select
          value={employee.function}
          onChange={(e) =>
            setEmployee({
              ...employee,
              function: e.target.value,
            })
          }
          className="select select-bordered mt-2 w-full"
        >
          <option value="" disabled>
            Functie
          </option>
          <option value="SSP_TEAM_LEADER">SSP-Teamleider</option>
          <option value="FT_TEAM_LEADER">FT-Teamleider</option>
          <option value="SSP">SSP</option>
          <option value="FT">FT</option>
        </select>
      </label>
    </>
  );
}
