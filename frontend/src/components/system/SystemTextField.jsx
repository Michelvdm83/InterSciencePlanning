import { useState } from "react";

export default function SystemTextField({ text, editable, title }) {
  let classes = "input input-bordered bg-white max-w-md";
  if (!editable) {
    classes += " input-disabled";
  }

  const [myText, setMyText] = useState(text ? text : "");

  function updateText(event) {
    if (editable) {
      setMyText(event.target.value);
    }
  }

  return (
    <div>
      <div className="max-w-xs">{title}</div>
      <input
        type="text"
        className={classes}
        value={myText}
        onChange={(event) => updateText(event)}
      />
    </div>
  );
}
