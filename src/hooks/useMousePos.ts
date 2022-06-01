import { useContext } from 'react';
import { IMousePosContext, MousePosContext } from '../components/DragBoard';

export const useMousePos = (): IMousePosContext => {
  const pos = useContext(MousePosContext);
  if (!pos) throw new Error('No mouse context');

  return pos;
};
