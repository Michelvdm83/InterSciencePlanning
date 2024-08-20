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

export default function SystemOverview({ sName, modalIsOpen, setModalIsOpen }) {
  const [expectedFinish, setExpectedFinish] = useState(null);
  const [system, setSystem] = useState("");
  const [error, setError] = useState("");

  const employeeFunction = EmployeeService.getEmployeeFunction();

  useEffect(() => {
    if (sName) {
      const fetchData = async () => {
        const response = await ApiService.get(
          `http://localhost:8080/api/v1/systems/${sName}`,
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
  }, [sName]);

  useEffect(() => {
    if (modalIsOpen) {
      const modal = document.getElementById(sName || "new-system");
      if (modal) {
        modal.showModal();
      }
    }
  }, [modalIsOpen, sName, system]);

  function handleClose() {
    setModalIsOpen(false);
    setSystem("");
  }

  function handleOnKeyDown(e) {
    if (e.key === "Enter") {
      handleNewTaskSave(e);
    }
  }

  function handleSave(e) {
    // check if in editmode (sName is null)

    e.preventDefault();
    if (!system.name || system.name.trim().length === 0) {
      setError("Systeemnaam is verplicht");
      return;
    }

    ApiService.post("systems", system)
      .then(handleClose())
      .catch((error) => {});
    // translate errors
  }

  return (
    <dialog id={sName || "new-system"} className="modal">
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
                title="Po-nummer"
                variable="poNumber"
                editable={employeeFunction == "TEAM_LEADER"}
                system={system}
                setSystem={setSystem}
              />
              <SystemTextField
                title="Systeem type"
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

              <SystemCheckboxField
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
              />

              <SystemDateField
                title="Afgesproken deadline"
                date={system.agreedDate}
                variable="agreedDate"
                editable={false}
                system={system}
                setSystem={setSystem}
              />
              <SystemDateField
                title="Verwachte einddatum"
                date={expectedFinish}
                variable="expectedFinish"
                editable={employeeFunction == "TEAM_LEADER"}
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
            </div>

            <div className="flex flex-col">
              <SystemSelectStatusField
                title="Status"
                variable="status"
                editable={true}
                system={system}
                setSystem={setSystem}
              />

              <SystemSelectEmployeeField
                title="SSP medewerker"
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
                  employeeFunction == "TEAM_LEADER" || employeeFunction == "SSP"
                }
                system={system}
                setSystem={setSystem}
              />
              <SystemNumberField
                title="Productie dagen"
                variable="estimatedConstructionDays"
                editable={employeeFunction == "TEAM_LEADER"}
                system={system}
                setSystem={setSystem}
              />
              <SystemSelectEmployeeField
                title="FT medewerker"
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
                  employeeFunction == "TEAM_LEADER" || employeeFunction == "FT"
                }
                system={system}
                setSystem={setSystem}
              />
              <SystemNumberField
                title="Test dagen"
                variable="estimatedTestDays"
                editable={employeeFunction == "TEAM_LEADER"}
                system={system}
                setSystem={setSystem}
              />
              <SystemTextArea
                heightCSS="h-20"
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
              <SystemTextArea
                heightCSS="h-40"
                title="Project informatie"
                text={system.projectInformation}
                variable="projectInformation"
                editable={true}
                system={system}
                setSystem={setSystem}
              />
              <SystemTextArea
                heightCSS="h-40"
                title="Notities"
                text={system.notes}
                variable="notes"
                editable={true}
                system={system}
                setSystem={setSystem}
              />
              <div className="flex flex-col gap-2">
                <button className="btn btn-primary" onClick={handleClose}>
                  Annuleren
                </button>
                <button className="btn btn-accent" onClick={handleSave}>
                  Opslaan
                </button>
                {error && <p className="text-red-600">{error}</p>}
              </div>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
}
