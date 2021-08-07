import React from "react";
import VideoInfoCard from "./VideoInfoCard";
import video from "../../stories/assets/video-tagless.json";

export default {
  title: "Modal/VideoInfoCard",
  component: VideoInfoCard,
};

const Template = (args) => <VideoInfoCard {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = { video };
