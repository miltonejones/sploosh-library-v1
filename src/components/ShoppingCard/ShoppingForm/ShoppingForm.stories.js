import React from 'react';
import ShoppingForm from './ShoppingForm';

export default {
  title: 'ShoppingForm',
  component: ShoppingForm
};

const Template = (args) => <ShoppingForm {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {};
