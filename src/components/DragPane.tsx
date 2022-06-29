import React, { useCallback, useMemo, useState } from 'react';
import { useIsomorphicLayoutEffect } from 'react-use';
import { useWeekPickerContext } from '../contexts/WeekPickerContext';

export type DragPaneProps = React.ComponentProps<'div'> & {};

export const DragPane = React.forwardRef<HTMLDivElement, DragPaneProps>(({ onMouseMove = () => {}, children, ...props }, ref) => {
  const { setPos, setWidth } = useWeekPickerContext();
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

  const mouseMoveHandler = useCallback<React.MouseEventHandler<HTMLDivElement>>((ev) => {
    const offset = ev.currentTarget.getBoundingClientRect();
    setPos([ev.clientX - offset.left, ev.clientY - offset.top]);

    onMouseMove(ev);
  }, []);

  return useMemo(
    () => (
      <div {...props} onMouseMove={mouseMoveHandler} ref={ref || setRef}>
        {children}
      </div>
    ),
    [props, mouseMoveHandler, ref, setRef, children]
  );
});
