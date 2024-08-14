import React from "react";
import { TiDelete } from "react-icons/ti";

export default function DeleteButton({ question, onClick, id }) {
  return (
    <>
      <TiDelete
        className="cursor-pointer text-2xl text-accent"
        onClick={() => document.getElementById(id).showModal()}
      />
      <dialog id={id} className="modal">
        <div className="modal-box">
          <p className="mb-2 py-4 text-center font-Effra_Bd">{question}</p>
          <div className="items-between flex justify-center">
            <form method="dialog">
              <button className="btn btn-outline btn-primary mr-6">
                Annuleren
              </button>
              <button
                className="btn btn-outline btn-accent ml-6"
                onClick={onClick}
              >
                Verwijderen
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
