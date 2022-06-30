import { useCallback, useState } from 'react';
import { Pos } from '../models/pos.model';

export type UseShadowEventProps = {
  onFinish?: (ev: Event) => void;
};

export const useShadowEvent = ({ onFinish = () => {} }: UseShadowEventProps) => {
  const [shadowEvent, setShadowEvent] = useState<Event>();
  const [isDragging, setIsDragging] = useState(false);

  const dragStartHandler = useCallback(
    (pos: Pos) => {
      setIsDragging(true);
    },
    [useShadowEvent, setIsDragging]
  );

  const dragEndHandler = useCallback(
    (pos: Pos) => {
      setIsDragging(false);
    },
    [useShadowEvent, setIsDragging]
  );

  const dragHandler = useCallback((pos: Pos) => {}, [useShadowEvent, setIsDragging]);

  return {
    shadowEvent,
    setShadowEvent,
    onDragStart: dragStartHandler,
    onDragEnd: dragEndHandler,
    onDrag: dragHandler,
  };
};
