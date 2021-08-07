import React from "react";
import ThumbnailOptionMenu from "./ThumbnailOptionMenu";
import video from "../../../../stories/assets/video.json";

export default {
  title: "Thumbnail/ThumbnailOptionMenu",
  component: ThumbnailOptionMenu,
};

const Template = (args) => <ThumbnailOptionMenu {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = { video };
