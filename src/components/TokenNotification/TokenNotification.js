import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import useAuth from "../../hooks/useAuth";

const TokenNotification = ({
    showNotification = false,
    onClose,
}) => {
    const history = useHistory();
    const [auth, setAuth] = useAuth();

    const handleClose = () => onClose();

    const handleConfirmation = () => {
        setAuth(false);
        handleClose()
        history.push("/zaloguj")
};

return (
    <>
        <Modal show={showNotification} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title className="text-danger">Psst... małe {(<span style={{fontSize: "0.7rem"}}>info</span>)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>Twój token użytkownika się wyczerpał. aby go odnowić zaloguj się ponownie.</Modal.Body>
            <Modal.Footer>
                <Button variant="warning" onClick={handleClose}>
                Anuluj
                </Button>
                <Button variant="primary" onClick={handleConfirmation}>
                    Zaloguj ponownie
                </Button>
            </Modal.Footer>
        </Modal>
    </>
);
};

export default TokenNotification;
