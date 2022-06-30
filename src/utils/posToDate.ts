import { DAY_IN_MILLIS, MINUTE_IN_MILLIS } from '../constants';
import { Pos } from '../models/pos.model';

export const posToDate = (pos: Pos, width: number, startDay: Date, hourHeight: number): Date => {
  const minuteHeight = 60 / hourHeight;
  const minutesDay = pos[1] * minuteHeight;

  const dayInGrid = Math.trunc((pos[0] / (width || 1)) * 7);

  return new Date(startDay.getTime() + dayInGrid * DAY_IN_MILLIS + minutesDay * MINUTE_IN_MILLIS);
};
