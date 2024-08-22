import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import ApiService from "../../../services/ApiService";
import { translateError, validateEmployeeData } from "./validateEmployee.js";
import EmployeeFormFields from "./EmployeeFormFields.jsx";

export default function EditEmployee({ employee, setEmployees }) {
  const [editedEmployee, setEditedEmployee] = useState({
    name: employee.name,
    email: employee.email,
    function: employee.function,
  });

  const [error, setError] = useState("");

  function handleClose() {
    setError("");
    document.getElementById(`edit-employee-${employee.id}`).close();
  }

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveEditedEmployee(e);
    }
  };

  function handleSaveEditedEmployee(e) {
    e.preventDefault();

    if (validateEmployeeData(editedEmployee, setError)) {
      const updatedFields = {};
      if (editedEmployee.name !== employee.name) {
        updatedFields.name = editedEmployee.name;
      }
      if (editedEmployee.email !== employee.email) {
        updatedFields.email = editedEmployee.email;
      }
      if (editedEmployee.function !== employee.function) {
        updatedFields.function = editedEmployee.function;
      }

      if (Object.keys(updatedFields).length > 0) {
        ApiService.patch(`employees/${employee.id}`, editedEmployee)
          .then((response) => {
            setEmployees((prevEmployees) =>
              prevEmployees.map((emp) =>
                emp.id === employee.id ? response.data : emp,
              ),
            );
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
          document.getElementById(`edit-employee-${employee.id}`).showModal()
        }
      />

      <dialog
        id={`edit-employee-${employee.id}`}
        className="modal"
        onClose={handleClose}
      >
        <div className="modal-box">
          <div className="items-between flex justify-center">
            <form className="flex w-full flex-col" onKeyDown={handleOnKeyDown}>
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>

              <EmployeeFormFields
                employee={editedEmployee}
                setEmployee={setEditedEmployee}
              />
              {error && <p className="mt-4 text-red-600">{error}</p>}
              <button
                className="btn btn-accent mt-6 self-center"
                type="submit"
                onClick={handleSaveEditedEmployee}
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
