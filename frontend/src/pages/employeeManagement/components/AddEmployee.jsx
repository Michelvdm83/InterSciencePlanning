import { useState } from "react";
import ApiService from "../../../services/ApiService.js";
import { translateError, validateEmployeeData } from "./validateEmployee.js";
import EmployeeFormFields from "./EmployeeFormFields.jsx";

export default function AddEmployee({ employees, setEmployees }) {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    function: "",
  });
  const [error, setError] = useState("");

  async function handleAddEmployee(e) {
    e.preventDefault();

    if (validateEmployeeData(employee, setError)) {
      try {
        const response = await ApiService.post("employees", employee);
        setEmployees([...employees, response.data]);
        setEmployee({ name: "", email: "", function: "" });
        setError("");
        await ApiService.post(`password-links/${response.data.id}`);
      } catch (error) {
        setError(translateError(error.response?.data?.detail));
      }
    }
  }

  return (
    <div className="w-2/5 rounded-md bg-neutral p-8">
      <h2 className="px-1 py-2 font-Effra_Bd text-xl text-secondary">
        Medewerker toevoegen
      </h2>
      <form className="form-control" onSubmit={handleAddEmployee}>
        <EmployeeFormFields employee={employee} setEmployee={setEmployee} />

        {error && <p className="mt-4 text-red-600">{error}</p>}
        <button
          type="submit"
          className="btn btn-accent mt-6 self-center whitespace-nowrap"
        >
          Verzend uitnodiging
        </button>
      </form>
    </div>
  );
}
