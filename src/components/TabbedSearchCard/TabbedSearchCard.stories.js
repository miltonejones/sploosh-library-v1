import React from "react";
import TabbedSearchCard from "./TabbedSearchCard";

export default {
  title: "Modal/TabbedSearchCard",
  component: TabbedSearchCard,
};

const Template = (args) => <TabbedSearchCard {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {};
