import React from 'react';
import LocalDataLoader from './LocalDataLoader';

export default {
  title: 'LocalDataLoader',
  component: LocalDataLoader
};

const Template = (args) => <LocalDataLoader {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {};
