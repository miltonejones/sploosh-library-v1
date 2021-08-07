import { DeleteForever, Favorite, Launch } from "@material-ui/icons";
import React from "react";
import { WindowManagerService } from "../../../../services/WindowManager";
import ThumbnailActionMenuItem from "../ThumbnailActionMenuItem/ThumbnailActionMenuItem";
import "./ThumbnailActionMenu.css";

const ThumbnailActionMenu = ({ like, trash, track }) => {
  const source = () => {
    WindowManagerService.jav(track);
  };
  const actions = [
    { label: "like", icon: <Favorite />, action: () => like && like(track) },
    {
      label: "delete",
      icon: <DeleteForever />,
      action: () => trash && trash(track),
    },
    { label: "source", icon: <Launch />, action: () => source && source() },
  ];

  return (
    <div className="ThumbnailActionMenu">
      {" "}
      {actions.map((action) => (
        <ThumbnailActionMenuItem track={track} key={action.label} {...action} />
      ))}
    </div>
  );
};

ThumbnailActionMenu.defaultProps = {};
export default ThumbnailActionMenu;
