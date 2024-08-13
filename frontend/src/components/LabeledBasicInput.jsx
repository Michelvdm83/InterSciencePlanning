import React from "react";

export default function LabeledBasicInput({ label, type, value, onChange }) {
  return (
    <div className="w-full">
      <label className="label">{label}</label>
      <input
        className="input input-bordered w-full"
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
