import React, { useState } from "react";
import ThumbnailGrid from "./ThumbnailGrid";
import videos from "../../../../stories/assets/stories-video-list.json";
import GlobalModal, {
  DialogConfig,
  ModelContent,
  VideoContent,
} from "../../../GlobalModal/GlobalModal";

export default {
  title: "Thumbnail/ThumbnailGrid",
  component: ThumbnailGrid,
};

const Template = (args) => {
  const [dialogProps, setDialogProps] = useState({});
  const show = DialogConfig(setDialogProps);
  const view = (v) => {
    show(VideoContent(v)).then(console.log);
  };
  const open = (v) => {
    show(ModelContent(v)).then(console.log);
  };
  return (
    <>
      <ThumbnailGrid titleClick={view} modelClick={open} {...args} />
      <GlobalModal {...dialogProps} />
    </>
  );
};

export const DefaultView = Template.bind({});

DefaultView.args = { videos, small: false };
