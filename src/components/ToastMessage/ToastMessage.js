import React, { useState, useEffect } from "react";
import { Toast } from "react-bootstrap";

function ToastMessage({
  time = 5,
  text = "Twój token użytkownika się wyczerpał. aby go odnowić zaloguj się ponownie.",
  small = "Hej pst... małe info",
  isActive,
  onToggle,
}) {
  const [show, setShow] = useState(isActive);

  useEffect(() => {
    setShow(isActive);
  }, [isActive]);

  const toggleShow = () => {
    setShow(!show);
    if (onToggle) {
      onToggle(!show);
    }
  };

  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => {
        toggleShow();
      }, time * 1000);

      return () => clearTimeout(timeout);
    }
  }, [show, time]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "relative",
        minHeight: "100px",
      }}
    >
      <Toast
        show={show}
        className="bg-info text-light"
        delay={time * 1000}
        onClose={toggleShow}
        autohide
        style={{
          position: "absolute",
          top: 0,
          right: 0,
        }}
      >
        <Toast.Header closeButton={false}>
          <strong className="mr-auto">DraganBar</strong>
          <small>{small}</small>
        </Toast.Header>
        <Toast.Body>{text}</Toast.Body>
      </Toast>
    </div>
  );
}

export default ToastMessage;
