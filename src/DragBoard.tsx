import { DateTime } from 'luxon';
import React, { useContext, useMemo, useState } from 'react';
import { useMeasure } from 'react-use';
import { posToDate } from './utils/posToDate';
import { roundToQuarterHour } from './utils/round';

export type IMousePosContext = {
  pos: Pos;
  date: DateTime;
};

export const MousePosContext = React.createContext<IMousePosContext | null>(null);

export type DragBoardProps = {
  weekStartDay: DateTime;
  hourHeight: number;
  children?: React.ReactNode;
};

export const DragBoard: React.FC<DragBoardProps> = ({ children, weekStartDay, hourHeight }) => {
  const [mousePos, setMousePos] = useState<Pos>([0, 0]);
  const [ref, { width }] = useMeasure<HTMLDivElement>();

  const mouseMoveHandler: React.MouseEventHandler<HTMLDivElement> = (ev) => {
    const offset = ev.currentTarget.getBoundingClientRect();
    setMousePos([ev.clientX - offset.left, ev.clientY - offset.top]);
  };

  const date = useMemo(() => roundToQuarterHour(posToDate(mousePos, width, weekStartDay, hourHeight)), [mousePos]);

  return (
    <div ref={ref} onMouseMove={mouseMoveHandler}>
      <MousePosContext.Provider
        value={{
          pos: mousePos,
          date: date,
        }}
      >
        {children}
      </MousePosContext.Provider>
    </div>
  );
};
