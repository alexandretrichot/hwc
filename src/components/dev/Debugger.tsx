import React from 'react';
import { useMousePos } from '../../hooks/useMousePos';

export const Debugger: React.FC = () => {
  const { date } = useMousePos();

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
      }}
    >
      {date.toJSDate().toLocaleString()}
    </div>
  );
};
