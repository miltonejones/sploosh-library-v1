import { Collapse } from "@material-ui/core";
import { CheckCircleOutline } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { getData } from "../../services/VideoData";
import PaginationBar from "../Common/PaginationBar/PaginationBar";
import ThumbnailGrid from "../Common/Thumbnail/ThumbnailGrid/ThumbnailGrid";
import ToolTipButton from "../Common/ToolTipButton/ToolTipButton";
import VideoEditRow from "../Common/VideoEditRow/VideoEditRow";
import "./TagWordInfoCard.css";

const TagWordInfoCard = ({ tag, update, titleClick, modelClick }) => {
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState(false);
  const [tagword, setTagword] = useState(null);

  // !(tagword?.loaded && tagword?.related) && loadTagWord(tag);

  useEffect(() => {
    !(tagword?.loaded && tagword?.related) && loadTagWord(tag);
    // ((!!tag && !tagword) || tag !== tagword?.Tag) &&
    //   tagword?.loaded &&
    //   loadTagWord(tag);
  });

  const getPage = (p) => {
    setTagword({ ...tagword, loaded: false });
    setPage((i) => i + p);
  };

  const loadTagWord = (word, reset) => {
    const payload = { word, page };
    getData(payload, "tag").then((data) => {
      setTagword({ ...data, loaded: true });
      console.log({ data });
      reset && update && update();
    });
  };

  const refresh = (reset) => loadTagWord(tagword.Tag, reset);

  if (!tagword?.related) {
    return <em>Loading...</em>;
  }
  const setSelected = (fn) => {
    const related = tagword.related?.map((vid) => {
      fn && fn(vid);
      return vid;
    });
    const selected = related.filter((f) => !!f.selected);
    setTagword({ ...tagword, related, selected });
  };

  const titleChoose = (v) => {
    setSelected((vid) => {
      vid.ID === v.ID && (vid.selected = !vid.selected);
    });
  };

  const toggleSelected = (err) => {
    setSelected((f) => {
      (f.error || !err) && (f.selected = !f.selected);
    });
  };

  return (
    <div className="TagWordInfoCard">
      <div className="flexed">
        <PaginationBar
          pageSize={16}
          click={getPage}
          length={tagword.count}
          startPage={page - 1}
          small
        />

        <div className="pull-right">
          <ToolTipButton
            icon={<CheckCircleOutline />}
            active={edit}
            click={() => setEdit(!edit)}
          />
        </div>
      </div>

      {/* edit toolbar */}
      <Collapse in={edit}>
        <VideoEditRow
          selectedItemList={tagword.selected}
          deselect={toggleSelected}
          complete={refresh}
        />
      </Collapse>

      <ThumbnailGrid
        modelClick={modelClick}
        titleClick={(v) => {
          if (edit) {
            return titleChoose(v);
          }
          titleClick && titleClick(v);
        }}
        small
        videos={tagword.related}
      />
    </div>
  );
};

TagWordInfoCard.defaultProps = {};
export default TagWordInfoCard;
