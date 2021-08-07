import React from 'react';
import ParserList from './ParserList';

export default {
  title: 'ParserList',
  component: ParserList
};

const Template = (args) => <ParserList {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {};
