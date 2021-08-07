import React from "react";
import GlobalModal from "./GlobalModal";

export default {
  title: "Modal/GlobalModal",
  component: GlobalModal,
};

const Template = (args) => <GlobalModal {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {};
