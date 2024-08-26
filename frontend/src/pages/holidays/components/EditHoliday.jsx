import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import LabeledBasicInput from "../../../components/LabeledBasicInput";
import ApiService from "../../../services/ApiService";

export default function EditHoliday({ holiday, setHolidays }) {
  const [editedHoliday, setEditedHoliday] = useState({
    startDate: holiday.startDate,
    endDate: holiday.endDate,
  });

  const [error, setError] = useState("");

  function translateError(error) {
    switch (error.toString()) {
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

  function handleClose() {
    setError("");
    document.getElementById(`edit-holiday-${holiday.id}`).close();
  }

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveEditedHoliday(e);
    }
  };

  function handleSaveEditedHoliday(e) {
    e.preventDefault();

    if (!editedHoliday.startDate) {
      setError("Begindatum moet gekozen worden");
      return;
    }
    if (!editedHoliday.endDate) {
      setError("Einddatum moet gekozen worden");
      return;
    }
    if (editedHoliday.startDate > editedHoliday.endDate) {
      setError("De begindatum mag niet na de einddatum zijn");
      return;
    }

    const updatedFields = {};
    if (editedHoliday.startDate !== holiday.startDate) {
      updatedFields.startDate = editedHoliday.startDate;
    }
    if (editedHoliday.endDate !== holiday.endDate) {
      updatedFields.endDate = editedHoliday.endDate;
    }

    if (Object.keys(updatedFields).length > 0) {
      ApiService.patch(`holidays/${holiday.id}`, editedHoliday)
        .then(() => {
          return ApiService.get("holidays");
        })
        .then((response) => {
          setHolidays(response.data);
          setError("");
          handleClose();
        })
        .catch((error) =>
          setError(translateError(error.response?.data?.detail)),
        );
    } else {
      handleClose();
    }
  }

  return (
    <>
      <FaEdit
        className="text-l cursor-pointer text-accent"
        onClick={() =>
          document.getElementById(`edit-holiday-${holiday.id}`).showModal()
        }
      />

      <dialog
        id={`edit-holiday-${holiday.id}`}
        className="modal"
        onClose={handleClose}
      >
        <div className="modal-box">
          <div className="items-between flex justify-center">
            <form className="flex w-full flex-col" onKeyDown={handleOnKeyDown}>
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
              <LabeledBasicInput
                label="Van"
                type="date"
                value={editedHoliday.startDate}
                onChange={(e) =>
                  setEditedHoliday({
                    ...editedHoliday,
                    startDate: e.target.value,
                  })
                }
              />
              <LabeledBasicInput
                label="Tot"
                type="date"
                value={editedHoliday.endDate}
                onChange={(e) =>
                  setEditedHoliday({
                    ...editedHolidayholiday,
                    endDate: e.target.value,
                  })
                }
              />

              {error && <p className="mt-4 text-red-600">{error}</p>}
              <button
                className="btn btn-accent mt-6 self-center"
                type="submit"
                onClick={handleSaveEditedHoliday}
              >
                Opslaan
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
