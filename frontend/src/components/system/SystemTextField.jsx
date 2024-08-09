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

  function getField() {
    if (title === "Notities" || title === "Project informatie") {
      return (
        <textarea
          className={classes + " min-h-40"}
          value={myText}
          onChange={(event) => updateText(event)}
        />
      );
    } else if (title === "Contactgegevens klant") {
      return (
        <textarea
          className={classes}
          value={myText}
          onChange={(event) => updateText(event)}
        />
      );
    } else {
      return (
        <input
          type="text"
          className={classes}
          value={myText}
          onChange={(event) => updateText(event)}
        />
      );
    }
  }

  return (
    <div>
      <div className="max-w-xs">{title}</div>
      {getField()}
    </div>
  );
}
