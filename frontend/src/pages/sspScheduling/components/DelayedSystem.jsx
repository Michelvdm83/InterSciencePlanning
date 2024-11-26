import { useEffect, useState } from "react";
import SystemModalButton from "../../../components/SystemModalButton";
import ApiService from "../../../services/ApiService";

export default function DelayedSystem({ system, setUncheckedDelays }) {
  const [affectedSystems, setAffectedSystems] = useState([]);

  function updateChecked(event) {
    ApiService.patch("/systems/delayed", {
      systemName: system.name,
      checked: event.target.checked,
    });
  }

  useEffect(() => {
    setAffectedSystems(system.affectedSystems);
  }, [system]);

  return (
    <div className="flex w-3/4 flex-col justify-around overflow-auto rounded-md bg-white">
      <div className="grid h-fit grid-cols-2 px-2">
        <div className="h-fit w-fit">
          <SystemModalButton systemName={system.name}>
            <div className="cursor-pointer text-primary">{system.name}</div>
          </SystemModalButton>
        </div>
        <div className="h-fit overflow-hidden text-ellipsis text-nowrap">
          {system.employeeSSP}
        </div>
      </div>

      <div className="flex justify-end px-2">
        <label className="label w-1/2 cursor-pointer gap-1">
          <span className="label-text">Gecontroleerd:</span>
          <input
            type="checkbox"
            defaultChecked={false}
            className="checkbox checkbox-md"
            onChange={updateChecked}
          />
        </label>
      </div>

      {affectedSystems.length > 0 && (
        <div tabIndex={0} className="collapse collapse-arrow bg-transparent">
          <input type="checkbox" />
          <div className="collapse-title h-fit">
            Mogelijk beïnvloede systemen
          </div>
          <div className="collapse-content">
            {affectedSystems.map((name) => {
              return (
                <SystemModalButton systemName={name}>
                  <div className="text-primary">{name}</div>
                </SystemModalButton>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
