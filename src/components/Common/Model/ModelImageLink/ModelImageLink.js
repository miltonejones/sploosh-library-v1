import React from "react";
import { DEFAULT_MODEL_IMAGE } from "../../../../Constants";
import { HtmlTooltip } from "../../HtmlToolTip/HtmlToolTip";
import "./ModelImageLink.css";

const ModelImageLink = ({ name, image, click, last }) => {
  const photo = image?.length ? image : DEFAULT_MODEL_IMAGE;
  if (!name?.length) {
    return <em>*</em>;
  }
  return (
    <HtmlTooltip
      placement="top-start"
      title={<img alt={name} className="model-tooltip-image" src={photo} />}
    >
      <span onClick={() => click()} className="app-data-item-model">
        {name}
      </span>
    </HtmlTooltip>
  );
};

ModelImageLink.defaultProps = {
  image: DEFAULT_MODEL_IMAGE,
};
export default ModelImageLink;
