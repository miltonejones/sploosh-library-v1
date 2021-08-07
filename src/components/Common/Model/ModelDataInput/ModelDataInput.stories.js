import React from "react";
import ModelDataInput from "./ModelDataInput";

export default {
  title: "Model/ModelDataInput",
  component: ModelDataInput,
};

const Template = (args) => <ModelDataInput {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {
  text: "Debug Model Search",
  onModelSelect: (v) => alert(v.name),
};
