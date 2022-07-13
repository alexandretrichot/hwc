import { useCallback, useEffect, useState } from 'react';
import { GripPosition } from '../components/GripRenderer';
import { HwcEvent } from '../types';
import { roundToQuarterHour } from '../utils/round';

type ReziseEventState = {
  date: Date;
  event: HwcEvent;
  evIndex: number;
  grip: GripPosition;
};

export const useResizeEvent = (
  date: Date,
  updateEventHandler: (eventIndex: number, newEvent: HwcEvent) => void
) => {
  const [resizeState, setResizeState] = useState<ReziseEventState>();

  const setEventResizing = useCallback(
    (event?: HwcEvent, evIndex?: number, grip?: GripPosition) =>
      setResizeState(
        event !== undefined && evIndex !== undefined && grip !== undefined
          ? {
              event,
              evIndex,
              date,
              grip,
            }
          : undefined
      ),
    [setResizeState, date]
  );

  useEffect(() => {
    if (!resizeState) return;

    const delta = roundToQuarterHour(
      new Date(resizeState.date.getTime() - date.getTime())
    ).getTime();

    updateEventHandler(resizeState.evIndex, {
      startDate: new Date(
        resizeState.grip === 'start'
          ? resizeState.event.startDate.getTime() - delta
          : resizeState.event.startDate
      ),
      endDate: new Date(
        resizeState.grip === 'end'
          ? resizeState.event.endDate.getTime() - delta
          : resizeState.event.endDate
      ),
    });
  }, [resizeState, date, updateEventHandler]);

  useEffect(() => {
    if (!resizeState) return;

    const mouseUpHandler = () => {
      window.removeEventListener('mouseup', mouseUpHandler);

      setResizeState(undefined);
    };

    window.addEventListener('mouseup', mouseUpHandler);
  }, [resizeState, setResizeState]);

  return [setEventResizing] as const;
};
