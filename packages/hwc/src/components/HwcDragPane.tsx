import React, { useCallback, useRef, useState } from 'react';
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect';
import { HOUR_IN_MILLIS } from '../constants';
import { useHwcContext } from '../contexts/HwcContext';
import { Pos } from '../models/pos.model';
import { roundToQuarterHour } from '../utils/round';
import ResizeObserver from 'resize-observer-polyfill';

export type HwcDragPaneProps = React.ComponentProps<'div'> & {};

export const HwcDragPane = React.forwardRef<HTMLDivElement, HwcDragPaneProps>(
  (
    {
      onMouseMove = () => {},
      onMouseDown = () => {},
      style,
      children,
      ...props
    },
    ref
  ) => {
    const {
      setPos,
      date,
      setWidth,
      setStartDragDate,
      requestAddEventHandler,
      shadowEvent,
      cellHeight,
    } = useHwcContext();

    const [element, setRef] = useState<HTMLDivElement | null>(null);

    useIsomorphicLayoutEffect(() => {
      if (!element) return;

      const observer = new ResizeObserver(([entry]) => {
        if (entry) setWidth(entry.contentRect.width);
      });
      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }, [element, setWidth]);

    // shadow event
    const mouseDownDate = useRef<Date>();

    const mouseDownHandler = useCallback<
      React.MouseEventHandler<HTMLDivElement>
    >(
      ev => {
        if (
          !(ev.target instanceof Element) ||
          !ev.target.hasAttribute('week-picker-cell')
        )
          return;
        // prevent dnd
        ev.preventDefault();

        mouseDownDate.current = date;

        onMouseDown(ev);
      },
      [date, onMouseDown]
    );

    const mouseMoveHandler = useCallback<
      React.MouseEventHandler<HTMLDivElement>
    >(
      ev => {
        const offset = ev.currentTarget.getBoundingClientRect();
        const pos: Pos = {
          x: ev.clientX - offset.left,
          y: ev.clientY - offset.top,
        };

        setPos(pos);

        onMouseMove(ev);

        if (
          mouseDownDate.current &&
          !shadowEvent &&
          roundToQuarterHour(mouseDownDate.current).getTime() !==
            roundToQuarterHour(date).getTime()
        ) {
          setStartDragDate(mouseDownDate.current);
        }
      },
      [setPos, onMouseMove, shadowEvent, date, setStartDragDate]
    );

    useIsomorphicLayoutEffect(() => {
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
        style={{
          position: 'relative',
          height: `${cellHeight * 24}px`,
          ...style,
        }}
        onMouseMove={mouseMoveHandler}
        onDrag={ev => ev.preventDefault()}
        onMouseDown={mouseDownHandler}
        ref={ref || setRef}
      >
        {children}
      </div>
    );
  }
);
