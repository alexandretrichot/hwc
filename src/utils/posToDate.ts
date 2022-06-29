import { DateTime } from 'luxon';
import { Pos } from '../models/pos.model';

export const posToDate = (pos: Pos, width: number, startDay: Date, hourHeight: number): Date => {
  const minuteHeight = 60 / hourHeight;
  const minutesDay = pos[1] * minuteHeight;

  const dayInGrid = Math.trunc((pos[0] / (width || 1)) * 7);

  return DateTime.fromJSDate(startDay).plus({ days: dayInGrid, minutes: minutesDay }).toJSDate();
};
