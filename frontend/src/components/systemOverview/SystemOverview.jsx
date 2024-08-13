import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SystemTextField from "./components/SystemTextField.jsx";
import SystemDateField from "./components/SystemDateField.jsx";
import ApiService from "../../services/ApiService.js";
import EmployeeService from "../../services/EmployeeService.js";
import SystemCheckboxField from "./components/SystemCheckBoxField.jsx";
import SystemSelectStatusField from "./components/SystemSelectStatusField.jsx";
import SystemSelectEmployeeField from "./components/SystemSelectEmployeeField.jsx";
import SystemNumberField from "./components/SystemNumberField.jsx";
import SystemTextArea from "./components/SystemTextArea.jsx";

export default function SystemOverview({ sName }) {
  const { systemName } = useParams();
  const [expectedFinish, setExpectedFinish] = useState(null);
  const [system, setSystem] = useState(null);
  const employeeFunction = EmployeeService.getEmployeeFunction();

  useEffect(() => {
    ApiService.get(
      `http://localhost:8080/api/v1/systems/${systemName ? systemName : sName}`,
    ).then((response) => {
      setSystem(response.data);

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
    });
  }, []);

  function getFields() {
    if (system === null) {
      return <></>;
    }
    return (
      <div className="flex h-full w-full justify-evenly overflow-hidden bg-neutral p-9">
        <div className="flex h-full flex-col">
          <SystemTextField
            title="Systeem"
            text={system.name}
            editable={employeeFunction == "TEAM_LEADER"}
          />
          <SystemTextField
            title="Po-nummer"
            text={system.poNumber}
            editable={employeeFunction == "TEAM_LEADER"}
          />
          <SystemTextField
            title="Systeem type"
            text={system.systemType}
            editable={employeeFunction == "TEAM_LEADER"}
          />

          <SystemSelectEmployeeField
            title="Eindverantwoordelijke"
            employeeName={system.employeeResponsible}
            editable={employeeFunction == "TEAM_LEADER"}
          />

          <SystemCheckboxField
            title="Schema goedgekeurd"
            defaultValue={system.schemeApproved}
            editable={employeeFunction == "TEAM_LEADER"}
          />

          <SystemCheckboxField
            title="Specsheet goedgekeurd"
            defaultValue={system.specsheetApproved}
            editable={employeeFunction == "TEAM_LEADER"}
          />

          <SystemDateField
            title="Afgesproken deadline"
            date={system.agreedDate}
            editable={false}
          />
          <SystemDateField
            title="Verwachte einddatum"
            date={expectedFinish}
            editable={false}
          />
          <SystemDateField
            title="Dag van levering/installatie"
            date={system.actualDeliveryDate}
            editable={employeeFunction == "TEAM_LEADER"}
          />
        </div>

        <div className="flex flex-col">
          <SystemSelectStatusField
            title="Status"
            defaultValue={system.status}
            editable={true}
          />

          <SystemSelectEmployeeField
            title="SSP medewerker"
            employeeName={system.employeeSSP}
            editable={employeeFunction == "TEAM_LEADER"}
          />

          <SystemDateField
            title="Startdatum productie"
            date={system.startOfConstruction}
            editable={
              employeeFunction == "TEAM_LEADER" || employeeFunction == "SSP"
            }
          />
          <SystemNumberField
            title="Productie dagen"
            number={system.estimatedConstructionDays}
            editable={employeeFunction == "TEAM_LEADER"}
          />
          <SystemSelectEmployeeField
            title="FT medewerker"
            employeeName={system.employeeFT}
            editable={employeeFunction == "TEAM_LEADER"}
          />
          <SystemDateField
            title="Startdatum test"
            date={system.startOfTest}
            editable={
              employeeFunction == "TEAM_LEADER" || employeeFunction == "FT"
            }
          />
          <SystemNumberField
            title="Test dagen"
            number={system.estimatedTestDays}
            editable={employeeFunction == "TEAM_LEADER"}
          />
          <SystemTextArea
            heightCSS="h-20"
            title="Contactgegevens klant"
            text={system.customerContactInformation}
            editable={
              employeeFunction == "TEAM_LEADER" || employeeFunction == "FT"
            }
          />
        </div>
        <div className="flex flex-col">
          <SystemTextArea
            heightCSS="h-40"
            title="Project informatie"
            text={system.projectInformation}
            editable={true}
          />
          <SystemTextArea
            heightCSS="h-40"
            title="Notities"
            text={system.notes}
            editable={true}
          />
        </div>
      </div>
    );
  }

  return getFields();
}
