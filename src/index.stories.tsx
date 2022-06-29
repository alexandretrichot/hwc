import React from 'react';
import { ComponentStory } from '@storybook/react';

import './styles.css';

import { WeekPickerProvider, useWeekPicker, WeekGrid, DragPane, WeekPickerHeader } from '.';

type WeekPickerProps = {
  startDay?: Date;
  daysCount?: number;
  cellHeight?: number;
};

const WeekPicker: React.FC<WeekPickerProps> = (props) => {
  const weekPicker = useWeekPicker(props);

  return (
    <WeekPickerProvider value={weekPicker}>
      <div className='grid' style={{ gridTemplateColumns: '100px minmax(0, 1fr)' }}>
        <div />
        <WeekPickerHeader />
      </div>
      <div className='grid' style={{ gridTemplateColumns: '100px minmax(0, 1fr)' }}>
        <div></div>
        <DragPane>
          <WeekGrid />
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
} as WeekPickerProps;
