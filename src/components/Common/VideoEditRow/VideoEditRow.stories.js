import React from "react";
import VideoEditRow from "./VideoEditRow";

export default {
  title: "Common/VideoEditRow",
  component: VideoEditRow,
};

const Template = (args) => <VideoEditRow {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = { selectedItemList: [1, 2, 3, 4] };
