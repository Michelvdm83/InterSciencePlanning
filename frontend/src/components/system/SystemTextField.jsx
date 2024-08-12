import { useState } from "react";

export default function SystemTextField({ text, editable, title }) {
  let classes =
    "input input-bordered bg-white max-w-md text-accent disabled:text-accent";
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
          className={classes + " min-h-40 resize-none"}
          value={myText}
          onChange={(event) => updateText(event)}
        />
      );
    } else if (title === "Contactgegevens klant") {
      return (
        <textarea
          className={classes + " min-h-20 resize-none"}
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
      <div className="label max-w-xs">{title}</div>
      {getField()}
    </div>
  );
}
