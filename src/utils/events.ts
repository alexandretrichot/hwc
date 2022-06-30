import { DAY_IN_MILLIS } from '../constants';
import { RhwcEvent } from '../models/event.model';
import { startOfDay } from './round';

export const buildIsEventVisibleFilter = (startDay: Date, daysCount: number) => {
  const startMillis = startOfDay(startDay).getTime();
  const endMillis = startMillis + daysCount * DAY_IN_MILLIS;

  return (ev: RhwcEvent) => {
    return ev.startDate.getTime() < endMillis && ev.endDate.getTime() > startMillis;
  };
};

export const getCroppedEventsByDay = (ev: RhwcEvent): RhwcEvent[] => {
  const events: RhwcEvent[] = [];

  const evEndMillis = ev.endDate.getTime();

  for (let i = 0; i < 20; i++) {
    const lastCroppedEvent: RhwcEvent | undefined = events[events.length - 1];
    const nextDayMillis = lastCroppedEvent
      ? startOfDay(lastCroppedEvent.startDate).getTime() + 2 * DAY_IN_MILLIS
      : startOfDay(ev.startDate).getTime() + 1 * DAY_IN_MILLIS;

    const isOverflow = nextDayMillis < evEndMillis;

    events.push({
      startDate: new Date(lastCroppedEvent ? lastCroppedEvent.endDate : ev.startDate),
      endDate: new Date(isOverflow ? nextDayMillis : evEndMillis),
    });

    if (!isOverflow) break;
  }

  return events;
};
