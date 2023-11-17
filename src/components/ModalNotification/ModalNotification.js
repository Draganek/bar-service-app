import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalNotification = ({
  onConfirm,
  confirmation = "Potwierdź",
  cancel = "Anuluj",
  message,
  tittle = "Uwaga",
  buttonText,
  buttonColor = "danger"
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleConfirmation = () => {
    setShowModal(false);
    onConfirm();
  };

  return (
    <>
      <Button variant={`btn btn-${buttonColor}`} onClick={handleShow}>
        {buttonText}
      </Button>
      <Modal show={showModal} onHide={handleClose}>
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

export default ModalNotification;
