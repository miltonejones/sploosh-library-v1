import React from "react";
import SavedSearchEditButtons from "./SavedSearchEditButtons";
import { BrowserRouter as Router } from "react-router-dom";
export default {
  title: "SavedSearchEditButtons",
  component: SavedSearchEditButtons,
};

const Template = (args) => (
  <Router>
    <SavedSearchEditButtons {...args} />
  </Router>
);

export const DefaultView = Template.bind({});

DefaultView.args = { param: "butt" };
