import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { IconButton } from "@material-ui/core";
import "./MenuSimple.css";
import { CheckBoxRounded } from "@material-ui/icons";

const MenuSimple = ({ items, icon }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="MenuSimple">
      <IconButton size="small" onClick={handleClick} aria-label="delete">
        {icon}
      </IconButton>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {items?.map((item, i) => (
          <MenuItem
            key={i}
            onClick={() => {
              item.action();
              handleClose();
            }}
          >
            {!!item.active && <CheckBoxRounded />}
            {item.text}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

MenuSimple.defaultProps = {};
export default MenuSimple;
