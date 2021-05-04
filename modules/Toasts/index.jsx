import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import useSocket from '../../hooks/useSocket';

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
          delay={10000}
          show={showToast}
          onClose={() => setToasts((prev) => prev.filter((_, j) => i !== j))}
        >
          <Toast.Header>
            <strong className="mr-auto">{toast.title}</strong>
          </Toast.Header>
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      ))}
    </section>
  );
};

export default Toasts;
