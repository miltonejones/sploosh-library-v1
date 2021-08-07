import React from "react";
import ProgressAvatar from "./ProgressAvatar";

export default {
  title: "Shop/ProgressAvatar",
  component: ProgressAvatar,
};

const Template = (args) => <ProgressAvatar {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {};
