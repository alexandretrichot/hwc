import React from 'react';
import { useHwcContext } from '../contexts/HwcContext';

export const Debugger: React.FC = () => {
  const { date } = useHwcContext();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        backgroundColor: 'black',
        padding: '8px',
        fontSize: '11px',
        color: 'white',
        fontFamily: 'monospace',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {date.toLocaleString()}
    </div>
  );
};
