import { Chip, Collapse, Tab, Tabs } from "@material-ui/core";
import {
  Add,
  CheckCircleOutline,
  Close,
  FindInPage,
  MoreVert,
  Shop,
  Sync,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { attachModel, getData, postData } from "../../../services/VideoData";
import { VideoPersistService } from "../../../services/VideoPersistService";
import { ConnectedVideoGridUnload } from "../../../util/Observers";
import { chipParse } from "../../../util/Strings";
import ActionTextField from "../../Common/ActionTextField/ActionTextField";
import MenuSimple from "../../Common/MenuSimple/MenuSimple";
import PaginationBar from "../../Common/PaginationBar/PaginationBar";
import ThumbnailGrid from "../../Common/Thumbnail/ThumbnailGrid/ThumbnailGrid";
import ToolTipButton from "../../Common/ToolTipButton/ToolTipButton";
import VideoEditRow from "../../Common/VideoEditRow/VideoEditRow";
import GlobalModal, {
  DialogConfig,
  ModelContent,
  VideoContent,
  ShopContent,
} from "../../GlobalModal/GlobalModal";
import SavedSearchEditButtons from "../../SavedSearchEditButtons/SavedSearchEditButtons";
import {
  a11yProps,
  SearchParams,
} from "../../TabbedSearchCard/TabbedSearchCard";
import "./ConnectedVideoGrid.css";

const collate = (numbers, rows) => {
  const out = [];
  numbers.map((n) => {
    const obj = rows?.filter((row) => row.ID === n)[0];
    return !!obj && out.push(obj);
  });
  return out;
};

const ConnectedVideoGridMode = {
  NORMAL: 0,
  SELECT: 1,
  ADD: 2,
  FIND: 3,
};
const PAGE_SIZE = 30;
const ConnectedVideoGrid = ({
  payload,
  type,
  getPage,
  orderWith,
  getSort,
  direct,
}) => {
  const { page, sort, param } = payload;
  const startPage = (page - 1) * PAGE_SIZE;
  const [response, setResponse] = useState(null);
  const [mode, setMode] = useState(ConnectedVideoGridMode.NORMAL);
  const [dialogProps, setDialogProps] = useState({});
  const show = DialogConfig(setDialogProps);

  useEffect(() => {
    !response?.loaded && load();
    ConnectedVideoGridUnload.subscribe(() => unload());
  });

  const getRecent = () => {
    return new Promise((callback) => {
      const pageSize = 30;
      const recent = VideoPersistService.get();
      const startPage = (page - 1) * pageSize;
      const List = recent.reverse().slice(startPage, startPage + pageSize);
      postData("video", { List }).then((res) => {
        attachModel(res.rows).then((ret) => {
          callback({ rows: collate(List, ret), count: recent.length });
        });
      });
    });
  };

  const load = (reset) => {
    const promise =
      payload.type === "recent" ? getRecent() : getData(payload, type);
    (reset || !response?.loaded) &&
      promise.then((res) => {
        console.log({ res });
        setResponse({ ...res, loaded: true });
        setMode(ConnectedVideoGridMode.NORMAL);
      });
  };
  const unload = (fn) => {
    setResponse({ ...response, loaded: false });
    fn && fn();
  };

  const setPage = (o) => {
    unload(() => getPage(o));
  };

  const setSort = (o) => {
    unload(() => getSort(o));
  };

  const addVideo = (URL) => {
    postData("video", { URL }).then(() => load(!0));
  };

  const toggle = (m) => {
    clearSelected();
    setMode((x) => (x === m ? ConnectedVideoGridMode.NORMAL : m));
  };

  if (!response?.rows) {
    return <em>Loading</em>;
  }

  const menuConfig = {
    items: orderWith?.map((f) => ({
      text: f.title,
      action: () => setSort && setSort(f.field),
      active: f.field === sort,
    })),
    icon: <MoreVert />,
  };

  // const search = () =>
  //   show({ type: "search", name: "Search" }).then(console.log);

  const buttons = [
    {
      icon: <CheckCircleOutline />,
      click: () => toggle(ConnectedVideoGridMode.SELECT),
      active: mode === ConnectedVideoGridMode.SELECT,
    },
    {
      icon: <Add />,
      click: () => toggle(ConnectedVideoGridMode.ADD),
      active: mode === ConnectedVideoGridMode.ADD,
    },
    {
      icon: <FindInPage />,
      click: () => toggle(ConnectedVideoGridMode.FIND),
      when: () => !!SearchParams.params.length,
      //    click: () => search(),
    },
    {
      icon: <Shop />,
      click: () => show({ type: "shop", name: "Shop" }).then(console.log),
    },
    {
      icon: <Sync />,
      click: () => load(!0),
    },
    {
      icon: <Close />,
      click: () => unload(() => direct && direct({ type: "reset" })),
      when: () => !!payload.mask,
    },
  ];

  const setSelected = (fn) => {
    const rows = response.rows?.map((vid) => {
      fn && fn(vid);
      return vid;
    });
    setResponse({ ...response, rows });
  };
  const titleChoose = (v) => {
    setSelected((vid) => {
      vid.ID === v.ID && (vid.selected = !vid.selected);
    });
  };

  const clearSelected = () => {
    setSelected((vid) => {
      vid.selected = !1;
    });
  };

  const deselect = (related, errors) => {
    related.map((f) => (f.error || !errors) && (f.selected = !f.selected));
  };
  const selectedItemList = response.rows?.filter((c) => !!c.selected);

  const args = {
    refresh: () => load(!0),
    titleClick: (v) => {
      if (mode === ConnectedVideoGridMode.SELECT) {
        return titleChoose(v);
      }
      show(VideoContent(v)).then(console.log);
    },
    modelClick: (v) => show(ModelContent(v)).then(console.log),
    videos: response.rows,
    domainClick: (value) =>
      unload(() => direct && direct({ type: "domain", value })),
    studioClick: (value) =>
      unload(() => direct && direct({ type: "studio", value })),
  };

  const nuts = [];
  !!param &&
    param
      .replace("*", "")
      .split("|")
      .map((c) => chipParse(c, nuts));
  const paginatorConfig = {
    startPage,
    pageSize: 30,
    length: response.count,
    click: setPage,
  };

  const handleChange = (event, value) => {
    console.log({ event });
    if (value === 1) return direct && direct({ type: "reset" });
    if (value === -2) {
      SearchParams.remove(payload.param);
      return direct && direct({ type: "reset" });
    }
    direct && direct({ type: "search", value });
  };

  return (
    <div className="ConnectedVideoGrid">
      <div className="flexed video-grid-toolbar">
        {!!response?.count && <PaginationBar {...paginatorConfig} />}
        {!!nuts.length &&
          nuts?.map((nut, i) => (
            <Chip
              onClick={() => {
                direct && direct({ type: "search", value: nut.text });
              }}
              key={i}
              color={nut.and ? "primary" : "default"}
              style={{ margin: 4 }}
              label={nut.text}
            />
          ))}
        {!!nuts.length && (
          <SavedSearchEditButtons
            direct={direct}
            find={(v) => show(ShopContent(v)).then(console.log)}
            update={(v) => direct && direct({ type: "search", value: v })}
            param={param}
          />
        )}
        <div className=" flexed pull-right">
          {buttons?.map((button, i) => (
            <ToolTipButton small key={i} {...button} />
          ))}
          <MenuSimple {...menuConfig} />
        </div>
      </div>
      <Collapse in={mode === ConnectedVideoGridMode.SELECT}>
        <VideoEditRow
          complete={() => {
            load(!0);
          }}
          selectedItemList={selectedItemList}
          deselect={(err) => deselect(response.rows, err)}
        />
      </Collapse>
      <Collapse in={mode === ConnectedVideoGridMode.ADD}>
        <ActionTextField
          commit={addVideo}
          full
          empty
          text="Add video by URL"
          icon={<Add />}
        />
      </Collapse>
      <Collapse in={SearchParams.params.length}>
        {/* {JSON.stringify(payload)} */}
        <Tabs
          value={payload.param || 1}
          onChange={handleChange}
          aria-label="wrapped label tabs example"
        >
          <Tab value={1} label="All Videos" wrapped />
          {SearchParams.params.map((name) => (
            <Tab value={name} label={name} wrapped {...a11yProps(name)} />
          ))}
          {!!payload.param && <Tab icon={<Close />} value={-2} />}
        </Tabs>
      </Collapse>

      <div>
        <ThumbnailGrid {...args} />
      </div>

      {!!response?.count && <PaginationBar {...paginatorConfig} />}
      <GlobalModal refresh={() => load(!0)} {...dialogProps} />
    </div>
  );
};

ConnectedVideoGrid.defaultProps = {
  type: "video",
  payload: {
    page: 1,
    sort: "ID",
    desc: 1,
    simple: 1,
  },
};
export default ConnectedVideoGrid;
