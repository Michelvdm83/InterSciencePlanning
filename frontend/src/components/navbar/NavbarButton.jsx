import React from "react";

export default function NavbarButton({ title, onClick }) {
  return (
    <>
      <div
        className="btn btn-ghost mx-2 h-12 text-xl text-primary-content hover:bg-secondary"
        onClick={onClick}
      >
        {title}
      </div>
    </>
  );
}
