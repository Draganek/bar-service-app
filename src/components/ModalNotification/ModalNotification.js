import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalNotification = ({
  showNotification = false,
  type = "notification",
  onConfirm,
  onClose,
  confirmation = "Potwierdź",
  closeButtonMessage = "Anuluj",
  closeButtonColor = "warning",
  message,
  tittle = "Uwaga",
  tittleColor = "danger"
}) => {

  const handleClose = () => onClose();
  const handleConfirmation = () => {
    onConfirm();
  };



  return (
    <>
      <Modal show={showNotification} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title className={`text-${tittleColor}`}>{tittle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant={closeButtonColor} onClick={handleClose}>
            {closeButtonMessage}
          </Button>
          {type !== "notification" && (<Button variant="primary" onClick={handleConfirmation}>
            {confirmation}
          </Button>)}

        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalNotification;
