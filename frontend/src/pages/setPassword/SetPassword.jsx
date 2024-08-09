import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../../services/ApiService";

export default function SetPassword() {
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  const { passwordLinkId, employeeId } = useParams();

  function translateError(error) {
    switch (error) {
      case "Password is required":
        return "Wachtwoord is verplicht";
      case "Password is invalid!":
        return "Wachtwoord is ongeldig";
      default:
        return error;
    }
  }

  function linkIsValid() {
    ApiService.get(`password-links/${passwordLinkId}`).then((response) => {
      return response.status === 200;
    });
  }

  function handleSendNewLink(e) {
    e.preventDefault();

    ApiService.post(`password-links/${employeeId}`).catch((error) =>
      console.error(error),
    );
  }

  async function handleSetNewPassword(e) {
    e.preventDefault();

    if (password.length == 0) {
      setErrors(["Wachtwoord is verplicht"]);
      return;
    }
    if (password !== repeatedPassword) {
      setErrors(["Wachtwoord komt niet overeen"]);
      return;
    }
    const errors = validatePassword(password);
    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    try {
      await ApiService.patch(`employees/${employeeId}`, { password });
      await ApiService.delete(`password-links/${passwordLinkId}`);
      navigate("/inloggen");
    } catch (error) {
      setErrors(translateError(error));
    }
  }

  function validatePassword(password) {
    let errors = [];

    if (password.length < 8) {
      errors.push("Wachtwoord moet minimaal 8 karakters zijn");
    }

    let hasUppercase = false;
    let hasLowercase = false;
    let hasNumber = false;
    let hasSpecialCharacter = false;
    for (let i = 0; i < password.length; i++) {
      const chr = password[i];

      if (chr.toUpperCase() != chr.toLowerCase()) {
        if (chr == chr.toUpperCase()) hasUppercase = true;
        else hasLowercase = true;
      } else if (chr.match("[0-9]") > 0) hasNumber = true;
      else hasSpecialCharacter = true;
    }

    if (!hasUppercase) errors.push("Wachtwoord moet een hoofdletter bevatten");
    if (!hasLowercase)
      errors.push("Wachtwoord moet een kleine letter bevatten");
    if (!hasNumber) errors.push("Wachtwoord moet een nummer bevatten");
    if (!hasSpecialCharacter)
      errors.push("Wachtwoord moet een speciaal karakter bevatten");

    return errors;
  }

  return linkIsValid() ? (
    <div className="flex justify-center">
      <form
        className="form-control mt-4 flex flex-col items-start"
        onSubmit={handleSetNewPassword}
      >
        <label className="label">Nieuw wachtwoord</label>
        <input
          className="input input-bordered"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <label className="label">Herhaal nieuw wachtwoord</label>
        <input
          className="input input-bordered"
          type="password"
          value={repeatedPassword}
          onChange={(e) => setRepeatedPassword(e.target.value)}
        />
        {errors.length > 0 ? (
          <div className="text-center font-bold text-[#F00]">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        ) : null}
        <button type="submit" className="btn btn-accent mt-4 w-full">
          Opslaan
        </button>
      </form>
    </div>
  ) : (
    <div className="mt-4 flex flex-col items-center">
      <p>Deze link is niet meer geldig!</p>
      <p>Klik hieronder om een nieuwe link te ontvangen.</p>
      <button className="btn btn-accent mt-4" onClick={handleSendNewLink}>
        Ontvang nieuwe link
      </button>
    </div>
  );
}
