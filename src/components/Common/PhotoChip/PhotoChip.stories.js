import React from "react";
import PhotoChip from "./PhotoChip";

export default {
  title: "Common/PhotoChip",
  component: PhotoChip,
};

const Template = (args) => <PhotoChip {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {};
