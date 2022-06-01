import { DateTime } from 'luxon';

export const posToDate = (pos: Pos, width: number, weekStartDay: DateTime, hourHeight: number): DateTime => {
  const minuteHeight = 60 / hourHeight;
  const minutesDay = pos[1] * minuteHeight;

  const dayInGrid = Math.trunc((pos[0] / width || 0) * 7);

  return weekStartDay.plus({ days: dayInGrid, minutes: minutesDay });
};
