import { useMemo } from 'react';
import { DAY_IN_MILLIS, HOUR_IN_MILLIS } from '../constants';
import { useHwcContext } from '../contexts/HwcContext';
import { Rect } from '../types';
import {
  buildIsEventVisibleFilter,
  getCroppedEventsByDay,
} from '../utils/events';
import { startOfDay } from '../utils/round';

export const useShadowCards = () => {
  const {
    startDay,
    daysCount,
    shadowEvent,
    cellWidth,
    cellHeight,
  } = useHwcContext();

  const eventsFilter = useMemo(
    () => buildIsEventVisibleFilter(startDay, daysCount),
    [startDay, daysCount],
  );

  return useMemo(() => {
    return (shadowEvent ? [{ event: shadowEvent }] : [])
      .filter(c => eventsFilter(c.event))
      .map(c => {
        const evts = getCroppedEventsByDay(c.event);

        return evts.map(ev => ({
          ...c,
          event: ev,
        }));
      })
      .map(croppeds =>
        croppeds.map((card, index) => ({
          ...card,
          index: index,
          isFirst: index === 0,
          isLast: index === croppeds.length - 1,
        })),
      )
      .flat()
      .filter(c => eventsFilter(c.event))
      .map(c => {
        const day =
          (startOfDay(c.event.startDate).getTime() -
            startOfDay(startDay).getTime()) /
          DAY_IN_MILLIS;

        const duration =
          c.event.endDate.getTime() - c.event.startDate.getTime();
        const millisFromDayStart =
          c.event.startDate.getTime() - startOfDay(c.event.startDate).getTime();

        const rect: Rect = {
          width: cellWidth,
          height: (duration / HOUR_IN_MILLIS) * cellHeight,
          left: day * cellWidth,
          top: (millisFromDayStart / HOUR_IN_MILLIS) * cellHeight,
        };

        return {
          ...c,
          rect,
          style: {
            width: `${rect.width}px`,
            height: `${rect.height}px`,
          },
        };
      });
  }, [cellWidth, startDay, shadowEvent, cellHeight, eventsFilter]);
};
