import React from 'react';
import ParserModal from './ParserModal';

export default {
  title: 'ParserModal',
  component: ParserModal
};

const Template = (args) => <ParserModal {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {};
