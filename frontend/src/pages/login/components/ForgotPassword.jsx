import React, { useState } from "react";
import ApiService from "../../../services/ApiService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [linkSent, setLinkSent] = useState(false);

  function handleSendResetLink(e) {
    e.preventDefault();

    if (!email) {
      setError("Vul een e-mailadres in");
    } else {
      ApiService.post("password-links/send-reset-link", { email })
        .then(() => {
          setError("");
          setLinkSent(true);
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setError("Geen account gevonden met dit e-mailadres");
          } else if (error.response && error.response.status === 400) {
            setError("Er is al een link naar dit e-mailadres verstuurd");
          } else {
            setError(
              "Er is een onbekende fout opgetreden. Probeer het later opnieuw.",
            );
          }
        });
    }
  }

  function handleClose() {
    setEmail("");
    setError("");
    setLinkSent(false);
    document.getElementById("forgot-password").close();
  }

  return (
    <>
      <p
        className="cursor-pointer text-secondary"
        onClick={() => document.getElementById("forgot-password").showModal()}
      >
        Wachtwoord vergeten?
      </p>
      <dialog id="forgot-password" className="modal" onClose={handleClose}>
        <div className="modal-box">
          <p className="mb-2 py-4 text-center font-Effra_Bd">
            Vul je e-mailadres in om een link te krijgen
          </p>
          <div className="items-between flex justify-center">
            <form className="flex w-full flex-col items-center justify-center gap-4">
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>

              <input
                type="text"
                className="input input-bordered w-3/4"
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                className="btn btn-accent"
                type="button"
                onClick={handleSendResetLink}
              >
                Link versturen
              </button>
              {error && <p className="mt-4 text-red-600">{error}</p>}
              {linkSent && (
                <p className="mt-4 font-Effra_Bd text-accent">
                  {`Er is een link verstuurd naar ${email}`}
                </p>
              )}
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
