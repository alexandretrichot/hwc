import React from 'react';
import { ComponentStory } from '@storybook/react';

import { DragBoard } from './DragBoard';
import { DateTime } from 'luxon';
import { Debugger } from './dev/Debugger';

export default {
  title: 'DragBoard',
  component: DragBoard,
};

const Template: ComponentStory<typeof DragBoard> = (args) => (
  <DragBoard {...args}>
    <Debugger />
  </DragBoard>
);

export const Default = Template.bind({});
Default.args = {
  weekStartDay: DateTime.fromISO('2022-08-05').startOf('week'),
  hourHeight: 50,
};
