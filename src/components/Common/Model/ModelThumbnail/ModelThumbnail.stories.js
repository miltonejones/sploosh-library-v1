import React from "react";
import ModelThumbnail from "./ModelThumbnail";

export default {
  title: "Model/ModelThumbnail",
  component: ModelThumbnail,
};

const Template = (args) => <ModelThumbnail {...args} />;

export const DefaultView = Template.bind({});

DefaultView.args = {
  model: {
    ID: 10155,
    name: "Koiwa Ito",
    image: "//pics.dmm.co.jp/mono/movie/adult/1kmhrs001/1kmhrs001ps.jpg",
    likedCount: 40,
  },
};
