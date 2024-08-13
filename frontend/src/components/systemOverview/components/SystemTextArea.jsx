import { useState } from "react";

export default function SystemTextArea({ text, editable, title, heightCSS }) {
  let classes =
    "bg-white text-accent disabled:text-accent resize-none input w-full " +
    heightCSS;
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
      <textarea
        className={classes}
        value={myText}
        onChange={(event) => updateText(event)}
      />
    </div>
  );
}
