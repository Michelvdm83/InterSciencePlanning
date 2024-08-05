import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SystemTextField from "../../components/system/SystemTextField";
import SystemDateField from "../../components/system/SystemDateField";

export default function SystemOverview() {
  const { systemId } = useParams();
  const [system, setSystem] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/systems/${systemId}`)
      .then((response) => {
        console.log(response);
        console.log(typeof response.data.estimatedDeliveryDate);
        setSystem(response.data);
      });
  }, []);

  function getFields() {
    if (system === null) {
      return <></>;
    }
    return (
      <div className="flex w-full flex-col content-center justify-center">
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
        <SystemTextField
          text={system.customerContactInformation}
          editable={false}
        />
        <SystemTextField text={system.projectInformation} editable={false} />
        <SystemTextField text={system.status} editable={false} />
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
