import { useState } from "react";
import SystemTextField from "./SystemTextField";

export default function SystemDateField({ date, editable, title }) {
  function getField() {
    if (editable) {
      return (
        <div>
          <div className="max-w-xs">{title}</div>
          <input type="date" defaultValue={date} className="input max-w-md" />
        </div>
      );
    }

    return (
      <div>
        <div className="max-w-xs">{title}</div>
        <SystemTextField text={date} editable={false} />
      </div>
    );
  }

  return getField();
}
