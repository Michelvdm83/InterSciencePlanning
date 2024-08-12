import { useState } from "react";

export default function SystemNumberField({ number, editable, title }) {
  let classes =
    "input input-bordered bg-white max-w-md text-accent disabled:text-accent";
  if (!editable) {
    classes += " input-disabled";
  }

  const [myNumber, setMyNumber] = useState(number ? number : "");

  function updateNumber(event) {
    if (editable) {
      setMyNumber(event.target.value);
    }
  }

  function checkKeyPressed(event) {
    if (event.key == "," || event.key == ".") {
      event.preventDefault();
    }
  }

  return (
    <div>
      <div className="label max-w-xs">{title}</div>
      <input
        type="number"
        className={classes}
        value={myNumber}
        onChange={(event) => updateNumber(event)}
        onKeyDown={(event) => checkKeyPressed(event)}
      />
    </div>
  );
}
