import React, { useState, cloneElement, useEffect } from "react";
import EditTaskModal from "./EditTaskModal";

export default function TaskModalButton({
  id,
  children,
  updateOpenTasks,
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
        <EditTaskModal
          id={id}
          modalIsOpen={modalIsOpen}
          setModalIsOpen={setModalIsOpen}
          updateOpenTasks={updateOpenTasks}
          functionOnClose={functionOnModalClose}
        />
      )}
    </div>
  );
}
