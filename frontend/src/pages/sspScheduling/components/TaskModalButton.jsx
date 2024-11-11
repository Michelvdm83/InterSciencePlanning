import React, { useState, cloneElement, useEffect } from "react";
import EditTaskModal from "./EditTaskModal";

export default function TaskModalButton({ id, children, updateOpenTasks }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function handleOpenModal() {
    setModalIsOpen(true);
  }

  useEffect(() => {
    if (updateOpenTasks) {
      updateOpenTasks();
    }
  }, [modalIsOpen]);

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
        />
      )}
    </div>
  );
}