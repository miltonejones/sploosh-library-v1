import React from "react";
import ModelInfoCard from "./ModelInfoCard";

export default {
  title: "Modal/ModelInfoCard",
  component: ModelInfoCard,
};

const Template = (args) => <ModelInfoCard {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = { id: 1758, titleClick: (v) => alert(v.title) };
