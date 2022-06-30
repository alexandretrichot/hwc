export const roundToQuarterHour = (date: Date): Date => {
  const rounded = startOfMinute(date);
  const minutes = rounded.getMinutes() + rounded.getHours() * 60;

  const roundedMinute = (Math.round((minutes / 60) * 4) * 60) / 4;

  const d = startOfDay(date);
  d.setMinutes(roundedMinute);
  return d;
};

export const roundToSemiHour = (date: Date): Date => {
  const rounded = startOfMinute(date);
  const minutes = rounded.getMinutes() + rounded.getHours() * 60;

  const roundedMinute = (Math.round((minutes / 60) * 2) * 60) / 2;

  const d = startOfDay(date);
  d.setMinutes(roundedMinute);
  return d;
};

export const roundToHour = (date: Date): Date => {
  return startOfHour(date);
};

export const startOfDay = (input: string | number | Date): Date => {
  const d = new Date(input);
  d.setHours(0, 0, 0, 0);

  return d;
};

export const startOfHour = (input: string | number | Date): Date => {
  const d = new Date(input);
  d.setMinutes(0, 0, 0);

  return d;
};

export const startOfMinute = (input: string | number | Date): Date => {
  const d = new Date(input);
  d.setSeconds(0, 0);

  return d;
};
