import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { useRef, useState } from "react";
import ModelInfoCard from "../ModelInfoCard/ModelInfoCard";
import VideoInfoCard from "../VideoInfoCard/VideoInfoCard";
import {
  Breadcrumbs,
  DialogTitle,
  makeStyles,
  Typography,
} from "@material-ui/core";
import "./GlobalModal.css";
import TagWordInfoCard from "../TagWordInfoCard/TagWordInfoCard";
import TabbedSearchCard from "../TabbedSearchCard/TabbedSearchCard";
import ShoppingCard from "../ShoppingCard/ShoppingCard";

const useStyles = makeStyles((theme) => ({
  outer: {
    // border: "solid 2px orange",
    height: 680,
    width: 660,
    padding: "8px",
    maxWidth: 660,
    "&.wide": {
      width: 1030,
      maxWidth: 1030,
    },
  },
  content: {
    // border: "dotted 1px green",
    display: "flex",
    justifyContent: "center",
  },
  title: {
    // border: "dotted 1px red",
    // boxShadow: "1px 1px 2px #777",
    borderRadius: "5px",
    backgroundColor: "#f0f0ff",
    height: "24px",
    padding: "4px 10px 0px 8px",
    overflow: "hidden",
  },
}));

const GlobalModal = (props) => {
  const classes = useStyles();
  const { send, open = false, content, refresh } = props;
  const [args, setArgs] = useState({});
  const crumbs = useRef([]);
  const setCrumbs = (c) => (crumbs.current = c);

  const close = () => {
    send && send(false);
  };

  const expand = (t) => setArgs((a) => ({ ...a, wide: t }));

  const update = (c) => {
    const edited = crumbs.current.filter((f) => f.key !== c.key);
    edited.push(c);
    setCrumbs(edited);
    return Promise.resolve(true);
  };

  const modelClick = (m) =>
    update(ModelContent(m)).then(() => setArgs(starObj(m.ID || m.modelFk)));
  const titleClick = (v) =>
    update(VideoContent(v)).then(() => setArgs(videoObj(v)));
  const wordClick = (v) =>
    update(TagWordContent(v)).then(() => setArgs(wordObj(v)));
  const shopClick = (v) =>
    update(ShopContent(v)).then(() => setArgs(shopObj(v)));

  const wordObj = (tag) => ({ tag, titleClick, modelClick });
  const starObj = (id) => ({ id, titleClick, modelClick, shopClick });
  const videoObj = (video) => ({ video, modelClick, wordClick });
  const searchObj = () => ({ search: 1, wide: 1, modelClick, titleClick });
  const shopObj = (param) => ({ shop: 1, param, expand });

  const setData = (data, reset) => {
    const types = {
      video: videoObj(data?.item),
      model: starObj(data?.key),
      tag: wordObj(data?.key),
      search: searchObj(),
      shop: shopObj(data?.item),
    };
    setArgs(types[data.type]);
    reset && setCrumbs([data]);
  };

  const maxWidth = crumbs.current?.length < 5 ? 160 : 80;

  return (
    <div className="GlobalModal">
      {" "}
      <Dialog
        classes={{ paper: [classes.outer, args?.wide ? "wide" : ""].join(" ") }}
        open={open}
        onClose={() => close()}
        onEntering={() => setData(content, !0)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle classes={{ root: classes.title }} id="alert-dialog-title">
          <Breadcrumbs aria-label="breadcrumb" maxItems={6} separator="›">
            {!!crumbs.current.length &&
              crumbs.current.map((m, i) => (
                <Typography
                  key={i}
                  style={{ maxWidth, fontSize: "0.8rem" }}
                  classes={{ root: "no-wrap" }}
                  color="textPrimary"
                >
                  <label
                    className={[
                      "app-link",
                      i === crumbs.current.length - 1 ? "bold" : "",
                    ].join(" ")}
                    title={m.name}
                    onClick={() => update(m).then(() => setData(m))}
                  >
                    {m.name}
                  </label>
                </Typography>
              ))}
          </Breadcrumbs>
        </DialogTitle>

        <DialogContent classes={{ root: classes.content }}>
          {!!args?.video && <VideoInfoCard update={refresh} {...args} />}
          {!!args?.id && <ModelInfoCard update={refresh} {...args} />}
          {!!args?.tag && <TagWordInfoCard update={refresh} {...args} />}
          {!!args?.search && <TabbedSearchCard update={refresh} {...args} />}
          {!!args?.shop && <ShoppingCard update={refresh} {...args} />}
          {/* {JSON.stringify(crumbs.current)} */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

GlobalModal.defaultProps = {};
export default GlobalModal;

const VideoContent = (v) => ({
  type: "video",
  key: v.ID,
  item: v,
  name: v.title,
});

const ModelContent = (v) => ({
  type: "model",
  key: v.ID || v.modelFk,
  item: v,
  name: v.name,
});

const TagWordContent = (v) => ({
  type: "tag",
  key: v,
  item: v,
  name: `Tag: "${v}"`,
});

const ShopContent = (v) => ({
  type: "shop",
  key: v,
  item: v,
  name: `Shop for: "${v}"`,
});

const DialogConfig = (make) => (content) =>
  new Promise((callback) => {
    make({
      content,
      open: true,
      send: (what) => {
        callback(what);
        make({});
      },
    });
  });

export {
  DialogConfig,
  VideoContent,
  ModelContent,
  TagWordContent,
  ShopContent,
};
