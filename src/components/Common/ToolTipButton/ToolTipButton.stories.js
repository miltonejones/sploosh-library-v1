import { MoreHoriz } from "@material-ui/icons";
import React from "react";
import ToolTipButton from "./ToolTipButton";

export default {
  title: "Common/ToolTipButton",
  component: ToolTipButton,
};

const Template = (args) => <ToolTipButton {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {
  icon: <MoreHoriz />,
};
