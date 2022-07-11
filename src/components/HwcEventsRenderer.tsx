import React, { Fragment, useMemo } from 'react';
import { DAY_IN_MILLIS, HOUR_IN_MILLIS } from '../constants';
import { useHwcContext } from '../contexts/HwcContext';
import { HwcEvent } from '../models/event.model';
import {
  buildIsEventVisibleFilter,
  getCroppedEventsByDay,
} from '../utils/events';
import { startOfDay } from '../utils/round';

export type Rect = {
  width: number;
  height: number;
  left: number;
  top: number;
};

export type RenderCardProps = {
  event: HwcEvent;
  rect: Rect;
  isFirst: boolean;
  isLast: boolean;
};

export type HwcEventsRendererProps = {
  renderCard?: (props: RenderCardProps) => React.ReactNode;
};

const defaultRenderCard = ({ rect }: RenderCardProps) => {
  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor: 'orange',
        border: 'solid orangered 2px',
        boxSizing: 'border-box',
        borderRadius: '3px',
        width: `${rect.width - 2}px`,
        height: `${rect.height - 2}px`,
        left: `${rect.left}px`,
        top: `${rect.top}px`,
      }}
    />
  );
};

export const HwcEventsRenderer: React.FC<HwcEventsRendererProps> = ({
  renderCard,
}) => {
  const { events, cellWidth, cellHeight, startDay, daysCount, shadowEvent } =
    useHwcContext();

  const cards = useMemo<RenderCardProps[]>(() => {
    const eventsFilter = buildIsEventVisibleFilter(startDay, daysCount);

    return [...events, ...(shadowEvent ? [shadowEvent] : [])]
      .filter(eventsFilter)
      .map(getCroppedEventsByDay)
      .map(croppeds =>
        croppeds.map((ev, index) => ({
          ...ev,
          isFirst: index === 0,
          isLast: index === croppeds.length - 1,
        }))
      )
      .flat()
      .filter(eventsFilter)
      .map(ev => {
        const day =
          (startOfDay(ev.startDate).getTime() -
            startOfDay(startDay).getTime()) /
          DAY_IN_MILLIS;

        const duration = ev.endDate.getTime() - ev.startDate.getTime();
        const millisFromDayStart =
          ev.startDate.getTime() - startOfDay(ev.startDate).getTime();

        return {
          event: {
            startDate: ev.startDate,
            endDate: ev.endDate,
          },
          rect: {
            width: cellWidth,
            height: (duration / HOUR_IN_MILLIS) * cellHeight,
            left: day * cellWidth,
            top: (millisFromDayStart / HOUR_IN_MILLIS) * cellHeight,
          },
          isFirst: ev.isFirst,
          isLast: ev.isLast,
        };
      });
  }, [events, cellWidth, startDay, daysCount, shadowEvent, cellHeight]);

  return (
    <div style={{ position: 'relative' }}>
      {cards.map((cardProps, index) => {
        return (
          <Fragment key={index}>
            {(renderCard || defaultRenderCard)(cardProps)}
          </Fragment>
        );
      })}
    </div>
  );
};
