import React from 'react';

import { WeekPicker } from './WeekPicker';

export default {
  title: 'WeekPicker',
  component: WeekPicker,
};

const Template = (args) => <WeekPicker {...args} />;

export const Default = Template.bind({});
Default.args = {};
