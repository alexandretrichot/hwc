import { useMemo, useState } from 'react';
import { IWeekPickerContext } from '../contexts/WeekPickerContext';
import { Pos } from '../models/pos.model';
import { posToDate } from '../utils/posToDate';
import { roundToQuarterHour } from '../utils/round';

export type WeekPickerProps = {
  startDay?: Date;
  daysCount?: number;
  cellHeight?: number;
};

export const useWeekPicker = (props: WeekPickerProps = {}): IWeekPickerContext => {
  const { startDay = new Date(), cellHeight = 50, daysCount = 7 } = props;

  // column witdh
  const [width, setWidth] = useState(0);
  const cellWidth = useMemo(() => width / daysCount, [width]);

  // mouse position and date
  const [pos, setPos] = useState<Pos>([0, 0]);
  const date = useMemo(() => roundToQuarterHour(posToDate(pos, width, startDay, cellHeight)), [pos]);

  return {
    pos,
    date,
    cellWidth,
    cellHeight,

    startDay,
    daysCount,

    setPos,
    setWidth,
  };
};
