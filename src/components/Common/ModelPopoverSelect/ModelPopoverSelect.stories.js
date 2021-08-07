import React from "react";
import ModelPopoverSelect from "./ModelPopoverSelect";

export default {
  title: "ModelPopoverSelect",
  component: ModelPopoverSelect,
};

const Template = (args) => <ModelPopoverSelect {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {
  text: "Add Model Alias",
  onModelSelect: (a) => alert(a.value),
};
