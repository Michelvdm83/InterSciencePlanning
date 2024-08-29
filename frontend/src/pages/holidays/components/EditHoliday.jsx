import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import LabeledBasicInput from "../../../components/LabeledBasicInput";
import ApiService from "../../../services/ApiService";
import { translateError, validateHolidayData } from "./validateHoliday.js";

export default function EditHoliday({ holiday, setHolidays }) {
  const [editedHoliday, setEditedHoliday] = useState({
    employeeId: holiday.employeeId,
    startDate: holiday.startDate,
    endDate: holiday.endDate,
  });

  const [error, setError] = useState("");

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

    if (validateHolidayData(editedHoliday, setError)) {
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
              <button
                type="button"
                className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
                onClick={handleClose}
              >
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
                    ...editedHoliday,
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
