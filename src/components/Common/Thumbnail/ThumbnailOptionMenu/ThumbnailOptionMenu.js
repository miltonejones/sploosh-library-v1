import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { IconButton } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { LocalDb } from "../../../../services/IndexedDb";
import { TABLE_DEF } from "../../../../services/DataDef";
import { contains } from "../../../../util/Strings";
import { setup } from "../../Model/ModelDataInput/ModelDataInput";
import { PromiseChain } from "../../../../util/PromiseChain";
import { assignModel } from "../../../../services/VideoData";

export default function ThumbnailOptionMenu({ video, refresh }) {
  const { title = "Unknown Title" } = video;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const checkNames = () => {
    //stuff in here
    setup().then(() => {
      LocalDb.select(
        TABLE_DEF.name,
        (row) =>
          row.name?.indexOf(" ") > -1 &&
          contains(video.title?.toLowerCase(), row.name?.toLowerCase())
      ).then((data) => {
        console.log({ data });
        const array = [...new Set(data?.map((f) => f.ID))];
        array?.length &&
          PromiseChain(array.map((ID) => assignModel(ID, video.ID))).then(
            () => refresh && refresh()
          );
        handleClose();
      });
    });
  };
  return (
    <div>
      <IconButton size="small" onClick={handleClick} aria-label="delete">
        <MoreVert />
      </IconButton>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          Like "{title.substr(0, 15)}..."
        </MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
        <MenuItem onClick={handleClose}>Open Source</MenuItem>
        <MenuItem onClick={checkNames}>Check Names</MenuItem>
      </Menu>
    </div>
  );
}
ThumbnailOptionMenu.defaultProps = {};
