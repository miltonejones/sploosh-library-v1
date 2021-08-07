import React from "react";
import Thumbnail from "./Thumbnail";
import video from "../../../stories/assets/video.json";
import { Divider } from "@material-ui/core";
export default {
  title: "Thumbnail/Thumbnail",
  component: Thumbnail,
};

const Template = (args) => (
  <>
    <Thumbnail {...args} />
    <Divider style={{ margin: "10px 0" }} />
    <ObjectReader {...args.video} />
  </>
);

function ObjectReader(props) {
  return (
    <>
      {Object.keys(props).map((key) => (
        <li key={key}>
          {key}: <ObjectItem object={props[key]} />
        </li>
      ))}
    </>
  );
}

function ObjectItem({ object }) {
  if (typeof object === "object") {
    return (
      <ul>
        <ObjectReader {...object} />
      </ul>
    );
  }
  return object;
}

export const DefaultView = Template.bind({});

DefaultView.args = {
  video,
  debug: true,
  details: true,
  small: false,
  limit: 4,
};
