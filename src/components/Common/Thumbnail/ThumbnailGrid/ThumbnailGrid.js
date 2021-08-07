import React, { useState } from "react";
import "./ThumbnailGrid.css";
import Thumbnail from "../Thumbnail";
import { deleteVideo } from "../../../../services/VideoData";
import FlexModal, { FlexModalConfig } from "../../../FlexModal/FlexModal";

const ThumbnailGrid = ({
  videos,
  small,
  titleClick,
  modelClick,
  studioClick,
  domainClick,
  refresh,
}) => {
  const [dialogProps, setDialogProps] = useState({});
  const dialog = FlexModalConfig(setDialogProps);

  const drop = (v) => {
    dialog(`Delete ${v.title}`).then((yes) => {
      yes && deleteVideo(v.ID).then(() => refresh && refresh());
    });
  };

  return (
    <>
      <div className={["ThumbnailGrid", small ? "small" : ""].join(" ")}>
        {videos &&
          videos.map((video) => (
            <div key={video.ID} className="grid-item">
              <Thumbnail
                trash={drop}
                refresh={refresh}
                small={small}
                limit={small ? 1 : 4}
                studioClick={studioClick}
                domainClick={domainClick}
                modelClick={(model) => modelClick && modelClick(model)}
                titleClick={(video) => titleClick && titleClick(video)}
                video={video}
                details={!small}
              />
            </div>
          ))}
      </div>
      <FlexModal {...dialogProps} />
    </>
  );
};

ThumbnailGrid.defaultProps = {};
export default ThumbnailGrid;
