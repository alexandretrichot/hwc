import React from 'react';
import { Event } from '../models/event.model';
import { Pos } from '../models/pos.model';

export type IWeekPickerContext = {
  pos: Pos;
  date: Date;
  startDay: Date;
  daysCount: number;
  cellHeight: number;
  cellWidth: number;

  events: Event[];

  setPos: (pos: Pos) => void;
  setWidth: (width: number) => void;

  shadowEvent?: Event;
  setStartDragDate: (date?: Date) => void;
  requestAddEventHandler: (ev: Event) => void;
};

export const WeekPickerContext = React.createContext<IWeekPickerContext | null>(null);

export const WeekPickerProvider = WeekPickerContext.Provider;

export const useWeekPickerContext = () => {
  const ctx = React.useContext(WeekPickerContext);
  if (ctx === null) throw new Error('No WeekPicker Context found. Please Wrap WeekPicker components in <WeekPickerWrapper />');

  return ctx;
};
