import React from "react";
import ToolTipText from "./ToolTipText";

export default {
  title: "Common/ToolTipText",
  component: ToolTipText,
};

const Template = (args) => <ToolTipText {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {};
