import { Avatar, Chip, Collapse } from "@material-ui/core";
import { AddAPhoto, Close, Filter, LibraryAdd } from "@material-ui/icons";

import React, { useEffect, useRef, useState } from "react";
import {
  addURLWithModel,
  assignModel,
  getData,
  getUnattributedVideos,
  setModelAlias,
  setModelImage,
} from "../../services/VideoData";
import { PromiseChain } from "../../util/PromiseChain";
import { collate, getVideosByParam } from "../../util/Strings";
import ActionTextField from "../Common/ActionTextField/ActionTextField";
import ModelList from "../Common/Model/ModelList/ModelList";
import ModelPopoverSelect from "../Common/ModelPopoverSelect/ModelPopoverSelect";
import PaginationBar from "../Common/PaginationBar/PaginationBar";
import ThumbnailGrid from "../Common/Thumbnail/ThumbnailGrid/ThumbnailGrid";
import ToolTipButton from "../Common/ToolTipButton/ToolTipButton";
import VideoEditRow from "../Common/VideoEditRow/VideoEditRow";
import "./ModelInfoCard.css";
import { DrawButtons, ModelInfoCardMode } from "./ModelInfoMainToolbar";

const getModelVideos = (id) => {
  return getData({ id }, "model");
};

const ModelInfoCard = ({ id, titleClick, modelClick, shopClick, update }) => {
  const [page, setPage] = useState(1);
  const [buttons, setButtons] = useState([]);
  const [unattributed, setUnattributed] = useState(null);

  const param = useRef(false);
  const setParam = (v) => (param.current = v);
  const model = useRef(false);
  const setModel = (v) => (model.current = v);
  const mode = useRef(ModelInfoCardMode.NORMAL);
  const setMode = (v) => (mode.current = v);

  const [shown, setShown] = useState(null);
  useEffect(() => {
    ((!!id && !model.current) || id !== model.current.ID) && loadModel(id);
  });

  const loadModel = (id, reset, p) => {
    getModelVideos(id).then((data) => {
      setModel(data);
      setButtons(DrawButtons(data));
      getPage(p || 1, !0);
      reset && update && update();
      getUnattributedVideos(data).then((u) => {
        console.log({ u });
        setUnattributed(u);
        setButtons(DrawButtons(data, u, null, assignUnattributed));
      });
    });
  };

  const filterBy = (f) => {
    setParam(f);
    getPage(1, !0);
  };

  const getPage = (i, reset) => {
    const videos = model.current?.related;
    const favorites = videos?.filter((f) => !!f.favorite);
    const collected =
      mode.current === ModelInfoCardMode.FAVORITE ? favorites : videos;
    const collated = collate(getVideosByParam(collected, param.current), 16, i);
    const costars = collate(model.current?.costars, 24, i);

    reset && setMode(ModelInfoCardMode.NORMAL);
    setShown(mode.current === ModelInfoCardMode.COSTAR ? costars : collated);
    setPage(i);
  };

  const handleToolbarButtonClick = (btn) => {
    !!btn.shop && shopClick && shopClick(model.current.name);
    !!btn.mode &&
      (function () {
        setMode(
          mode.current === ModelInfoCardMode.NORMAL
            ? ModelInfoCardMode[btn.mode]
            : ModelInfoCardMode.NORMAL
        );
        clearSelected();
        btn.mode === "ASSIGN" &&
          setButtons(
            DrawButtons(
              model.current,
              unattributed,
              mode.current,
              assignUnattributed
            )
          );
        getPage(btn.mode === "SELECT" ? page : 1);
      })();
  };

  const setSelected = (fn) => {
    const truncated = shown.truncated?.map((vid) => {
      fn && fn(vid);
      return vid;
    });
    const selected = truncated.filter((f) => !!f.selected);
    const updated = { ...shown, truncated, selected };
    setShown(updated);
  };

  const clearSelected = () => {
    setSelected((vid) => {
      vid.selected = !1;
    });
  };

  const toggleSelected = (err) => {
    setSelected((f) => {
      (f.error || !err) && (f.selected = !f.selected);
    });
  };

  const titleChoose = (v) => {
    setSelected((vid) => {
      vid.ID === v.ID && (vid.selected = !vid.selected);
    });
  };

  const refresh = (p) => loadModel(model.current?.ID, !0, p);

  const addImageToModel = (path) => {
    const ID = model.current.ID;
    setModelImage(ID, path).then(refresh);
  };

  const addByKey = (path) => {
    const ID = model.current.ID;
    const payload = { page: 1, mask: `title/${path}`, simple: 1, desc: 1 };
    getData(payload, "video").then((answer) => {
      if (answer?.rows?.length) {
        const video = answer.rows[0];
        return assignModel(ID, video?.ID).then(refresh);
      }
    });
  };

  const addVideoToModel = (path) => {
    const ID = model.current.ID;
    const re = /^(\w+-\d+)$/.exec(path);
    if (!!re) {
      addByKey(path);
      return;
    }
    addURLWithModel(path, ID).then(refresh);
  };

  const assignUnattributed = () => {
    const ID = model.current.ID;
    PromiseChain(
      unattributed.filter((f) => f.selected).map((u) => assignModel(ID, u.ID))
    ).then(refresh);
  };

  const setAlias = (m) => {
    const ID = model.current.ID;
    setModelAlias(m.ID, ID).then(refresh);
  };

  if (!shown?.length) {
    return <em>loading...</em>;
  }

  return (
    <div className="ModelInfoCard">
      {shown?.length && (
        <>
          {/* primary toolbar */}
          <div className="flexed full ">
            <div className="model-info-avatar">
              <Avatar alt={model.current?.name} src={model.current?.image} />
            </div>
            <PaginationBar
              {...shown}
              small
              click={(i) => {
                getPage(page + i);
              }}
            />
            <div className="model-info-menu flexed">
              {buttons?.map((button, i) => (
                <ToolTipButton
                  active={
                    button.mode &&
                    mode.current === ModelInfoCardMode[button.mode]
                  }
                  click={() => {
                    handleToolbarButtonClick(button);
                  }}
                  small
                  key={i}
                  {...button}
                />
              ))}
            </div>
          </div>

          {/* edit toolbar */}
          <Collapse in={mode.current === ModelInfoCardMode.SELECT}>
            <VideoEditRow
              editingID={model.current?.ID}
              selectedItemList={shown.selected}
              deselect={toggleSelected}
              complete={refresh}
            />
          </Collapse>

          {/* video list */}
          <Collapse
            in={
              mode.current === ModelInfoCardMode.NORMAL ||
              mode.current === ModelInfoCardMode.SELECT
            }
          >
            <ThumbnailGrid
              modelClick={modelClick}
              titleClick={(v) => {
                if (mode.current === ModelInfoCardMode.SELECT) {
                  return titleChoose(v);
                }
                titleClick(v);
              }}
              small
              refresh={() => refresh(page)}
              videos={shown.truncated}
            />
          </Collapse>

          {/* favorite videos */}
          <Collapse in={mode.current === ModelInfoCardMode.FAVORITE}>
            <ThumbnailGrid
              modelClick={modelClick}
              titleClick={(v) => {
                if (mode.current === ModelInfoCardMode.SELECT) {
                  return titleChoose(v);
                }
                titleClick(v);
              }}
              small
              videos={shown.truncated}
              refresh={refresh}
            />
          </Collapse>

          {/* costar list */}
          <Collapse in={mode.current === ModelInfoCardMode.COSTAR}>
            {!!shown?.truncated.length && (
              <ModelList grid click={modelClick} models={shown.truncated} />
            )}
          </Collapse>
          {/* costar list */}
          <Collapse in={mode.current === ModelInfoCardMode.ASSIGN}>
            {!!unattributed?.length && (
              <ThumbnailGrid
                videos={unattributed}
                titleClick={(v) =>
                  setUnattributed((u) =>
                    u.map((f) => {
                      f.ID === v.ID && (f.selected = !f.selected);
                      return f;
                    })
                  )
                }
                small
              />
            )}
          </Collapse>
          {/* edit panel */}
          <Collapse in={mode.current === ModelInfoCardMode.EDIT}>
            <ModelEditRow
              filterParam={param.current}
              filterVideos={filterBy}
              aliases={model.current.aliases}
              openStar={modelClick}
              setAlias={setAlias}
              addImageToModel={addImageToModel}
              addVideoToModel={addVideoToModel}
            />
          </Collapse>
        </>
      )}
    </div>
  );
};

