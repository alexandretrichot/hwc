import { DateTime } from 'luxon';

export const roundToQuarterHour = (date: Date): Date => {
  const parsedDate = DateTime.fromJSDate(date);

  const rounded = parsedDate.startOf('minute');
  const minutes = rounded.minute + rounded.hour * 60;

  const roundedMinute = (Math.round((minutes / 60) * 4) * 60) / 4;
  return parsedDate.startOf('day').plus({ minutes: roundedMinute }).toJSDate();
};
