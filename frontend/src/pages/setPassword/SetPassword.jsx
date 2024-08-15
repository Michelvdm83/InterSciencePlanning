import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../../services/ApiService";
import LabeledBasicInput from "../../components/LabeledBasicInput.jsx";

export default function SetPassword() {
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [linkIsValid, setLinkIsValid] = useState(false);
  const [newLinkSent, setNewLinkSent] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { passwordLinkId, employeeId } = useParams();

  useEffect(() => {
    ApiService.get(`password-links/${passwordLinkId}`)
      .then((response) => {
        setLinkIsValid(response.status === 200);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [passwordLinkId]);

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

  function handleSendNewLink(e) {
    e.preventDefault();

    ApiService.post(`password-links/${employeeId}`)
      .then(() => setNewLinkSent(true))
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setErrors(["Deze medewerker bestaat niet"]);
        } else if (error.response && error.response.status === 400) {
          setErrors(["Er bestaat al een link voor deze medewerker"]);
          setNewLinkSent(false);
        } else {
          setErrors([
            "Er is een onbekende fout opgetreden. Probeer het later opnieuw.",
          ]);
        }
      });
  }

  async function handleSetNewPassword(e) {
    e.preventDefault();

    if (password.length == 0) {
      setErrors(["Wachtwoord is verplicht"]);
      return;
    }
    const errors = validatePassword(password);
    if (errors.length > 0) {
      setErrors(errors);
      return;
    }
    if (password !== repeatedPassword) {
      setErrors(["Wachtwoord komt niet overeen met het herhaalde wachtwoord"]);
      return;
    }

    try {
      await ApiService.patch(`employees/${employeeId}`, { password });
      // delete password setting link from database after the password is set
      await ApiService.delete(`password-links/${passwordLinkId}`);
      navigate("/inloggen");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrors([
          "Medewerker niet gevonden. Controleer de link en probeer het opnieuw",
        ]);
      } else {
        setErrors(translateError(error));
      }
    }
  }

  function validatePassword(password) {
    let errors = [];

    if (password.length < 8) {
      errors.push("- Minimaal 8 karakters zijn");
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

    if (!hasUppercase) errors.push("- Een hoofdletter bevatten");
    if (!hasLowercase) errors.push("- Een kleine letter bevatten");
    if (!hasNumber) errors.push("- Een nummer bevatten");
    if (!hasSpecialCharacter) errors.push("- Een speciaal karakter bevatten");

    if (errors.length > 0) {
      errors.unshift("Wachtwoord moet: ");
    }
    return errors;
  }

  if (loading) {
    return <div></div>;
  }

  return linkIsValid ? (
    <div className="flex justify-center">
      <form
        className="form-control mt-4 flex w-full max-w-[16rem] flex-col items-start"
        onSubmit={handleSetNewPassword}
      >
        <LabeledBasicInput
          label={"Nieuw wachtwoord"}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <LabeledBasicInput
          label={"Herhaal nieuw wachtwoord"}
          type="password"
          value={repeatedPassword}
          onChange={(e) => setRepeatedPassword(e.target.value)}
        />
        {errors.length > 0 ? (
          <div className="mt-4 break-words text-red-600">
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
      {newLinkSent && (
        <p className="mt-4 font-Effra_Bd text-accent">
          Er is een nieuwe link verstuurd!
        </p>
      )}
      {errors.length > 0 ? (
        <div className="mt-4 break-words text-red-600">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
