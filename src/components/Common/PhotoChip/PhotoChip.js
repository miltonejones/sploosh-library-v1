import { Avatar, Chip } from "@material-ui/core";
import React from "react";
import { HtmlTooltip } from "../HtmlToolTip/HtmlToolTip";
import "./PhotoChip.css";

const PhotoChip = (props) => {
  const { text, image } = props;
  if (image) {
    return (
      <HtmlTooltip
        title={<img alt={text} className="model-tooltip-image" src={image} />}
      >
        <ActualPhotoChip {...props} />
      </HtmlTooltip>
    );
  }
  return <ActualPhotoChip {...props} />;
};

PhotoChip.defaultProps = {};
export default PhotoChip;

function ActualPhotoChip({ click, remove, text, image, active }) {
  return (
    <Chip
      variant={active ? "default" : "outlined"}
      style={{ margin: "1px 2px" }}
      size="small"
      color="primary"
      onClick={() => click && click()}
      avatar={image && <Avatar alt={text} src={image} />}
      label={text}
      onDelete={() => remove && remove()}
    />
  );
}
