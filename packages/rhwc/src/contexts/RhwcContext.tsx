import React from 'react';
import { RhwcEvent } from '../models/event.model';
import { Pos } from '../models/pos.model';

export type IRhwcContext = {
  pos: Pos;
  date: Date;
  startDay: Date;
  daysCount: number;
  cellHeight: number;
  cellWidth: number;

  events: RhwcEvent[];

  setPos: (pos: Pos) => void;
  setWidth: (width: number) => void;

  shadowEvent?: RhwcEvent;
  setStartDragDate: (date?: Date) => void;
  requestAddEventHandler: (ev: RhwcEvent) => void;
};

export const RhwcContext = React.createContext<IRhwcContext | null>(null);

export const RhwcProvider = RhwcContext.Provider;

export const useRhwcContext = () => {
  const ctx = React.useContext(RhwcContext);
  if (ctx === null)
    throw new Error(
      'No WeekPicker Context found. Please Wrap Rhwc components in <RhwcProvider />'
    );

  return ctx;
};
