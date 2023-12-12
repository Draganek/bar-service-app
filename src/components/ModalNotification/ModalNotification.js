import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalNotificationButton = ({
    showNotification = false,
    onConfirm,
    onClose,
    confirmation = "Potwierdź",
    cancel = "Anuluj",
    message,
    tittle = "Uwaga",
}) => {

  const handleClose = () => onClose();
  const handleConfirmation = () => {
    onConfirm();
  };



  return (
    <>
      <Modal show={showNotification} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title className="text-danger">{tittle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleClose}>
            {cancel}
          </Button>
          <Button variant="primary" onClick={handleConfirmation}>
            {confirmation}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalNotificationButton;
