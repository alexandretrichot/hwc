import { useMemo, useState } from 'react';
import { HwcEvent } from '../types';
import { roundToQuarterHour } from '../utils/round';

export const useShadowEvent = (date: Date) => {
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

  return [shadowEvent, setStartDragDate] as const;
};
