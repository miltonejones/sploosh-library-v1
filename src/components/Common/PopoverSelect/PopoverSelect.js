import {
  Avatar,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  TextField,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";
import { Save, Sync } from "@material-ui/icons";
import React from "react";
import "./PopoverSelect.css";
import { rxcs } from "../../../util/Strings";

const PopoverOption = ({ option, onSelect }) => {
  const theme = useTheme();
  const backgroundColor = option.active ? theme.palette.primary.main : "";
  return (
    <>
      <ListItem
        style={{ backgroundColor }}
        onClick={() => onSelect && onSelect(option)}
      >
        {!!option.avatar && (
          <ListItemAvatar>
            <Avatar {...option.avatar}>{option.avatar.icon}</Avatar>
          </ListItemAvatar>
        )}

        <ListItemText
          classes={{ primary: rxcs({ ...option, "app-link": 1 }) }}
          primary={option.value}
          secondary={option.secondary}
        />
      </ListItem>
    </>
  );
};

const PopoverSelect = ({ title, options, icon, promise, onSelect, onSave }) => {
  const [busy, setBusy] = React.useState(false);
  const [on, setOn] = React.useState(grey[300]);
  const [selected, setSelected] = React.useState(null);
  const [parameter, setParameter] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const search = (param) =>
    new Promise((c) =>
      c(
        options?.filter(
          (x) => x.value?.toLowerCase().indexOf(param.toLowerCase()) > -1
        )
      )
    );

  const find = (param, anchor) => {
    setBusy(1);
    const locate = !promise ? search(param) : promise(param);
    locate.then((res) => {
      setBusy(!1);
      setParameter(param);
      setData(res);
      !!res?.length && setAnchorEl(anchor);
    });
  };

  const handleClick = (event) => {
    const { target, currentTarget, keyCode } = event;
    const { value } = target;
    keyCode === 13 && find(value, currentTarget);
    setParameter(value);
  };

  const handleChange = (event) => {
    const { target } = event;
    const { value } = target;
    setParameter(value);
  };

  const select = (o) => {
    (function (adding) {
      if (adding) {
        setParameter("");
        setSelected(null);
        return;
      }
      setParameter(o.value);
      setSelected(o);
    })(o.param);
    onSelect && onSelect(o);
    handleClose();
  };

  const handleSave = () => {
    onSave && onSave(selected);
    setParameter("");
    setSelected(null);
    handleClose();
  };

  const disc = !!selected ? (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={handleSave}
        edge="end"
      >
        <Save />
      </IconButton>
    </InputAdornment>
  ) : (
    ""
  );

  const open = Boolean(anchorEl);
  return (
    <div className="PopoverSelect">
      <div className="popover-input">
        <TextField
          InputProps={{
            "aria-label": "description",
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  aria-label="toggle password visibility"
                  edge="start"
                >
                  {busy ? <Sync /> : icon}
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: disc,
          }}
          autoFocus
          placeholder={title}
          value={parameter}
          onBlur={() => setOn(grey[300])}
          onFocus={() => setOn(grey[600])}
          onKeyUp={handleClick}
          onChange={handleChange}
          classes={{
            root: "inputRoot",
            input: rxcs({ inputInput: 1, on }),
          }}
          inputProps={{ "aria-label": "search" }}
        />
      </div>
      <PopoverWrapper open={open} anchorEl={anchorEl} handleClose={handleClose}>
        <List dense classes={{ root: "pop-list" }}>
          {data?.map((option, i) => (
            <PopoverOption onSelect={select} key={i} option={option} />
          ))}
        </List>
      </PopoverWrapper>
    </div>
  );
};

PopoverSelect.defaultProps = {};

export default PopoverSelect;

function PopoverWrapper({ open, anchorEl, handleClose, children }) {
  const id = open ? "simple-popover" : undefined;
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      {children}
    </Popover>
  );
}
