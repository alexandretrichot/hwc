import { useCallback, useMemo, useState } from 'react';
import { IRhwcContext } from '../contexts/RhwcContext';
import { RhwcEvent } from '../models/event.model';
import { Pos } from '../models/pos.model';
import { posToDate } from '../utils/posToDate';
import { roundToQuarterHour, startOfDay } from '../utils/round';

export type UseRhwcProps = {
  startDay?: Date;
  daysCount?: number;
  cellHeight?: number;

  events?: RhwcEvent[];

  onAddEventRequest?: (ev: RhwcEvent) => void;
};

export const useRhwc = (props: UseRhwcProps = {}): IRhwcContext => {
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
    () => posToDate(pos, width, normalizedStartDay, cellHeight),
    [pos, width, normalizedStartDay, cellHeight]
  );

  // shadow event
  const [startDragDate, setStartDragDate] = useState<Date>();

  const shadowEvent = useMemo<RhwcEvent | undefined>(() => {
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
    (ev: RhwcEvent) => {
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
