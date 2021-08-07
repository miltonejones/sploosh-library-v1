import React from "react";
import ShoppingCard from "./ShoppingCard";

export default {
  title: "Shop/ShoppingCard",
  component: ShoppingCard,
};

const Template = (args) => <ShoppingCard {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {
  refresh: () => alert("ALL DONE!"),
};
