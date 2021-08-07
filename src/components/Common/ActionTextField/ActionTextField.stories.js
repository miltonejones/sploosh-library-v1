import { Add, Search } from "@material-ui/icons";
import React from "react";
import ActionTextField from "./ActionTextField";

export default {
  title: "Common/ActionTextField",
  component: ActionTextField,
};

const Template = (args) => <ActionTextField {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {
  icon: <Add />,
  text: "Enter text",
  commit: window.alert,
  description: "desc",
  initial: "",
  button: <Search />,
};
