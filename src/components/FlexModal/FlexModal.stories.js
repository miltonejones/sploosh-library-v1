import { Button } from "@material-ui/core";
import React, { useState } from "react";
import FlexModal, { FlexModalConfig } from "./FlexModal";

export default {
  title: "Common/FlexModal",
  component: FlexModal,
};

const Template = (args) => {
  const { text, head, quiz } = args;
  const [dialogProps, setDialogProps] = useState({});
  const [answer, setAnswer] = useState("nothing yet");
  const dialog = FlexModalConfig(setDialogProps);
  const shout = (_) => dialog(text, head, quiz).then(setAnswer);
  return (
    <>
      <FlexModal {...dialogProps} />
      answer: {answer.toString()}
      <Button onClick={shout}>Show {head} Dialog</Button>
    </>
  );
};

export const DefaultView = Template.bind({});
export const PromptView = Template.bind({});

DefaultView.args = {
  text: "Confirm Dialog",
  head: "Confirm",
};
PromptView.args = {
  text: "Prompt Dialog",
  head: "Prompt",
  quiz: "Enter text here",
};
