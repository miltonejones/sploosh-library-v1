import React from "react";
import CircularProgressWithLabel from "./CircularProgressWithLabel";

export default {
  title: "Shop/CircularProgressWithLabel",
  component: CircularProgressWithLabel,
};

const Template = (args) => <CircularProgressWithLabel {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = { value: 43 };
