import React from 'react';

const Spinner: React.FC = () => (
  <div
    className="spinner"
    style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}
  >
    <div
      className="spinner__dot"
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: '#ff9000',
        animation: 'spinner-pulse 1s infinite',
      }}
    />
    <style>
      {
        '@keyframes spinner-pulse { 0% { transform: scale(1); opacity: 1 } 50% { transform: scale(1.3); opacity: 0.7 } 100% { transform: scale(1); opacity: 1 } }'
      }
    </style>
  </div>
);

export default Spinner;
