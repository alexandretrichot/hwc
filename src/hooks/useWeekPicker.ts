import { useCallback, useMemo, useState } from 'react';
import { IWeekPickerContext } from '../contexts/WeekPickerContext';
import { Event } from '../models/event.model';
import { Pos } from '../models/pos.model';
import { posToDate } from '../utils/posToDate';
import { roundToQuarterHour } from '../utils/round';

export type WeekPickerProps = {
  startDay?: Date;
  daysCount?: number;
  cellHeight?: number;

  events?: Event[];

  onAddEventRequest?: (ev: Event) => void;
};

export const useWeekPicker = (props: WeekPickerProps = {}): IWeekPickerContext => {
  const { startDay = new Date(), cellHeight = 50, daysCount = 7, events = [], onAddEventRequest = () => {} } = props;

  // column witdh
  const [width, setWidth] = useState(0);
  const cellWidth = useMemo(() => width / daysCount, [width, daysCount]);

  // mouse position and date
  const [pos, setPos] = useState<Pos>([0, 0]);
  const date = useMemo(() => posToDate(pos, width, startDay, cellHeight), [pos]);

  // shadow event
  const [startDragDate, setStartDragDate] = useState<Date>();

  const shadowEvent = useMemo<Event | undefined>(() => {
    if (!startDragDate) return undefined;

    const dates = [roundToQuarterHour(startDragDate), roundToQuarterHour(date)].sort((a, b) => a.getTime() - b.getTime());

    return {
      startDate: dates[0],
      endDate: dates[1],
    };
  }, [startDragDate, date]);

  const requestAddEventHandler = useCallback(
    (ev: Event) => {
      onAddEventRequest(ev);
    },
    [onAddEventRequest]
  );

  return {
    pos,
    date,
    cellWidth,
    cellHeight,

    startDay,
    daysCount,

    events,

    setPos,
    setWidth,

    shadowEvent,
    setStartDragDate,
    requestAddEventHandler,
  };
};
