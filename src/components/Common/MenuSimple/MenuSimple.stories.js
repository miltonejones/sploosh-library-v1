import { MoreVert } from "@material-ui/icons";
import React from "react";
import MenuSimple from "./MenuSimple";

export default {
  title: "Common/MenuSimple",
  component: MenuSimple,
};

const Template = (args) => <MenuSimple {...args} />;

export const DefaultView = Template.bind({});

const orderWith = [
  {
    field: "ID",
    title: "Date Added",
  },
  {
    field: "title",
    title: "Title",
  },
];

DefaultView.args = {
  items: orderWith.map((f) => ({
    text: f.title,
    action: () => alert(f.field),
  })),
  icon: <MoreVert />,
};
