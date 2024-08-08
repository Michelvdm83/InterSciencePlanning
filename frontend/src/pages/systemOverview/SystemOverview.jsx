import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SystemTextField from "../../components/system/SystemTextField";
import SystemDateField from "../../components/system/SystemDateField";
import ApiService from "../../services/ApiService";

export default function SystemOverview() {
  const { systemName } = useParams();
  const [system, setSystem] = useState(null);

  useEffect(() => {
    ApiService.get(`http://localhost:8080/api/v1/systems/${systemName}`).then(
      (response) => {
        setSystem(response.data);
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
            title="systeem: "
            text={system.name}
            editable={false}
          />
          <SystemTextField
            title="po nummer: "
            text={system.poNumber}
            editable={true}
          />
          <SystemTextField
            title="systeemtype: "
            text={system.systemType}
            editable={false}
          />

          <SystemDateField
            title="verwachte leveringsdatum: "
            date={system.estimatedDeliveryDate}
            editable={false}
          />
          <SystemDateField
            title="actuele leveringsdatum: "
            date={system.actualDeliveryDate}
            editable={false}
          />

          <SystemTextField
            title="notities: "
            text={system.notes}
            editable={false}
          />
        </div>
        <div className="flex flex-col content-center">
          <SystemTextField
            title="Klant contactinformatie: "
            text={system.customerContactInformation}
            editable={false}
          />
          <SystemTextField
            title="Project informatie: "
            text={system.projectInformation}
            editable={false}
          />
          <SystemTextField
            title="status: "
            text={system.status}
            editable={false}
          />
        </div>
        <div className="flex flex-col content-center">
          <SystemTextField
            title="Eindverantwoordelijke: "
            text={system.employeeResponsible}
            editable={false}
          />
          <SystemTextField
            title="FT medewerker: "
            text={system.employeeFT}
            editable={false}
          />
          <SystemTextField
            title="SSP medewerker: "
            text={system.employeeSSP}
            editable={false}
          />
        </div>
      </div>
    );
  }

  return getFields();
}

/*
    String name,
    String poNumber,
    String systemType,
    Date estimatedDeliveryDate,
    Date actualDeliveryDate,
    UUID employeeResponsible,
    UUID employeeFT,
    UUID employeeSSP,
    String notes,
    String customerContactInformation,
    String projectInformation,
    Boolean schemeApproved,
    Boolean specsheetApproved,
    String status,
    Boolean delayCheckedBySupervisor
*/
