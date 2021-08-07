import React from "react";
import ThreadMessageLineItem from "./ThreadMessageLineItem";

export default {
  title: "Shop/ThreadMessageLineItem",
  component: ThreadMessageLineItem,
};

const Template = (args) => <ThreadMessageLineItem {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {};
