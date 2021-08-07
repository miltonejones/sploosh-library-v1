import React from "react";
import "./ToolTipButton.css";
import { Badge, IconButton } from "@material-ui/core";
import { HtmlTooltip } from "../HtmlToolTip/HtmlToolTip";

function ActualButton({
  click,
  icon,
  disabled,
  small,
  count,
  active,
  indicator,
}) {
  let hue = active ? "secondary" : "primary";
  return (
    <Badge badgeContent={count} max={999} color="primary">
      <IconButton
        classes={{
          root: ["icon-button-no-padding", small ? "sm" : ""].join(" "),
        }}
        onClick={click}
        disabled={disabled}
        color={hue}
      >
        {active && indicator ? indicator : icon}
      </IconButton>
    </Badge>
  );
}

const ToolTipButton = (props) => {
  const { content = "", click, disabled, icon, css, small, when } = props;
  if (!!when && !when()) return "";
  if (disabled) {
    return (
      <div className={css}>
        <ActualButton click={click} icon={icon} disabled small={small} />
      </div>
    );
  }
  return (
    <div className={css}>
      <HtmlTooltip title={content}>
        <>
          <ActualButton {...props} />
        </>
      </HtmlTooltip>
    </div>
  );
};

ToolTipButton.defaultProps = {};
export default ToolTipButton;
