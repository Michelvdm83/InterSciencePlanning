import { useState } from "react";
import ApiService from "../../../services/ApiService.js";
import LabeledBasicInput from "../../../components/LabeledBasicInput.jsx";

export default function AddEmployee({ employees, setEmployees }) {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    function: "",
  });
  const [error, setError] = useState("");

  function translateError(error) {
    switch (error.toString()) {
      case "Name is required":
        return "Naam is verplicht";
      case "Email is required":
        return "E-mailadres is verplicht";
      case "Email is not valid":
        return "E-mailadres is niet geldig";
      case "Employee with this email already exists":
        return "Medewerker met dit e-mailadres bestaat al";
      default:
        return "Er is een onbekende fout opgetreden. Probeer het later opnieuw.";
    }
  }

  function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  async function handleAddEmployee(e) {
    e.preventDefault();

    if (!employee.name.trim()) {
      setError("Naam is verplicht");
    } else if (!employee.email.trim()) {
      setError("E-mailadres is verplicht");
    } else if (!isValidEmail(employee.email)) {
      setError("E-mailadres is niet geldig");
    } else if (!employee.function) {
      setError("Functie is verplicht");
    } else {
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
          onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
        />
        <label className="label">Functie</label>
        <select
          value={employee.function}
          onChange={(e) =>
            setEmployee({ ...employee, function: e.target.value })
          }
          className="select select-bordered w-full"
        >
          <option value="" disabled>
            Functie
          </option>
          <option value="SSP_TEAM_LEADER">SSP Teamleider</option>
          <option value="FT_TEAM_LEADER">FT Teamleider</option>
          <option value="SSP">SSP</option>
          <option value="FT">FT</option>
        </select>
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
