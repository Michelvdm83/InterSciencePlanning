import { useEffect, useState } from "react";
import SystemModalButton from "../../../components/SystemModalButton";
import ApiService from "../../../services/ApiService";

export default function DelayedSystem({ system, updateOpenTasks }) {
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
    <div className="flex w-3/4 flex-col overflow-auto rounded-md bg-white">
      <div className="flex items-center justify-around p-2">
        <div className="grid h-fit grid-cols-2 px-2">
          <div className="h-fit w-fit text-2xl">
            <SystemModalButton
              systemName={system.name}
              updateOpenTasks={updateOpenTasks}
            >
              <div className="cursor-pointer text-primary">{system.name}</div>
            </SystemModalButton>
          </div>
        </div>

        <div className="flex flex-col justify-end px-2">
          <div className="h-fit overflow-hidden text-ellipsis text-nowrap">
            {system.employeeSSP}
          </div>
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
      </div>

      {affectedSystems.length > 0 && (
        <div className="flex flex-col">
          <div className="divider m-0 w-4/5 self-center"></div>
          <div tabIndex={0} className="collapse collapse-arrow bg-transparent">
            <input type="checkbox" />
            <div className="collapse-title h-fit">
              Mogelijk beïnvloede systemen
            </div>
            <div className="collapse-content">
              {affectedSystems.map((name) => {
                return (
                  <SystemModalButton
                    systemName={name}
                    key={name}
                    updateOpenTasks={updateOpenTasks}
                  >
                    <div className="text-primary">{name}</div>
                  </SystemModalButton>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
