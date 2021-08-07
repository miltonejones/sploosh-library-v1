import { Tooltip } from "@material-ui/core";
import React from "react";
import "./ToolTipText.css";

const ToolTipText = ({ title, text }) => {
  return (
    <div className="ToolTipText">
      <Tooltip title={title}>
        <span>{text}</span>
      </Tooltip>
    </div>
  );
};

ToolTipText.defaultProps = {};
export default ToolTipText;
