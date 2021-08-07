import React from "react";
import { Avatar } from "@material-ui/core";
import "./ProgressAvatar.css";
import CircularProgressWithLabel from "../CircularProgressWithLabel/CircularProgressWithLabel";

export default function ProgressAvatar({ photo, message, progress, letter }) {
  return (
    <div className="progress-avatar">
      <Avatar src={photo} title={message} aria-label="recipe">
        {letter?.toUpperCase()}
      </Avatar>
      <div className="progress-ring">
        <CircularProgressWithLabel value={(progress || 1) * 100} />
      </div>
    </div>
  );
}
