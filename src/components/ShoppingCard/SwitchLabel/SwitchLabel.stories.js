import React from "react";
import SwitchLabel from "./SwitchLabel";

export default {
  title: "Shop/SwitchLabel",
  component: SwitchLabel,
};

const Template = (args) => <SwitchLabel {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {
  label: "This is the label",
  isChecked: true,
  click: console.log,
  minWidth: 200,
  maxWidth: 200,
};
