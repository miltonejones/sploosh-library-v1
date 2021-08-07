import React from "react";
import AppToolbar from "./AppToolbar";

export default {
  title: "Views/AppToolbar",
  component: AppToolbar,
  argTypes: {
    color: {
      options: ["primary", "secondary", "inherit", "default", "transparent"],
      control: { type: "radio" },
    },
  },
};

const Template = (args) => <AppToolbar {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {
  color: "inherit",
};
