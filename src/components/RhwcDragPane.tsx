import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HOUR_IN_MILLIS } from '../constants';
import { useRhwcContext } from '../contexts/RhwcContext';
import { Pos } from '../models/pos.model';
import { roundToQuarterHour } from '../utils/round';

export type RhwcDragPaneProps = React.ComponentProps<'div'> & {};

export const RhwcDragPane = React.forwardRef<HTMLDivElement, RhwcDragPaneProps>(
  ({ onMouseMove = () => {}, onMouseDown = () => {}, style, children, ...props }, ref) => {
    const { setPos, date, setWidth, setStartDragDate, requestAddEventHandler, shadowEvent, cellHeight } = useRhwcContext();

    const [element, setRef] = useState<HTMLDivElement | null>(null);

    const observer = useMemo(
      () =>
        new ResizeObserver(([entry]) => {
          if (entry) setWidth(entry.contentRect.width);
        }),
      []
    );

    useEffect(() => {
      if (!element) return;

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }, [element]);

    // shadow event
    const mouseDownDate = useRef<Date>();

    const mouseDownHandler = useCallback<React.MouseEventHandler<HTMLDivElement>>(
      (ev) => {
        if (!(ev.target instanceof Element) || !ev.target.hasAttribute('week-picker-cell')) return;
        // prevent dnd
        ev.preventDefault();

        mouseDownDate.current = date;

        onMouseDown(ev);
      },
      [setStartDragDate, onMouseDown]
    );

    const mouseMoveHandler = useCallback<React.MouseEventHandler<HTMLDivElement>>(
      (ev) => {
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

    useEffect(() => {
      const dragEndHandler = () => {
        if (mouseDownDate.current) {
          if (shadowEvent) {
            requestAddEventHandler(shadowEvent);
          } else {
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
        style={{ position: 'relative', height: `${cellHeight * 24}px`, ...style }}
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
