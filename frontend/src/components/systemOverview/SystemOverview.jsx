import { useEffect, useState } from "react";
import SystemTextField from "./components/SystemTextField.jsx";
import SystemDateField from "./components/SystemDateField.jsx";
import ApiService from "../../services/ApiService.js";
import EmployeeService from "../../services/EmployeeService.js";
import SystemCheckboxField from "./components/SystemCheckBoxField.jsx";
import SystemSelectStatusField from "./components/SystemSelectStatusField.jsx";
import SystemSelectEmployeeField from "./components/SystemSelectEmployeeField.jsx";
import SystemNumberField from "./components/SystemNumberField.jsx";
import SystemTextArea from "./components/SystemTextArea.jsx";
import {
  translateError,
  validateSystemData,
} from "./components/validateSystem.js";

export default function SystemOverview({
  systemName,
  modalIsOpen,
  setModalIsOpen,
}) {
  const [expectedFinish, setExpectedFinish] = useState(null);
  const [system, setSystem] = useState({});
  const [error, setError] = useState("");

  const employeeFunction = EmployeeService.getEmployeeFunction();

  useEffect(() => {
    if (systemName) {
      const fetchData = async () => {
        const response = await ApiService.get(
          `http://localhost:8080/api/v1/systems/${systemName}`,
        );

        const data = response.data;
        setSystem(data);

        const startDate = new Date(
          response.data.startOfTest
            ? response.data.startOfTest
            : response.data.startOfConstruction
              ? response.data.startOfConstruction
              : new Date(),
        );
        const buildTime = response.data.estimatedConstructionDays
          ? response.data.estimatedConstructionDays
          : 0;
        const testTime = response.data.estimatedTestDays
          ? response.data.estimatedTestDays
          : 0;
        const addedDate = new Date(
          startDate.setDate(startDate.getDate() + (buildTime + testTime)),
        );
        let expectedDate = addedDate.toISOString().split("T")[0];

        setExpectedFinish(expectedDate);
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
    }
  }, [modalIsOpen, systemName, system]);

  function handleClose() {
    setModalIsOpen(false);
    setSystem({});
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

    if (validateSystemData(system, setError)) {
      ApiService.post("systems", system)
        .then(() => handleClose())
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setError("Medewerker niet gevonden");
          } else {
            setError(translateError(error.response?.data?.detail));
          }
        });
    }
  }

  return (
    <dialog id={systemName || "new-system"} className="modal">
      <div className="modal-box w-fit max-w-full p-0">
        <form method="dialog" onKeyDown={(e) => handleOnKeyDown(e)}>
          <div className="flex h-full w-full justify-evenly gap-8 overflow-hidden bg-neutral p-9">
            <div className="flex h-full flex-col">
              <SystemTextField
                title="Systeem"
                variable="name"
                editable={employeeFunction == "TEAM_LEADER"}
                system={system}
                setSystem={setSystem}
              />
              <SystemTextField
                title="P.O. nummer"
                variable="poNumber"
                editable={employeeFunction == "TEAM_LEADER"}
                system={system}
                setSystem={setSystem}
              />
              <SystemTextField
                title="Systeemtype"
                variable="systemType"
                editable={employeeFunction == "TEAM_LEADER"}
                system={system}
                setSystem={setSystem}
              />

              <SystemSelectEmployeeField
                title="Eindverantwoordelijke"
                variable="employeeResponsible"
                editable={employeeFunction == "TEAM_LEADER"}
                system={system}
                setSystem={setSystem}
              />

              {/* <SystemCheckboxField
                title="Schema goedgekeurd"
                variable="schemeApproved"
                editable={employeeFunction == "TEAM_LEADER"}
                system={system}
                setSystem={setSystem}
              />

              <SystemCheckboxField
                title="Specsheet goedgekeurd"
                variable="specsheetApproved"
                editable={employeeFunction == "TEAM_LEADER"}
                system={system}
                setSystem={setSystem}
              /> */}

              <SystemDateField
                title="Afgesproken deadline"
                date={system.agreedDate}
                variable="agreedDate"
                editable={employeeFunction == "TEAM_LEADER"}
                system={system}
                setSystem={setSystem}
              />
              <SystemDateField
                title="Verwachte einddatum"
                date={expectedFinish}
                variable="expectedFinish"
                editable={false}
                system={system}
                setSystem={setSystem}
              />
              <SystemDateField
                title="Dag van levering/installatie"
                date={system.actualDeliveryDate}
                variable="actualDeliveryDate"
                editable={
                  employeeFunction == "TEAM_LEADER" || employeeFunction == "FT"
                }
                system={system}
                setSystem={setSystem}
              />
              <SystemTextArea
                heightCSS="h-36"
                title="Contactgegevens klant"
                text={system.customerContactInformation}
                variable="customerContactInformation"
                editable={
                  employeeFunction == "TEAM_LEADER" || employeeFunction == "FT"
                }
                system={system}
                setSystem={setSystem}
              />
            </div>

            <div className="flex flex-col">
              <SystemSelectStatusField
                title="Status"
                variable="status"
                editable={systemName && true}
                system={system}
                setSystem={setSystem}
              />
              <SystemNumberField
                title="Productiedagen"
                variable="estimatedConstructionDays"
                editable={employeeFunction == "TEAM_LEADER"}
                system={system}
                setSystem={setSystem}
              />
              <SystemSelectEmployeeField
                title="SSP-medewerker"
                variable="employeeSSP"
                editable={employeeFunction == "TEAM_LEADER"}
                system={system}
                setSystem={setSystem}
              />

              <SystemDateField
                title="Startdatum productie"
                date={system.startOfConstruction}
                variable="startOfConstruction"
                editable={
                  (systemName && employeeFunction == "TEAM_LEADER") ||
                  employeeFunction == "SSP"
                }
                system={system}
                setSystem={setSystem}
              />
              <SystemDateField
                title="Einddatum productie"
                date={system.endOfConstruction}
                variable="endOfConstruction"
                editable={
                  (systemName && employeeFunction == "TEAM_LEADER") ||
                  employeeFunction == "SSP"
                }
                system={system}
                setSystem={setSystem}
              />
              <SystemNumberField
                title="Testdagen"
                variable="estimatedTestDays"
                editable={employeeFunction == "TEAM_LEADER"}
                system={system}
                setSystem={setSystem}
              />
              <SystemSelectEmployeeField
                title="FT-medewerker"
                variable="employeeFT"
                editable={employeeFunction == "TEAM_LEADER"}
                system={system}
                setSystem={setSystem}
              />
              <SystemDateField
                title="Startdatum test"
                date={system.startOfTest}
                variable="startOfTest"
                editable={
                  (systemName && employeeFunction == "TEAM_LEADER") ||
                  employeeFunction == "FT"
                }
                system={system}
                setSystem={setSystem}
              />
              <SystemDateField
                title="Einddatum test"
                date={system.endOfTest}
                variable="endOfTest"
                editable={
                  (systemName && employeeFunction == "TEAM_LEADER") ||
                  employeeFunction == "FT"
                }
                system={system}
                setSystem={setSystem}
              />

              <SystemTextField
                title="Verkoper"
                variable="seller"
                editable={employeeFunction == "TEAM_LEADER"}
                system={system}
                setSystem={setSystem}
              />
            </div>
            <div className="flex flex-col">
              <SystemTextArea
                heightCSS="h-48"
                title="Project informatie"
                text={system.projectInformation}
                variable="projectInformation"
                editable={true}
                system={system}
                setSystem={setSystem}
              />
              <SystemTextArea
                heightCSS="h-48"
                title="Notities"
                text={system.notes}
                variable="notes"
                editable={true}
                system={system}
                setSystem={setSystem}
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
          {error && <p className="py-3 text-center text-red-600">{error}</p>}
        </form>
      </div>
    </dialog>
  );
}
