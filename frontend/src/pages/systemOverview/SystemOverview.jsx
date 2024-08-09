import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SystemTextField from "../../components/system/SystemTextField";
import SystemDateField from "../../components/system/SystemDateField";
import ApiService from "../../services/ApiService";
import EmployeeService from "../../services/EmployeeService";
import SystemCheckboxField from "../../components/system/SystemCheckBoxField";

export default function SystemOverview() {
  const { systemName } = useParams();
  const [expectedFinish, setExpectedFinish] = useState(null);
  const [system, setSystem] = useState(null);
  const employeeFunction = EmployeeService.getEmployeeFunction();

  useEffect(() => {
    ApiService.get(`http://localhost:8080/api/v1/systems/${systemName}`).then(
      (response) => {
        setSystem(response.data);

        const expected = new Date();
        const buildTime = response.data.estimatedConstructionDays
          ? response.data.estimatedConstructionDays
          : 0;
        const addedDate = new Date(
          expected.setDate(expected.getDate() + buildTime),
        );
        let expectedDate = addedDate.toISOString().split("T")[0];

        setExpectedFinish(expectedDate);
      },
    );
  }, []);

  function getFields() {
    if (system === null) {
      return <></>;
    }
    return (
      <div className="flex w-full justify-evenly">
        <div className="flex flex-col content-center">
          <SystemTextField
            title="systeem"
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

          <SystemTextField
            title="Eindverantwoordelijke"
            text={system.employeeResponsible}
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

        <div className="flex flex-col content-center">
          <SystemTextField
            title="status"
            text={system.status}
            editable={true}
          />
          <SystemTextField
            title="SSP medewerker"
            text={system.employeeSSP}
            editable={employeeFunction == "TEAM_LEADER"}
          />
          <SystemDateField
            title="Startdatum productie"
            date={system.startOfConstruction}
            editable={
              employeeFunction == "TEAM_LEADER" || employeeFunction == "SSP"
            }
          />
          <SystemTextField
            title="Productie dagen"
            text={system.estimatedConstructionDays}
            editable={employeeFunction == "TEAM_LEADER"}
          />
          <SystemTextField
            title="FT medewerker"
            text={system.employeeFT}
            editable={employeeFunction == "TEAM_LEADER"}
          />
          <SystemDateField
            title="Startdatum productie"
            date={
              /*system.startOfConstruction*/ new Date()
                .toISOString()
                .split("T")[0]
            }
            editable={
              employeeFunction == "TEAM_LEADER" || employeeFunction == "FT"
            }
          />
          <SystemTextField
            title="Test dagen"
            text={system.estimatedTestDays}
            editable={employeeFunction == "TEAM_LEADER"}
          />
          <SystemTextField
            title="Contactgegevens klant"
            text={system.customerContactInformation}
            editable={
              employeeFunction == "TEAM_LEADER" || employeeFunction == "FT"
            }
          />
        </div>
        <div className="flex flex-col content-center">
          <SystemTextField
            title="Project informatie"
            text={system.projectInformation}
            editable={true}
          />
          <SystemTextField
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
