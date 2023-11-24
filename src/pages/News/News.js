import React, { useState } from 'react';
import ToastMessage from '../../components/ToastMessage/ToastMessage';

const News = () => {
  const [toastActive, setToastActive] = useState(false);

  const handleToggleToast = () => {
    setToastActive(!toastActive);
  };

  return (
    <div class="dropdown">
      <h1>Tu możliwe że będą newsy</h1>

      <button onClick={handleToggleToast}>Show Toast</button>
      <ToastMessage
        isActive={toastActive}
        onToggle={handleToggleToast}
      />
    </div>
  );
};

export default News;
