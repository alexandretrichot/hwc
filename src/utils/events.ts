import { DAY_IN_MILLIS } from '../constants';
import { HwcEvent } from '../types';
import { startOfDay } from './round';

export const buildIsEventVisibleFilter = (
  startDay: Date,
  daysCount: number,
) => {
  const startMillis = startOfDay(startDay).getTime();
  const endMillis = startMillis + daysCount * DAY_IN_MILLIS;

  return (ev: HwcEvent) => {
    return (
      ev.startDate.getTime() < endMillis && ev.endDate.getTime() > startMillis
    );
  };
};

export const getCroppedEventsByDay = <EvType extends HwcEvent>(
  ev: EvType,
): EvType[] => {
  const events: EvType[] = [];

  const evEndMillis = ev.endDate.getTime();

  for (let i = 0; i < 20; i++) {
    const lastCroppedEvent: HwcEvent | undefined = events[events.length - 1];
    const nextDayMillis = lastCroppedEvent
      ? startOfDay(lastCroppedEvent.startDate).getTime() + 2 * DAY_IN_MILLIS
      : startOfDay(ev.startDate).getTime() + 1 * DAY_IN_MILLIS;

    const isOverflow = nextDayMillis < evEndMillis;

    events.push({
      ...ev,
      startDate: new Date(
        lastCroppedEvent ? lastCroppedEvent.endDate : ev.startDate,
      ),
      endDate: new Date(isOverflow ? nextDayMillis : evEndMillis),
    });

    if (!isOverflow) break;
  }

  return events;
};
