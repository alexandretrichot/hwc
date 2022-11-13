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
      const title = prompt('Event name');
      if (!title) return;

      setEvents([
        ...events,
        {
          ...ev,
          title,
        },
      ]);
    },
    [events, setEvents],
  );

  const updateEventHandler = useCallback(
    (eventIndex: number, newEvent: CustomEvent) => {
      setEvents(
        events.map((ev, index) => (eventIndex === index ? newEvent : ev)),
      );
    },
    [events, setEvents],
  );

  const calendar = useHwc({
    startDay,
    daysCount: daysToShow,
    cellHeight,
    events,
    onAddEvent: addEventHandler,
    onUpdateEvent: updateEventHandler,
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
        className='grid border border-black/30'
        style={{ gridTemplateColumns: `50px minmax(0, 1fr)` }}
      >
        <div>
          {new Array(24).fill(0).map((_, index) => (
            <div
              key={index}
              style={{ height: `${calendar.cellHeight}px` }}
              className='border-t first:border-t-0 border-t-black/30 border-r border-r-black/30 text-right p-2'
            >
              {index + 1}h
            </div>
          ))}
        </div>
        <HwcDragPane>
          <HwcGrid
            renderCell={({ style, date }) => (
              <div
                style={style}
                className={clsx(
                  (date.getHours() + 1 === 12 || date.getHours() + 1 === 13) &&
                    'bg-black/5',
                )}
              />
            )}
          />
          <HwcEventsRenderer<CustomEvent>
            renderCard={({ rect, event, isFirst }) => (
              <div
                className={clsx(
                  'bg-slate-100 border border-slate-300 rounded shadow hover:shadow-lg transition-shadow cursor-grab',
                  'absolute top-px left-px',
                )}
                style={{
                  width: `${rect.width - 3}px`,
                  height: `${rect.height - 3}px`,
                }}
              >
                <div
                  className={clsx(
                    'sticky top-0 p-2',
                    !isFirst && 'text-xs text-black/50',
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
                  'absolute top-px left-px',
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
    </HwcProvider>
  );
};
