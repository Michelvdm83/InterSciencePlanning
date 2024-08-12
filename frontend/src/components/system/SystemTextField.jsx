import { useState } from "react";

export default function SystemTextField({ text, editable, title }) {
  let classes =
    "bg-white text-accent disabled:text-accent input input-sm w-full";
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
      <div>{title}</div>
      <input
        type="text"
        className={classes}
        value={myText}
        onChange={(event) => updateText(event)}
      />
    </div>
  );
}
