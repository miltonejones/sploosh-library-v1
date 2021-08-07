import React from "react";
import ParserEditCard from "./ParserEditCard";
import parsers from "../../stories/assets/parsers.json";

export default {
  title: "ParserEditCard",
  component: ParserEditCard,
};

const Template = (args) => <ParserEditCard parser={parsers[1]} {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {};
