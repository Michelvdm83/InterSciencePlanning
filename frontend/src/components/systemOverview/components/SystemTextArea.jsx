import React from "react";

const SystemTextArea = React.forwardRef(
  ({ editable, title, heightCSS, system, setSystem, variable }, ref) => {
    let classes =
      "bg-white text-accent disabled:text-accent resize-none input w-full " +
      heightCSS;
    if (!editable) {
      classes += " input-disabled";
    }

    return (
      <div>
        <div>{title}</div>
        <textarea
          ref={ref}
          className={classes}
          value={system[variable] || ""}
          onChange={(event) =>
            setSystem({ ...system, [variable]: event.target.value })
          }
          disabled={!editable}
          spellCheck="false"
        />
      </div>
    );
  },
);

export default SystemTextArea;
