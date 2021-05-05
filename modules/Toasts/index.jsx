import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import useSocket from '../../hooks/useSocket';

const types = {
  info: 'rgb(50, 115, 153)',
  moreInfo: '#17181a',
  success: 'rgb(126, 185, 120)',
  error: '#e36c6e',
};

const Toasts = ({ socket, callback }) => {
  const [toasts, setToasts] = useState([]);

  useSocket(socket, 'toaster', (message, arg) => {
    setToasts((prev) => [...prev, message]);
    callback(arg);
  });

  const showToast = toasts.length > 0;

  return (
    <section
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
      }}
    >
      {toasts.map((toast, i) => (
        <Toast
          autohide
          animation
          key={i}
          delay={8000}
          show={showToast}
          onClose={() => setToasts((prev) => prev.filter((_, j) => i !== j))}
        >
          <Toast.Header>
            <span
              style={{
                height: '20px',
                width: '20px',
                borderRadius: '5px',
                marginRight: '5px',
                background: types[toast.type] || types.moreInfo,
              }}
            />
            <strong className="mr-auto">{toast.title}</strong>
          </Toast.Header>
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      ))}
    </section>
  );
};

export default Toasts;
