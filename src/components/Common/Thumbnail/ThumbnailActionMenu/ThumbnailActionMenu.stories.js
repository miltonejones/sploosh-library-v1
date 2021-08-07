import React from "react";
import ThumbnailActionMenu from "./ThumbnailActionMenu";

export default {
  title: "Thumbnail/ThumbnailActionMenu",
  component: ThumbnailActionMenu,
};

const Template = (args) => <ThumbnailActionMenu {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {};
