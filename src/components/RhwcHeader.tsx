import React from 'react';
import { DAY_IN_MILLIS } from '../constants';
import { useRhwcContext } from '../contexts/RhwcContext';

export type RhwcHeaderProps = {
  locale?: string;
  dateFormatOptions?: Intl.DateTimeFormatOptions;
};

export const RhwcHeader: React.FC<RhwcHeaderProps> = ({ locale, dateFormatOptions = { day: '2-digit', weekday: 'short' } }) => {
  const { startDay, daysCount } = useRhwcContext();

  const days = new Array(daysCount).fill(0).map((_, index) => new Date(startDay.getTime() + index * DAY_IN_MILLIS));

  return (
    <div style={{ display: 'flex' }}>
      {days.map((d, dIndex) => (
        <div key={dIndex} style={{ flex: '0 0 1', width: '100%' }}>
          {d.toLocaleDateString(locale, dateFormatOptions)}
        </div>
      ))}
    </div>
  );
};
