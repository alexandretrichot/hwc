import React from 'react';
import { HwcEvent, Pos } from '../types';

export type IHwcContext<EvType extends HwcEvent> = {
  pos: Pos;
  date: Date;
  startDay: Date;
  daysCount: number;
  cellHeight: number;
  cellWidth: number;

  events: EvType[];

  setPos: (pos: Pos) => void;
  setWidth: (width: number) => void;

  shadowEvent?: HwcEvent;
  setStartDragDate: (date?: Date) => void;
  requestAddEventHandler: (ev: HwcEvent) => void;
};

export const HwcContext = React.createContext<IHwcContext<HwcEvent> | null>(
  null
);

export const OldHwcProvider = HwcContext.Provider;

export type HwcProviderProps<EvType extends HwcEvent> = {
  value: IHwcContext<EvType>;
  children?: React.ReactNode;
};

export const HwcProvider = <EvType extends HwcEvent>({
  value,
  children,
}: HwcProviderProps<EvType>): React.ReactElement => {
  return <HwcContext.Provider value={value}>{children}</HwcContext.Provider>;
};

export const useHwcContext = <EvType extends HwcEvent>() => {
  const ctx = React.useContext(HwcContext);
  if (ctx === null)
    throw new Error(
      'No WeekPicker Context found. Please Wrap Hwc components in <HwcProvider />'
    );

  return (ctx as unknown) as IHwcContext<EvType>;
};
