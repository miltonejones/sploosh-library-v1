import React from "react";
import "./ThumbnailActionMenuItem.css";

const ThumbnailActionMenuItem = ({ label, icon, active, action }) => {
  return (
    <div
      onClick={() => action && action()}
      className={["ThumbnailActionMenuItem", active ? "active" : ""].join(" ")}
    >
      <div className="thumbnail-action-label">{label}</div>
      <div className="thumbnail-action-icon">{icon}</div>
    </div>
  );
};

ThumbnailActionMenuItem.defaultProps = {};
export default ThumbnailActionMenuItem;
