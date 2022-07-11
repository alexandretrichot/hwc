import { DAY_IN_MILLIS, MINUTE_IN_MILLIS } from '../constants';
import { Pos } from '../models/pos.model';

export const posToDate = (
  pos: Pos,
  width: number,
  startDay: Date,
  hourHeight: number,
  daysCount: number,
): Date => {
  const minuteHeight = 60 / hourHeight;
  const minutesDay = pos.y * minuteHeight;

  const dayInGrid = Math.trunc((pos.x / (width || 1)) * daysCount);

  return new Date(
    startDay.getTime() +
      dayInGrid * DAY_IN_MILLIS +
      minutesDay * MINUTE_IN_MILLIS
  );
};
