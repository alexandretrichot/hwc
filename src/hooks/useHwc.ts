import { useCallback, useMemo, useState } from 'react';
import { IHwcContext } from '../contexts/HwcContext';
import { Pos, HwcEvent } from '../types';
import { posToDate } from '../utils/posToDate';
import { startOfDay } from '../utils/round';
import { useMoveEvent } from './useMoveEvent';
import { useShadowEvent } from './useShadowEvent';

export type UseHwcProps<EvType extends HwcEvent> = {
  startDay?: Date;
  daysCount?: number;
  cellHeight?: number;

  events?: EvType[];

  onAddEventRequest?: (ev: HwcEvent) => void;
  onEventMove?: (index: number, newEvent: EvType, lastEvent: EvType) => void;
};

export const useHwc = <EvType extends HwcEvent>(
  props: UseHwcProps<EvType> = {}
): IHwcContext<EvType> => {
  const {
    startDay = new Date(),
    cellHeight = 50,
    daysCount = 7,
    events = [],
    onAddEventRequest = () => {},
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

  const {} = useMoveEvent();
  
  // handlers
  const requestAddEventHandler = useCallback(
    (ev: HwcEvent) => {
      onAddEventRequest(ev);
    },
    [onAddEventRequest]
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

    shadowEvent,
    setStartDragDate,
    requestAddEventHandler,
  };
};
