import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';

import { useRhwc, RhwcProvider, RhwcHeader, RhwcDragPane, RhwcGrid, RhwcEventsRenderer } from '.';
import { Debugger } from './dev/Debugger';
import { RhwcEvent } from './models/event.model';

type WeekPickerProps = {
  startDay?: Date;
  daysCount?: number;
  cellHeight?: number;
  events?: RhwcEvent[];
};

const WeekPicker: React.FC<WeekPickerProps> = (props) => {
  const [events, setEvents] = useState<RhwcEvent[]>(props.events || []);

  const weekPicker = useRhwc({
    ...props,
    events,
    onAddEventRequest: (ev) => setEvents([...events, ev]),
  });

  return (
    <RhwcProvider value={weekPicker}>
      <Debugger />
      <div className='grid' style={{ gridTemplateColumns: '100px minmax(0, 1fr)' }}>
        <div />
        <RhwcHeader />
      </div>
      <div className='grid' style={{ gridTemplateColumns: '100px minmax(0, 1fr)' }}>
        <div></div>
        <RhwcDragPane className='border border-gray-300'>
          <RhwcGrid />
          <RhwcEventsRenderer />
        </RhwcDragPane>
      </div>
    </RhwcProvider>
  );
};

export default {
  title: 'WeekPicker',
  component: WeekPicker,
};

const Template: ComponentStory<typeof WeekPicker> = (args) => <WeekPicker {...args} />;

export const Default = Template.bind({});
Default.args = {
  startDay: new Date('2022-08-08'),
  daysCount: 7,
  cellHeight: 50,
  events: [
    {
      startDate: new Date('2022-08-09T00:30'),
      endDate: new Date('2022-08-09T01:30'),
    },
    {
      startDate: new Date('2022-08-10T03:30'),
      endDate: new Date('2022-08-10T05:30'),
    },
    {
      startDate: new Date('2022-08-11T04:30'),
      endDate: new Date('2022-08-11T06:00'),
    },
  ],
} as WeekPickerProps;
