import React from "react";
import { DEFAULT_IMAGE } from "../../../Constants";
import { HtmlTooltip } from "../HtmlToolTip/HtmlToolTip";
import ImageLoader from "../ImageLoader/ImageLoader";
import "./ToolTipImage.css";

const ToolTipImage = ({ title, image, click, css, setError }) => {
  return (
    <div className="ToolTipImage" onClick={() => click && click()}>
      {" "}
      <HtmlTooltip title={title}>
        <>
          <ImageLoader
            setError={setError}
            def={DEFAULT_IMAGE}
            alt={title}
            css={css}
            image={image}
          />
        </>
      </HtmlTooltip>
    </div>
  );
};

ToolTipImage.defaultProps = {};
export default ToolTipImage;
