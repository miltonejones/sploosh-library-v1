import React from "react";
import { DEFAULT_MODEL_IMAGE } from "../../../../Constants";
import ImageLoader from "../../ImageLoader/ImageLoader";
import "./ModelThumbnail.css";

const ModelThumbnail = ({ model, click, field, large }) => {
  return (
    <div
      className={["ModelThumbnail", large ? "large" : ""].join(" ")}
      onClick={() => click && click(model)}
    >
      <ImageLoader
        alt={model.name}
        count={field === "likedCount" ? model.likedCount : model.videoCount}
        image={model.image || DEFAULT_MODEL_IMAGE}
      />
      <div className="app-link blue">{model.name}</div>
    </div>
  );
};

ModelThumbnail.defaultProps = {};
export default ModelThumbnail;
