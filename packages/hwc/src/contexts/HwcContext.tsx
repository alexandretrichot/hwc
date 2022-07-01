import React from 'react';
import { HwcEvent } from '../models/event.model';
import { Pos } from '../models/pos.model';

export type IHwcContext = {
  pos: Pos;
  date: Date;
  startDay: Date;
  daysCount: number;
  cellHeight: number;
  cellWidth: number;

  events: HwcEvent[];

  setPos: (pos: Pos) => void;
  setWidth: (width: number) => void;

  shadowEvent?: HwcEvent;
  setStartDragDate: (date?: Date) => void;
  requestAddEventHandler: (ev: HwcEvent) => void;
};

export const HwcContext = React.createContext<IHwcContext | null>(null);

export const HwcProvider = HwcContext.Provider;

export const useHwcContext = () => {
  const ctx = React.useContext(HwcContext);
  if (ctx === null)
    throw new Error(
      'No WeekPicker Context found. Please Wrap Hwc components in <HwcProvider />'
    );

  return ctx;
};
