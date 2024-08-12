import { useState } from "react";

export default function SystemNumberField({ number, editable, title }) {
  let classes =
    "input input-bordered bg-white text-accent disabled:text-accent input-sm w-full";
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
    if (event.key.match(/[0-9]|Backspace|Delete|Arrow/) === null) {
      event.preventDefault();
    }
  }

  return (
    <div>
      <div>{title}</div>
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
