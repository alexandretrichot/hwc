import { useCallback, useMemo, useState } from 'react';
import { IHwcContext } from '../contexts/HwcContext';
import { HwcEvent } from '../models/event.model';
import { Pos } from '../models/pos.model';
import { posToDate } from '../utils/posToDate';
import { roundToQuarterHour, startOfDay } from '../utils/round';

export type UseHwcProps = {
  startDay?: Date;
  daysCount?: number;
  cellHeight?: number;

  events?: HwcEvent[];

  onAddEventRequest?: (ev: HwcEvent) => void;
};

export const useHwc = (props: UseHwcProps = {}): IHwcContext => {
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
  const [startDragDate, setStartDragDate] = useState<Date>();

  const shadowEvent = useMemo<HwcEvent | undefined>(() => {
    if (!startDragDate) return undefined;

    const dates = [
      roundToQuarterHour(startDragDate),
      roundToQuarterHour(date),
    ].sort((a, b) => a.getTime() - b.getTime());

    return {
      startDate: dates[0],
      endDate: dates[1],
    };
  }, [startDragDate, date]);

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
