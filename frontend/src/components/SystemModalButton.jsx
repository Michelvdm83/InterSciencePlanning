import React, { useState, cloneElement, useEffect } from "react";
import SystemOverview from "./systemOverview/SystemOverview";

export default function SystemModalButton({
  systemName,
  children,
  functionOnModalClose,
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function handleOpenModal() {
    setModalIsOpen(true);
  }

  return (
    <div>
      <div className="cursor-pointer">
        {React.isValidElement(children) &&
          cloneElement(children, { onClick: handleOpenModal })}
      </div>
      {modalIsOpen && (
        <SystemOverview
          functionOnClose={functionOnModalClose}
          systemName={systemName}
          modalIsOpen={modalIsOpen}
          setModalIsOpen={setModalIsOpen}
        />
      )}
    </div>
  );
}
