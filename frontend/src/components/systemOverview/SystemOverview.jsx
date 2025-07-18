import { useEffect, useState } from "react";
import SystemTextField from "./components/SystemTextField.jsx";
import SystemDateField from "./components/SystemDateField.jsx";
import ApiService from "../../services/ApiService.js";
import EmployeeService from "../../services/EmployeeService.js";
import SystemSelectStatusField from "./components/SystemSelectStatusField.jsx";
import SystemSelectEmployeeField from "./components/SystemSelectEmployeeField.jsx";
import SystemNumberField from "./components/SystemNumberField.jsx";
import SystemTextArea from "./components/SystemTextArea.jsx";
import {
  translateError,
  validateSystemData,
} from "./components/validateSystem.js";
import SystemWarehouseCheckboxField from "./components/SystemWarehouseCheckboxField.jsx";

export default function SystemOverview({
  systemName,
  modalIsOpen,
  setModalIsOpen,
  functionOnClose,
}) {
  const [expectedFinish, setExpectedFinish] = useState(null);
  const [system, setSystem] = useState({});
  const [editedSystem, setEditedSystem] = useState({});
  const [error, setError] = useState("");

  const employeeFunction = EmployeeService.getEmployeeFunction();

  useEffect(() => {
    if (systemName) {
      const fetchData = async () => {
        const response = await ApiService.get(`systems/${systemName}`);

        const data = response.data;

        setSystem(data);

        setExpectedFinish(response.data.expectedEndDate);
      };
      fetchData();
    }
  }, [systemName]);

  useEffect(() => {
    if (modalIsOpen) {
      const modal = document.getElementById(systemName || "new-system");
      if (modal) {
        modal.showModal();
      }
      if (systemName) {
        setEditedSystem({ ...system });
      }
    }
  }, [modalIsOpen, systemName, system]);

  function handleClose() {
    if (functionOnClose) {
      functionOnClose();
    }
    setModalIsOpen(false);
    setSystem({});
    setEditedSystem({});
  }

  function handleOnKeyDown(e) {
    if (e.key === "Enter") {
      handleSave(e);
    }
    if (e.key === "Escape") {
      e.preventDefault();
    }
  }

  function handleSave(e) {
    e.preventDefault();

    if (!systemName) {
      if (validateSystemData(system, setError)) {
        ApiService.post("systems", system)
          .then(() => handleClose())
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              setError("Medewerker niet gevonden");
            } else {
              setError(translateError(error.response?.data?.detail || ""));
            }
          });
      }
    } else {
      // Determine which fields have been edited
      const editedFields = {};
      for (const key in editedSystem) {
        if (editedSystem[key] !== system[key]) {
          editedFields[key] = editedSystem[key];
        }
      }
      if (Object.keys(editedFields).length > 0) {
        if (validateSystemData(editedSystem, setError)) {
          ApiService.patch(`systems/${systemName}`, editedFields)
            .then(() => handleClose())
            .catch((error) => {
              setError(translateError(error.response?.data?.detail || ""));
            });
        }
      } else {
        handleClose();
      }
    }
  }

  return (
    <dialog id={systemName || "new-system"} className="modal">
      <div className="modal-box w-fit max-w-full p-0">
        <form method="dialog" onKeyDown={(e) => handleOnKeyDown(e)}>
          {error && <p className="py-3 text-center text-red-600">{error}</p>}
          <div className="flex h-full w-full cursor-default justify-evenly gap-20 overflow-hidden bg-neutral px-9 py-4">
            {/*
               1st Collumn
             */}
            <div className="flex h-full flex-col gap-2">
              <SystemTextField
                title="Systeem"
                variable="name"
                editable={employeeFunction === "TEAM_LEADER"}
                system={systemName ? editedSystem : system}
                setSystem={systemName ? setEditedSystem : setSystem}
              />
              <SystemTextField
                title="Systeemtype"
                variable="systemType"
                editable={employeeFunction === "TEAM_LEADER"}
                system={systemName ? editedSystem : system}
                setSystem={systemName ? setEditedSystem : setSystem}
              />
              <div className="flex w-48 gap-1">
                <SystemTextField
                  title="P.O. Nr."
                  variable="poNumber"
                  editable={employeeFunction === "TEAM_LEADER"}
                  system={systemName ? editedSystem : system}
                  setSystem={systemName ? setEditedSystem : setSystem}
                />
                <div className="divider divider-horizontal m-0 p-0 pb-1 pt-6"></div>
                <SystemWarehouseCheckboxField
                  variable="orderPickedByWarehouse"
                  editable={
                    employeeFunction === "TEAM_LEADER" ||
                    employeeFunction === "WAREHOUSE"
                  }
                  system={systemName ? editedSystem : system}
                  setSystem={systemName ? setEditedSystem : setSystem}
                />
              </div>

              <SystemTextField
                title="Eindverantwoordelijke"
                variable="employeeResponsible"
                editable={employeeFunction === "TEAM_LEADER"}
                system={systemName ? editedSystem : system}
                setSystem={systemName ? setEditedSystem : setSystem}
              />

              <SystemDateField
                title="Afgesproken deadline"
                date={system.agreedDate}
                variable="agreedDate"
                editable={employeeFunction === "TEAM_LEADER"}
                system={systemName ? editedSystem : system}
                setSystem={systemName ? setEditedSystem : setSystem}
              />
              <SystemDateField
                title="Verwachte einddatum"
                date={expectedFinish}
                variable="expectedFinish"
                editable={false}
                system={systemName ? editedSystem : system}
                setSystem={systemName ? setEditedSystem : setSystem}
              />
              <SystemDateField
                title="Dag van levering/installatie"
                date={system.actualDeliveryDate}
                variable="actualDeliveryDate"
                editable={
                  employeeFunction === "TEAM_LEADER" ||
                  employeeFunction === "FT"
                }
                system={systemName ? editedSystem : system}
                setSystem={systemName ? setEditedSystem : setSystem}
              />
              <SystemTextArea
                heightCSS="h-48"
                title="Contactgegevens klant"
                text={system.customerContactInformation}
                variable="customerContactInformation"
                editable={
                  employeeFunction === "TEAM_LEADER" ||
                  employeeFunction === "FT"
                }
                system={systemName ? editedSystem : system}
                setSystem={systemName ? setEditedSystem : setSystem}
              />
            </div>
            {/*
                2nd Collumn
            */}
            <div className="flex flex-col gap-2">
              <SystemSelectStatusField
                title="Status"
                variable="status"
                editable={
                  systemName && employeeFunction !== "WAREHOUSE" && true
                }
                system={systemName ? editedSystem : system}
                setSystem={systemName ? setEditedSystem : setSystem}
              />
              {/*
                SSP Fields
              */}
              <div className="flex flex-col gap-2 border-b-2 border-t-2 border-secondary pb-3 pt-1">
                <SystemSelectEmployeeField
                  title="SSP-medewerker"
                  variable="employeeSSP"
                  editable={employeeFunction === "TEAM_LEADER"}
                  system={systemName ? editedSystem : system}
                  setSystem={systemName ? setEditedSystem : setSystem}
                />
                <SystemNumberField
                  title="Productiedagen"
                  variable="estimatedConstructionDays"
                  editable={employeeFunction === "TEAM_LEADER"}
                  system={systemName ? editedSystem : system}
                  setSystem={systemName ? setEditedSystem : setSystem}
                />
                <SystemDateField
                  title="Startdatum productie"
                  date={system.startOfConstruction}
                  variable="startOfConstruction"
                  editable={
                    systemName &&
                    (employeeFunction === "TEAM_LEADER" ||
                      employeeFunction === "SSP")
                  }
                  system={systemName ? editedSystem : system}
                  setSystem={systemName ? setEditedSystem : setSystem}
                />
                <SystemDateField
                  title="Einddatum productie"
                  date={system.endOfConstruction}
                  variable="endOfConstruction"
                  editable={
                    systemName &&
                    (employeeFunction === "TEAM_LEADER" ||
                      employeeFunction === "SSP")
                  }
                  system={systemName ? editedSystem : system}
                  setSystem={systemName ? setEditedSystem : setSystem}
                />
              </div>
              {/*
                 FT fields
              */}
              <div className="flex flex-col gap-2 border-b-2 border-secondary pb-3">
                <SystemSelectEmployeeField
                  title="FT-medewerker"
                  variable="employeeFT"
                  editable={
                    employeeFunction === "TEAM_LEADER" ||
                    employeeFunction === "FT"
                  }
                  system={systemName ? editedSystem : system}
                  setSystem={systemName ? setEditedSystem : setSystem}
                />
                <SystemNumberField
                  title="Testdagen"
                  variable="estimatedTestDays"
                  editable={employeeFunction === "TEAM_LEADER"}
                  system={systemName ? editedSystem : system}
                  setSystem={systemName ? setEditedSystem : setSystem}
                />

                <SystemDateField
                  title="Startdatum test"
                  date={system.startOfTest}
                  variable="startOfTest"
                  editable={
                    systemName &&
                    (employeeFunction === "TEAM_LEADER" ||
                      employeeFunction === "FT")
                  }
                  system={systemName ? editedSystem : system}
                  setSystem={systemName ? setEditedSystem : setSystem}
                />
                <SystemDateField
                  title="Einddatum test"
                  date={system.endOfTest}
                  variable="endOfTest"
                  editable={
                    (systemName && employeeFunction === "TEAM_LEADER") ||
                    employeeFunction === "FT"
                  }
                  system={systemName ? editedSystem : system}
                  setSystem={systemName ? setEditedSystem : setSystem}
                />
              </div>
              <SystemTextField
                title="Verkoper"
                variable="seller"
                editable={employeeFunction === "TEAM_LEADER"}
                system={systemName ? editedSystem : system}
                setSystem={systemName ? setEditedSystem : setSystem}
              />
            </div>
            {/*
                3rd collumn
            */}
            <div className="flex flex-col gap-1">
              <SystemTextArea
                heightCSS="h-56"
                title="Project informatie"
                text={system.projectInformation}
                variable="projectInformation"
                editable={true}
                system={systemName ? editedSystem : system}
                setSystem={systemName ? setEditedSystem : setSystem}
              />
              <SystemTextArea
                heightCSS="h-64"
                title="Notities"
                text={system.notes}
                variable="notes"
                editable={true}
                system={systemName ? editedSystem : system}
                setSystem={systemName ? setEditedSystem : setSystem}
              />
              <div className="mt-2 flex flex-col gap-3">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleClose}
                >
                  Annuleren
                </button>
                <button
                  className="btn btn-accent"
                  type="submit"
                  onClick={handleSave}
                >
                  Opslaan
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
}
