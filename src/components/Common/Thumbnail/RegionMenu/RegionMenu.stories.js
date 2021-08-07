import React from "react";
import RegionMenu from "./RegionMenu";

export default {
  title: "Thumbnail/RegionMenu",
  component: RegionMenu,
};

const Template = (args) => <RegionMenu {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {
  open: !1,
};
