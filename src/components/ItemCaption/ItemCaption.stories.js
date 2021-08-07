import React from "react";
import ItemCaption from "./ItemCaption";

export default {
  title: "Thumbnail/ItemCaption",
  component: ItemCaption,
};

const Template = (args) => <ItemCaption {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {
  debug: false,
  details: false,
  title:
    "One  line of really really long text to start with just so I can see it work",
};
