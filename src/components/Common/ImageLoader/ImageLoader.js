import { Badge } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { DEFAULT_IMAGE } from "../../../Constants";
import "./ImageLoader.css";

const ImageLoader = (props) => {
  const { image, alt, def = DEFAULT_IMAGE, count, css, setError } = props;
  const [loaded, setLoaded] = useState(false);
  const [photo, setPhoto] = useState("");
  useEffect(() => {
    const im = new Image();
    im.onload = () => {
      setPhoto(im.src);
      setLoaded(true);
    };
    im.onerror = () => {
      setPhoto(def);
      setLoaded(true);
      setError && setError();
    };
    im.src = cdnQuickFix(image);
  });

  if (!loaded) {
    return <img className={css} alt={alt} src={def} />;
  }

  return (
    <Badge badgeContent={count} max={999} color="primary">
      <img className={css} alt={alt} src={photo} />
    </Badge>
  );
};

ImageLoader.defaultProps = {};
export default ImageLoader;

function cdnQuickFix(url) {
  return !url ? "" : url.replace("doecdn.me", "cdndoe.xyz");
}

export { cdnQuickFix };
