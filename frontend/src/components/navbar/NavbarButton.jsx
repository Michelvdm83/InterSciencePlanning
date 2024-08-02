import React from "react";

export default function NavbarButton({ title, onClick }) {
  return (
    <>
      <div
        className="btn btn-ghost mx-2 text-xl text-primary-content"
        onClick={onClick}
      >
        {title}
      </div>
    </>
  );
}
