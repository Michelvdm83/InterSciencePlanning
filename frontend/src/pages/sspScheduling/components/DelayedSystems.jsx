import { useEffect, useState } from "react";
import ApiService from "../../../services/ApiService";
import DelayedSystem from "./DelayedSystem";

export default function DelayedSystems({ openTasks, updateOpenTasks }) {
  const [uncheckedDelays, setUncheckedDelays] = useState([]);

  useEffect(() => {
    ApiService.get("systems/delayed").then((response) => {
      setUncheckedDelays(response.data);
    });
  }, [openTasks]);
  return (
    <div className="m-4 flex w-1/3 flex-col items-center gap-2 rounded-md bg-neutral">
      <div className="flex w-full justify-between border-b-2 border-black">
        <h2 className="px-8 py-4 font-Effra_Bd text-xl text-secondary">
          Vertraagde systemen
        </h2>
      </div>
      {uncheckedDelays.length > 0 &&
        uncheckedDelays.map((system) => (
          <DelayedSystem
            system={system}
            updateOpenTasks={updateOpenTasks}
            key={system.name}
          />
        ))}
    </div>
  );
}
