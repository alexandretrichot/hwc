import React, { Fragment } from 'react';
import { DAY_IN_MILLIS } from '../constants';
import { useWeekPickerContext } from '../contexts/WeekPickerContext';

export type RenderCellProps = {
  style: React.CSSProperties;
  cellHeight: number;
  cellWidth: number;
  x?: 'start' | 'end';
  y?: 'start' | 'end';
  date: Date;
};

export type WeekGridProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  colStyle?: React.CSSProperties;
  defaultStyles?: boolean;

  children?: (props: RenderCellProps) => React.ReactNode;
};

const defaultCellRenderer = ({ style }: RenderCellProps) => <div style={style} />;

export const WeekGrid = React.forwardRef<HTMLDivElement, WeekGridProps>(({ style, colStyle, children, ...props }, ref) => {
  const { startDay, cellHeight, cellWidth, daysCount } = useWeekPickerContext();

  const days = new Array(daysCount).fill(0).map((_, index) => new Date(startDay.getTime() + index * DAY_IN_MILLIS));
  const lines = new Array(24).fill(0).map((_, index) => index);

  return (
    <div
      {...props}
      ref={ref}
      style={{
        position: 'absolute',
        width: '100%',
        display: 'flex',
        ...style,
      }}
    >
      {days.map((d, dIndex) => (
        <div key={dIndex} style={{ flex: '0 0 1', width: '100%', ...colStyle }}>
          {lines.map((l) => {
            const x = dIndex === 0 ? 'start' : dIndex === days.length - 1 ? 'end' : undefined;
            const y = l === 0 ? 'start' : l === lines.length - 1 ? 'end' : undefined;

            return (
              <Fragment key={l}>
                {(children || defaultCellRenderer)({
                  cellHeight,
                  cellWidth,
                  style: {
                    height: `${cellHeight}px`,
                    borderLeft: x === 'start' ? undefined : `#aaa solid 1px`,
                    borderTop: y === 'start' ? undefined : `#aaa solid 1px`,
                    boxSizing: 'border-box',
                  },
                  x,
                  y,
                  date: d,
                })}
              </Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
});