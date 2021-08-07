import React, { useEffect, useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { Avatar } from "@material-ui/core";
import { APP_LOGO, APP_NAME } from "../../../Constants";
import {
  AppSidebarExpand,
  ConnectedVideoGridUnload,
  VideoWindowOpened,
  SearchParamChanged,
} from "../../../util/Observers";
import { WindowManagerService } from "../../../services/WindowManager";
import { ArrowBackIos, Close, FilterCenterFocus } from "@material-ui/icons";
import ParserModal from "../../ParserModal/ParserModal";
import { SearchParams } from "../../TabbedSearchCard/TabbedSearchCard";
import ThreadProgressLine from "../../ShoppingCard/ThreadProgressLine/ThreadProgressLine";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    // outline: "dotted 2px red",
    // border: "solid 1px green",
    margin: 0,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: "all .4s linear",
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
    "&:focus": {
      width: "80ch",
      border: "solid 1px #ddd",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  root: {
    backgroundColor: "white",
    color: "black",
  },
}));

export default function AppToolbar({ color, direct, param }) {
  const classes = useStyles();
  const [value, setValue] = useState(param);
  const [launched, setLaunched] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    VideoWindowOpened.subscribe(setLaunched);
    SearchParamChanged.subscribe(setValue);
  }, [param, value]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const send = (value) => {
    SearchParams.add(value);
    direct && direct({ type: "search", value });
  };
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const back = () => {
    ConnectedVideoGridUnload.next();
    window.history.back();
  };

  return (
    <div className={classes.grow}>
      <AppBar position="static" elevation={1} className={classes.root}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color={color}
            aria-label="open drawer"
            onClick={() => AppSidebarExpand.next()}
          >
            <MenuIcon />
          </IconButton>

          <IconButton
            edge="start"
            className={classes.menuButton}
            color={color}
            aria-label="open drawer"
            onClick={() => back()}
          >
            <ArrowBackIos />
          </IconButton>

          <div onClick={() => direct({ type: "reset" })}>
            <Avatar src={APP_LOGO} title={APP_NAME}>
              A
            </Avatar>
          </div>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              onKeyUp={(e) => {
                e.keyCode === 13 && send(e.target.value);
              }}
              placeholder="Search…"
              value={value}
              onChange={handleChange}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
          <div className={classes.grow}>
            <ThreadProgressLine />
          </div>
          <div className={classes.sectionDesktop}>
            {launched && (
              <>
                <IconButton
                  aria-label="show 17 new notifications"
                  color="inherit"
                  onClick={() => WindowManagerService.exit()}
                >
                  <Close />
                </IconButton>

                <IconButton
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={() => WindowManagerService.focus()}
                  color="inherit"
                >
                  <FilterCenterFocus />
                </IconButton>
              </>
            )}
            <ParserModal />
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
