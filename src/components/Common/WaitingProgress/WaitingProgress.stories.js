import React from "react";
import WaitingProgress from "./WaitingProgress";
import Button from "@material-ui/core/Button";
import { ServerConnected } from "../../../util/Observers";

export default {
  title: "Common/WaitingProgress",
  component: WaitingProgress,
};

const Template = (args) => {
  return (
    <>
      <WaitingProgress {...args} />
      <Button onClick={() => ServerConnected.next(true)}>Open</Button>
    </>
  );
};

export const DefaultView = Template.bind({});

DefaultView.args = {};
