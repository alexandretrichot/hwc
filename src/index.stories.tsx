import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';

import { WeekPickerProvider, useWeekPicker, WeekGrid, DragPane, WeekPickerHeader, EventsRenderer } from '.';
import { Debugger } from './dev/Debugger';
import { Event } from './models/event.model';

type WeekPickerProps = {
  startDay?: Date;
  daysCount?: number;
  cellHeight?: number;
  events?: Event[];
};

const WeekPicker: React.FC<WeekPickerProps> = (props) => {
  const [events, setEvents] = useState<Event[]>(props.events || []);

  const weekPicker = useWeekPicker({
    ...props,
    events,
    onAddEventRequest: (ev) => setEvents([...events, ev]),
  });

  return (
    <WeekPickerProvider value={weekPicker}>
      <Debugger />
      <div className='grid' style={{ gridTemplateColumns: '100px minmax(0, 1fr)' }}>
        <div />
        <WeekPickerHeader />
      </div>
      <div className='grid' style={{ gridTemplateColumns: '100px minmax(0, 1fr)' }}>
        <div></div>
        <DragPane className='border border-gray-300'>
          <WeekGrid />
          <EventsRenderer />
        </DragPane>
      </div>
    </WeekPickerProvider>
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
    /* {
      startDate: DateTime.fromISO('2022-08-15T04:30').toJSDate(),
      endDate: DateTime.fromISO('2022-08-17T06').toJSDate(),
    },
    {
      startDate: DateTime.fromISO('2022-08-06T04:30').toJSDate(),
      endDate: DateTime.fromISO('2022-08-07T06').toJSDate(),
    },
    {
      startDate: DateTime.fromISO('2022-08-07T04:30').toJSDate(),
      endDate: DateTime.fromISO('2022-08-17T06').toJSDate(),
    },
    {
      startDate: DateTime.fromISO('2022-08-07T04:30').toJSDate(),
      endDate: DateTime.fromISO('2022-08-09T06').toJSDate(),
    },
    {
      startDate: DateTime.fromISO('2022-08-12T04:30').toJSDate(),
      endDate: DateTime.fromISO('2022-08-17T06').toJSDate(),
    }, */
  ],
} as WeekPickerProps;
