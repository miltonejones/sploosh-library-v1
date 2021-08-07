import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import { likeVideo } from "../../../services/VideoData";
import { WindowManagerService } from "../../../services/WindowManager";
import { makerFromText } from "../../../util/Strings";
import ItemCaption from "../../ItemCaption/ItemCaption";
import ModelList from "../Model/ModelList/ModelList";
import ToolTipImage from "../ToolTipImage/ToolTipImage";
import ToolTipText from "../ToolTipText/ToolTipText";
import RegionMenu from "./RegionMenu/RegionMenu";
import "./Thumbnail.css";
import ThumbnailActionMenu from "./ThumbnailActionMenu/ThumbnailActionMenu";
import ThumbnailOptionMenu from "./ThumbnailOptionMenu/ThumbnailOptionMenu";

const Thumbnail = ({
  video,
  debug,
  details,
  limit,
  titleClick,
  modelClick,
  domainClick,
  studioClick,
  refresh,
  small,
  trash,
}) => {
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);
  const { image, title, models, domain, favorite, selected } = video;
  const studio = makerFromText(title);
  const star = models?.filter((f) => !!f.image)[0];

  const setError = () => {
    Object.assign(video, { error: 1 });
  };

  const like = (v) => {
    likeVideo(v).then(() => refresh && refresh());
  };

  const launch = (i) => {
    WindowManagerService.launch(video, i);
    setRegionMenuOpen(false);
  };
  const toggleRegionMenu = () => {
    setRegionMenuOpen(!regionMenuOpen);
  };
  const visited = WindowManagerService.visited(video);
  return (
    <div
      className={[
        "Thumbnail",
        debug ? "debug" : "",
        small ? "small" : "",
        !!favorite ? "favorite" : "",
        !!selected ? "selected" : "",
        !!visited ? "visited" : "",
        !!video.error ? "error" : "",
      ].join(" ")}
    >
      <RegionMenu
        click={launch}
        width={small ? 152 : 248}
        height={small ? 90 : 150}
        open={regionMenuOpen}
      />
      <div className="thumb-action-menu">
        <ThumbnailActionMenu
          track={video}
          like={like}
          trash={trash}
          refresh={refresh}
        />
      </div>

      <div onClick={toggleRegionMenu}>
        <ToolTipImage
          setError={setError}
          css="thumb-image"
          image={image}
          title={title}
        />
      </div>

      <div className="thumb-title-row">
        {!!star && !small && (
          <div className="thumb-title-avatar">
            <Avatar alt={star.name} src={star.image} />
          </div>
        )}

        <div
          className="thumb-title"
          onClick={() => titleClick && titleClick(video)}
        >
          <ItemCaption
            limit={small ? 16 : star?.image ? 20 : 25}
            wide={!star?.image}
            title={title}
            details={details}
          />{" "}
        </div>

        {!small && (
          <div className="thumb-menu">
            <ThumbnailOptionMenu refresh={refresh} video={video} />
          </div>
        )}
      </div>
      <div className="thumb-model-row">
        <ModelList
          click={modelClick}
          small={small}
          models={models}
          limit={limit}
          insert={() => titleClick && titleClick(video)}
        />
      </div>
      <div className="thumb-info-row">
        {details && (
          <div
            onClick={() => domainClick && domainClick(domain)}
            className="app-data-item-domain app-link "
          >
            {domain}
          </div>
        )}
        {studio && details && (
          <div
            onClick={() => studioClick && studioClick(studio)}
            className="app-data-item-maker app-link blue"
          >
            <ToolTipText
              title={`Show all videos from ${studio}`}
              text={`${studio}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

Thumbnail.defaultProps = {};
export default Thumbnail;

function PreviewThumb(props) {
  const {
    selected,
    existing,
    Text,
    URL,
    Time,
    Photo,
    select,
    exact,
    domain,
    match,
  } = props;
  const className = ["app-data-item"];
  if (selected) className.push("visited");
  if (existing) className.push("selected");
  if (exact) className.push("favorite");
  return (
    <div className={className.join(" ")}>
      <ToolTipImage
        match={match}
        title={Text}
        image={Photo}
        click={() => select()}
      />
      <ItemCaption
        match={match}
        title={Text}
        details
        click={() => window.open(URL)}
      />
      {Time && <div className="app-data-item-domain app-link">{Time}</div>}
      <div className="app-data-item-maker" style={{ maxWidth: 80 }}>
        <ToolTipText title={`Show all videos from ${domain}`} text={domain} />
      </div>
    </div>
  );
}

export { PreviewThumb };
