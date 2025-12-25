import React, { useEffect } from 'react';

type Props = {
  message: string;
  duration?: number;
  onClose?: () => void;
};

const Notification = ({ message, duration = 2500, onClose }: Props) => {
  useEffect(() => {
    const id = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(id);
  }, [duration, onClose]);

  const styles: React.CSSProperties = {
    position: 'fixed',
    top: 16,
    left: 16,
    zIndex: 9999,
    background: 'rgba(255,87,34,0.95)',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: 6,
    boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
    fontSize: 14,
    lineHeight: '1.2',
    maxWidth: 'calc(100vw - 40px)',
  };

  return (
    <div role="status" aria-live="polite" style={styles}>
      <strong style={{ display: 'block', marginBottom: 4 }}>
        Connection problem
      </strong>
      <div>{message}</div>
    </div>
  );
};

export default Notification;
