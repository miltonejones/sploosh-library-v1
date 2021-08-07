import React from "react";
import AppSidebar from "./AppSidebar";

export default {
  title: "Views/AppSidebar",
  component: AppSidebar,
};

const Template = (args) => <AppSidebar {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {
  wide: false,
};
