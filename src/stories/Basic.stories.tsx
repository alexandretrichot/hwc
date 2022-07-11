import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Basic } from './Basic';

export default {
  title: 'Example/Basic',
  component: Basic,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Basic>;

const Template: ComponentStory<typeof Basic> = args => <Basic {...args} />;

export const Default = Template.bind({});
Default.args = {
  startDay: new Date(),
  daysToShow: 7,
  cellHeight: 50,
};
