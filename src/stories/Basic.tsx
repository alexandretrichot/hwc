import React, { useState } from 'react';
import { HwcDragPane } from '../components/HwcDragPane';
import { HwcEventsRenderer } from '../components/HwcEventsRenderer';
import { HwcGrid } from '../components/HwcGrid';
import { HwcHeader } from '../components/HwcHeader';
import { HwcProvider } from '../contexts/HwcContext';
import { Debugger } from '../dev/Debugger';
import { useHwc } from '../hooks/useHwc';
import { HwcEvent } from '../models/event.model';

export type BasicProps = {
  daysToShow?: number;
  startDay?: Date;
  cellHeight?: number;
};

export const Basic: React.FC<BasicProps> = ({
  daysToShow,
  startDay,
  cellHeight,
}) => {
  const [events, setEvents] = useState<HwcEvent[]>([]);

  const calendar = useHwc({
    startDay,
    daysCount: daysToShow,
    cellHeight,
    events,
    onAddEventRequest: ev => {
      setEvents([...events, ev]);
    },
  });

  return (
    <HwcProvider value={calendar}>
      <Debugger />
      <div
        className='grid'
        style={{ gridTemplateColumns: `50px minmax(0, 1fr)` }}
      >
        <div />
        <HwcHeader />
      </div>
      <div
        className='grid'
        style={{ gridTemplateColumns: `50px minmax(0, 1fr)` }}
      >
        <div></div>
        <HwcDragPane>
          <HwcGrid />
          <HwcEventsRenderer renderCard={({ style }) => <div className={`bg-slate-100 border border-slate-300 rounded shadow hover:shadow-lg transition-shadow cursor-grab`} style={style}></div>} />
        </HwcDragPane>
      </div>
    </HwcProvider>
  );
};
