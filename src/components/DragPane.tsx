import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from 'react-use';
import { HOUR_IN_MILLIS } from '../constants';
import { useWeekPickerContext } from '../contexts/WeekPickerContext';
import { Pos } from '../models/pos.model';
import { roundToQuarterHour } from '../utils/round';

export type DragPaneProps = React.ComponentProps<'div'> & {};

export const DragPane = React.forwardRef<HTMLDivElement, DragPaneProps>(
  ({ onMouseMove = () => {}, onMouseDown = () => {}, style, children, ...props }, ref) => {
    const { setPos, date, setWidth, setStartDragDate, requestAddEventHandler, shadowEvent } = useWeekPickerContext();

    const [element, setRef] = useState<HTMLDivElement | null>(null);

    const observer = useMemo(
      () =>
        new ResizeObserver(([entry]) => {
          if (entry) setWidth(entry.contentRect.width);
        }),
      []
    );

    useIsomorphicLayoutEffect(() => {
      if (!element) return;

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }, [element]);

    // shadow event
    const mouseDownDate = useRef<Date>();

    const mouseMoveHandler = useCallback<React.MouseEventHandler<HTMLDivElement>>(
      (ev) => {
        // prevent dnd
        ev.preventDefault();

        const offset = ev.currentTarget.getBoundingClientRect();
        const pos: Pos = [ev.clientX - offset.left, ev.clientY - offset.top];

        setPos(pos);

        onMouseMove(ev);

        if (mouseDownDate.current && !shadowEvent && roundToQuarterHour(mouseDownDate.current).getTime() !== roundToQuarterHour(date).getTime()) {
          setStartDragDate(mouseDownDate.current);
        }
      },
      [setPos, onMouseMove, shadowEvent, setStartDragDate]
    );

    const mouseDownHandler = useCallback<React.MouseEventHandler<HTMLDivElement>>(
      (ev) => {
        mouseDownDate.current = date;

        onMouseDown(ev);
      },
      [setStartDragDate, onMouseDown]
    );

    useEffect(() => {
      const dragEndHandler = () => {
        if (mouseDownDate.current) {
          if (shadowEvent) {
            requestAddEventHandler(shadowEvent);
          } else {
            console.log('end', {
              startDate: date,
              endDate: new Date(date.getTime() + 2 * HOUR_IN_MILLIS),
            });
            requestAddEventHandler({
              startDate: date,
              endDate: new Date(date.getTime() + 2 * HOUR_IN_MILLIS),
            });
          }
        }

        mouseDownDate.current = undefined;
        setStartDragDate(undefined);
      };

      window.addEventListener('mouseup', dragEndHandler);

      return () => {
        window.removeEventListener('mouseup', dragEndHandler);
      };
    }, [setStartDragDate, requestAddEventHandler, shadowEvent, date]);

    return (
      <div
        {...props}
        style={{ position: 'relative', ...style }}
        onMouseMove={mouseMoveHandler}
        onDrag={(ev) => ev.preventDefault()}
        onMouseDown={mouseDownHandler}
        ref={ref || setRef}
      >
        {children}
      </div>
    );
  }
);
