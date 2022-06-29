import React from 'react';
import { Pos } from '../models/pos.model';

export type IWeekPickerContext = {
  pos: Pos;
  date: Date;
  startDay: Date;
  daysCount: number;
  cellHeight: number;
  cellWidth: number;

  setPos: (pos: Pos) => void;
  setWidth: (width: number) => void;
};

export const WeekPickerContext = React.createContext<IWeekPickerContext | null>(null);

export const WeekPickerProvider = WeekPickerContext.Provider;

export const useWeekPickerContext = () => {
  const ctx = React.useContext(WeekPickerContext);
  if (ctx === null) throw new Error('No WeekPicker Context found. Please Wrap WeekPicker components in <WeekPickerWrapper />');

  return ctx;
};
