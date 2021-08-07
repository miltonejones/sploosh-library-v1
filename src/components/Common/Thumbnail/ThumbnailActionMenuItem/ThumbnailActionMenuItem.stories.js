import { DeleteForever } from "@material-ui/icons";
import React from "react";
import ThumbnailActionMenuItem from "./ThumbnailActionMenuItem";

export default {
  title: "Thumbnail/ThumbnailActionMenuItem",
  component: ThumbnailActionMenuItem,
};

const Template = (args) => <ThumbnailActionMenuItem {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {
  label: "Delete",
  icon: <DeleteForever />,
};
