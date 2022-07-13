import { useCallback, useEffect, useState } from 'react';
import { HwcEvent } from '../types';
import { roundToQuarterHour } from '../utils/round';

type MoveEventState = {
  date: Date;
  startEvent: HwcEvent;
  evIndex: number;
  dragDelta: number;
};

export const useMoveEvent = (
  date: Date,
  updateEventHandler: (
    eventIndex: number,
    newEvent: HwcEvent,
    startEvent: HwcEvent
  ) => void
) => {
  const [moveState, setMoveState] = useState<MoveEventState>();

  const setEventMoving = useCallback(
    (event?: HwcEvent, evIndex?: number) =>
      setMoveState(
        event !== undefined && evIndex !== undefined
          ? {
              startEvent: event,
              evIndex,
              date,
              dragDelta: date.getTime() - event.startDate.getTime(),
            }
          : undefined
      ),
    [setMoveState, date]
  );

  useEffect(() => {
    if (!moveState) return;

    const delta = roundToQuarterHour(
      new Date(moveState.date.getTime() - date.getTime())
    ).getTime();

    updateEventHandler(
      moveState.evIndex,
      {
        startDate: new Date(moveState.startEvent.startDate.getTime() - delta),
        endDate: new Date(moveState.startEvent.endDate.getTime() - delta),
      },
      moveState.startEvent
    );
  }, [moveState, date, updateEventHandler]);

  useEffect(() => {
    if (!moveState) return;

    const mouseUpHandler = () => {
      window.removeEventListener('mouseup', mouseUpHandler);

      setMoveState(undefined);
    };

    window.addEventListener('mouseup', mouseUpHandler);
  }, [moveState, setMoveState]);

  return [setEventMoving] as const;
};
