import {
  Favorite,
  Schedule,
  SupervisorAccount,
  Theaters,
} from "@material-ui/icons";

const API_HOST = "http://db.audiopirate.nl:2380";
const DEFAULT_IMAGE = "/assets/XXX.jpg";
const DEFAULT_MODEL_IMAGE = "/assets/no-img-women.jpg";
const APP_NAME = "Sploosh!.me.uk";
const APP_LOGO = "/assets/sploosh.png";
const VIDEO_LOADING_IMAGE =
  "https://i.pinimg.com/564x/71/f8/39/71f8399e978e203b23e3936a71a56c5d.jpg";
const WINDOW_REGIONS = [
  {
    width: 760,
    height: 428,
    x: 0,
    y: 0,
  },
  {
    width: 840,
    height: 480,
    x: 760,
    y: 0,
  },
  {
    width: 640,
    height: 360,
    x: 0,
    y: 600,
  },
  {
    width: 480,
    height: 280,
    x: 640,
    y: 600,
  },
  {
    width: 480,
    height: 280,
    x: 1120,
    y: 600,
  },
];
const VIDEO_SORT_KEYS = [
  {
    label: "Date Added",
    field: "ID",
  },
  {
    label: "Title",
    field: "title",
  },
];
const MODEL_SORT_KEYS = [
  {
    label: "Liked",
    field: "likedCount",
  },
  {
    label: "Count",
    field: "videoCount",
  },
  {
    label: "Date Added",
    field: "ID",
  },
  {
    label: "Name",
    field: "name",
  },
];

const ROUTES = [
  // {
  //   label: "Home",
  //   path: "/home",
  //   icon: <Home />,
  //   flag: "home",
  // },

  {
    label: "Videos",
    path: "/video/1/ID/1",
    icon: <Theaters />,
    flag: "video",
  },

  {
    label: "Favorites",
    path: "/favorite/1/ID/1",
    icon: <Favorite />,
    flag: "favorite",
  },

  {
    label: "Recent",
    path: "/recent/1/ID/1",
    icon: <Schedule />,
    flag: "recent",
  },
  {
    label: "Models",
    path: "/model/1/ID/1",
    icon: <SupervisorAccount />,
    flag: "model",
  },
];

export {
  API_HOST,
  DEFAULT_IMAGE,
  DEFAULT_MODEL_IMAGE,
  APP_NAME,
  APP_LOGO,
  WINDOW_REGIONS,
  ROUTES,
  VIDEO_SORT_KEYS,
  MODEL_SORT_KEYS,
  VIDEO_LOADING_IMAGE,
};
