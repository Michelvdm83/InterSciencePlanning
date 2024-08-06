import { useEffect, useState } from "react";

export default function NewTaskModal() {
  const [taskName, setTaskName] = useState("");
  const [amountOfDays, setAmountOfDays] = useState();

  const handleAmountOfDaysValueChange = (newValue) => {
    if (/^\d*$/.test(newValue)) {
      //check if from beging ^ to end $ of the input string it only consists of numbers \d*
      setAmountOfDays(newValue);
    }
  };

  return (
    <div className="flex flex-col">
      <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
        ✕
      </button>

      <div className="flex flex-col">
        <span>Taaknaam:</span>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <span>verwachte aantal dagen:</span>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          value={amountOfDays}
          onChange={(e) => handleAmountOfDaysValueChange(e.target.value)}
        />
      </div>

      <button className="btn btn-accent w-20 self-center">Save</button>
    </div>
  );
}
