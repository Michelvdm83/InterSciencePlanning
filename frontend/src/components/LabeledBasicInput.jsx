import React from "react";

export default function LabeledBasicInput({ label, type, value, onChange }) {
  return (
    <div className="w-full">
      <label className="label flex flex-col items-start px-0">
        {label}
        <input
          className="input input-bordered mt-2 w-full"
          type={type}
          value={value}
          onChange={onChange}
        />
      </label>
    </div>
  );
}
