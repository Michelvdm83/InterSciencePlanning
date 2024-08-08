import { useState } from "react";
import ApiService from "../../services/ApiService";

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
      case "Employee with this email already exists":
        return "Medewerker met dit e-mailadres bestaat al";
      default:
        return error;
    }
  }

  function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  function handleAddEmployee(e) {
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
      ApiService.post("employees", employee)
        .then((response) => {
          setEmployees([...employees, response.data]);
          setEmployee({ name: "", email: "", function: "" });
          setError("");
        })
        .catch((error) => {
          setError(translateError(error.response?.data?.detail));
        });
    }
  }

  return (
    <div className="flex w-full flex-col rounded-md bg-neutral p-8">
      <h2 className="px-1 py-2 text-xl font-bold">Medewerker toevoegen</h2>
      <form className="form-control" onSubmit={handleAddEmployee}>
        <label className="label">Naam</label>
        <input
          className="input input-bordered w-full"
          type="text"
          value={employee.name}
          onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
        ></input>
        <label className="label">E-mailadres</label>
        <input
          className="input input-bordered w-full"
          type="text"
          value={employee.email}
          onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
        ></input>
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
          <option value="TEAM_LEADER">Teamleider</option>
          <option value="SSP">SSP</option>
          <option value="FT">FT</option>
        </select>
        {error && <p className="mt-4 text-red-600">{error}</p>}
        <button type="submit" className="btn btn-accent mt-6 w-1/3 self-center">
          Verzend uitnodiging
        </button>
      </form>
    </div>
  );
}
