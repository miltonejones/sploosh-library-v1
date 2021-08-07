import React from 'react';
import ThreadProgressLine from './ThreadProgressLine';

export default {
  title: 'ThreadProgressLine',
  component: ThreadProgressLine
};

const Template = (args) => <ThreadProgressLine {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {};
