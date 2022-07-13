import { useCallback, useMemo, useState } from 'react';
import { GripPosition } from '../components/GripRenderer';
import { IHwcContext } from '../contexts/HwcContext';
import { Pos, HwcEvent } from '../types';
import { posToDate } from '../utils/posToDate';
import { startOfDay } from '../utils/round';
import { useMoveEvent } from './useMoveEvent';
import { useResizeEvent } from './useResizeEvent';
import { useShadowEvent } from './useShadowEvent';

export type UseHwcProps<EvType extends HwcEvent> = {
  startDay?: Date;
  daysCount?: number;
  cellHeight?: number;

  events?: EvType[];

  onAddEvent?: (ev: HwcEvent) => void;
  onUpdateEvent?: (
    eventIndex: number,
    newEvent: EvType,
    previousEvent: EvType
  ) => void;
};

export const useHwc = <EvType extends HwcEvent>(
  props: UseHwcProps<EvType> = {}
): IHwcContext<EvType> => {
  const {
    startDay = new Date(),
    cellHeight = 50,
    daysCount = 7,
    events = [],
    onAddEvent = () => {},
    onUpdateEvent = () => {},
  } = props;

  const normalizedStartDay = useMemo(() => startOfDay(startDay), [startDay]);

  // column witdh
  const [width, setWidth] = useState(0);
  const cellWidth = useMemo(() => width / daysCount, [width, daysCount]);

  // mouse position and date
  const [pos, setPos] = useState<Pos>({ x: 0, y: 0 });
  const date = useMemo(
    () => posToDate(pos, width, normalizedStartDay, cellHeight, daysCount),
    [pos, width, normalizedStartDay, cellHeight, daysCount]
  );

  // shadow event
  const [shadowEvent, setStartDragDate] = useShadowEvent(date);

  // move and resize
  const internalUpdateEventHandler = useCallback(
    (evIndex: number, newEvent: HwcEvent) => {
      const ev = events[evIndex];

      if (
        ev.startDate.getTime() !== newEvent.startDate.getTime() ||
        ev.endDate.getTime() !== newEvent.endDate.getTime()
      )
        onUpdateEvent(
          evIndex,
          {
            ...ev,
            ...newEvent,
          },
          ev
        );
    },
    [events, onUpdateEvent]
  );

  const [setEventMoving] = useMoveEvent(date, internalUpdateEventHandler);
  const [setEventResizing] = useResizeEvent(date, internalUpdateEventHandler);

  // handlers
  const addEventHandler = useCallback((ev: HwcEvent) => onAddEvent(ev), [
    onAddEvent,
  ]);

  const updateEventHandler = useCallback(
    (eventIndex: number, newEvent: EvType, previousEvent: EvType) =>
      onUpdateEvent(eventIndex, newEvent, previousEvent),
    [onUpdateEvent]
  );

  const setEventMovingHandler = useCallback(
    (evIndex?: number) => {
      setEventMoving(
        evIndex !== undefined ? events[evIndex] : undefined,
        evIndex
      );
    },
    [setEventMoving, events]
  );

  const setEventResizingHandler = useCallback(
    (evIndex?: number, grip?: GripPosition) => {
      setEventResizing(
        evIndex !== undefined ? events[evIndex] : undefined,
        evIndex,
        evIndex !== undefined ? grip : undefined
      );
    },
    [setEventResizing, events]
  );

  return {
    pos,
    date,
    cellWidth,
    cellHeight,

    startDay: normalizedStartDay,
    daysCount,

    events,

    setPos,
    setWidth,

    setEventMoving: setEventMovingHandler,
    setEventResizing: setEventResizingHandler,

    shadowEvent,
    setStartDragDate,
    addEvent: addEventHandler,
    updateEvent: updateEventHandler,
  };
};
