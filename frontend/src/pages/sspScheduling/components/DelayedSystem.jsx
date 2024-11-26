import SystemModalButton from "../../../components/SystemModalButton";

export default function DelayedSystem({ system, setUncheckedDelays }) {
  return (
    <div className="grid h-12 w-3/4 grid-rows-2 justify-between rounded-md bg-white">
      <div className="grid h-fit grid-cols-2 px-2">
        <div className="h-fit w-fit">
          <SystemModalButton systemName={system.name}>
            <div className="cursor-pointer text-primary">{system.name}</div>
          </SystemModalButton>
        </div>
        <div className="h-fit overflow-hidden text-ellipsis text-nowrap">
          {/*checkbox voor gecontroleerd */}
          {system.employeeSSP}
        </div>
      </div>

      <div className="collapse collapse-arrow h-fit px-2 text-center">
        {/*dropdown met systemen waar dit effect op heeft */}
        <div className="collapse-title">heeft invloed op:</div>
      </div>
    </div>
  );
}
