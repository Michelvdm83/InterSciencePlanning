import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeService from "../../services/EmployeeService";
import LabeledBasicInput from "../../components/LabeledBasicInput.jsx";

export default function Login() {
  function translateError(error) {
    switch (error) {
      case "Email is required":
        return "Email is verplicht";
      case "Password is required":
        return "Wachtwoord is verplicht";
      case "Password is incorrect":
        return "Wachtwoord is verkeerd";
      default:
        return "Er is een onbekende fout opgetreden. Probeer het later opnieuw.";
    }
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    if (email.length == 0) {
      setError("Email is verplicht!");
    } else if (password.length == 0) {
      setError("Wachtwoord is verplicht!");
    } else {
      EmployeeService.login(email, password)
        .then(() => {
          navigate("/");
          window.location.reload();
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setError("Account niet gevonden");
          } else {
            setError(translateError(error.response?.data?.detail));
          }
        });
    }
  }

  return (
    <div className="flex justify-center">
      <form
        className="form-control mt-4 flex w-full max-w-[16rem] flex-col items-start"
        onSubmit={handleLogin}
      >
        <LabeledBasicInput
          label={"E-mailadres"}
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <LabeledBasicInput
          label={"Wachtwoord"}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="mt-4 text-red-600">{error}</p>}
        <button type="submit" className="btn btn-primary mt-4 w-full">
          Inloggen
        </button>
      </form>
    </div>
  );
}
