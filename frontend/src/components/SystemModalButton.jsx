import React, { useState, cloneElement, useEffect } from "react";
import SystemOverview from "./systemOverview/SystemOverview";

export default function SystemModalButton({
  systemName,
  children,
  updateOpenTasks,
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updatable, setUpdatable] = useState(false);

  function handleOpenModal() {
    setUpdatable(true);
    setModalIsOpen(true);
  }

  useEffect(() => {
    if (updateOpenTasks && updatable && !modalIsOpen) {
      updateOpenTasks();
      setUpdatable(false);
    }
  }, [modalIsOpen]);

  return (
    <div>
      <div className="cursor-pointer">
        {React.isValidElement(children) &&
          cloneElement(children, { onClick: handleOpenModal })}
      </div>
      {modalIsOpen && (
        <SystemOverview
          systemName={systemName}
          modalIsOpen={modalIsOpen}
          setModalIsOpen={setModalIsOpen}
        />
      )}
    </div>
  );
}