ModelInfoCard.defaultProps = {};
export default ModelInfoCard;

function ModelEditRow({
  filterParam,
  aliases,
  filterVideos,
  openStar,
  setAlias,
  addVideoToModel,
  addImageToModel,
}) {
  return (
    <>
      <div className="flexed">
        <ActionTextField
          commit={(i) => filterVideos && filterVideos(i)}
          text="filter"
          icon={<Filter />}
        />
        {!!filterParam?.length && (
          <ToolTipButton
            icon={<Close />}
            click={() => filterVideos && filterVideos("")}
            text="clear filter"
          />
        )}
      </div>

      <div className="flexed">
        {!!aliases?.length && (
          <div>
            AKA:{" "}
            {aliases.map((alias) => (
              <Chip
                variant="outlined"
                size="small"
                onClick={() => openStar && openStar(alias)}
                avatar={<Avatar alt={alias.name} src={alias.image} />}
                label={alias.name}
              />
            ))}
          </div>
        )}
        <ModelPopoverSelect
          text="add model alias"
          onModelSelect={(m) => setAlias && setAlias(m)}
        />
      </div>

      <div className="flexed">
        <ActionTextField
          commit={(i) => addVideoToModel && addVideoToModel(i)}
          text="add video"
          icon={<LibraryAdd />}
          empty
        />
        <ActionTextField
          commit={(i) => addImageToModel && addImageToModel(i)}
          text="add image"
          icon={<AddAPhoto />}
          empty
        />
      </div>
    </>
  );
}
