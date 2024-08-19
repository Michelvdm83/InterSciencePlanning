import React, { useState, cloneElement } from "react";
import SystemOverview from "./systemOverview/SystemOverview";

export default function SystemModalButton({ systemName, children }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function handleOpenModal() {
    setModalIsOpen(true);
  }

  return (
    <div className="cursor-pointer">
      {React.isValidElement(children) &&
        cloneElement(children, { onClick: handleOpenModal })}

      {modalIsOpen && (
        <SystemOverview
          sName={systemName}
          modalIsOpen={modalIsOpen}
          setModalIsOpen={setModalIsOpen}
        />
      )}
    </div>
  );
}
