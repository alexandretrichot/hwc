import { DateTime } from 'luxon';

export const roundToQuarterHour = (date: DateTime): DateTime => {
  const rounded = date.startOf('minute');
  const minutes = rounded.minute + rounded.hour * 60;

  const roundedMinute = (Math.round((minutes / 60) * 4) * 60) / 4;
  return date.startOf('day').plus({ minutes: roundedMinute });
};
