import React, { useCallback, useState } from 'react';
import { HwcDragPane } from '../components/HwcDragPane';
import { HwcEventsRenderer } from '../components/HwcEventsRenderer';
import { HwcGrid } from '../components/HwcGrid';
import { HwcHeader } from '../components/HwcHeader';
import { HwcProvider } from '../contexts/HwcContext';
import { Debugger } from '../dev/Debugger';
import { useHwc } from '../hooks/useHwc';
import clsx from 'clsx';
import { HwcEvent } from '../types';

export type BasicProps = {
  daysToShow?: number;
  startDay?: Date;
  cellHeight?: number;
};

type CustomEvent = HwcEvent & {
  title: string;
};

export const Basic: React.FC<BasicProps> = ({
  daysToShow,
  startDay,
  cellHeight,
}) => {
  const [events, setEvents] = useState<CustomEvent[]>([]);

  const addEventHandler = useCallback(
    (ev: HwcEvent) => {
      //const title = prompt('Event name');
      //if (!title) return;

      setEvents([
        ...events,
        {
          ...ev,
          title: 'Event',
        },
      ]);
    },
    [events, setEvents]
  );

  const calendar = useHwc({
    startDay,
    daysCount: daysToShow,
    cellHeight,
    events,
    onAddEventRequest: addEventHandler,
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
          <HwcEventsRenderer<CustomEvent>
            renderCard={({ rect, event, isFirst }) => (
              <div
                className={clsx(
                  'bg-slate-100 border border-slate-300 rounded shadow hover:shadow-lg transition-shadow cursor-grab',
                  'absolute top-px left-px'
                )}
                style={{
                  width: `${rect.width - 3}px`,
                  height: `${rect.height - 3}px`,
                }}
              >
                <div
                  className={clsx(
                    'sticky top-0 p-2',
                    !isFirst && 'text-xs text-black/50'
                  )}
                >
                  {event.title}
                </div>
              </div>
            )}
            renderShadowCard={({ rect }) => (
              <div
                className={clsx(
                  'bg-slate-100 border border-slate-300 rounded shadow-lg opacity-70',
                  'absolute top-px left-px'
                )}
                style={{
                  width: `${rect.width - 3}px`,
                  height: `${rect.height - 3}px`,
                }}
              />
            )}
          />
        </HwcDragPane>
      </div>
      {/* <div className='w-screen h-screen fixed top-0 left-0 bg-slate-500/25' /> */}
    </HwcProvider>
  );
};
