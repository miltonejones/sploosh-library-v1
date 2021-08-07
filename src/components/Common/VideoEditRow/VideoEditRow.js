import {
  CheckBox,
  Delete,
  ErrorOutline,
  Launch,
  Sync,
} from "@material-ui/icons";
import React, { useState } from "react";
import {
  addURL,
  addURLWithModel,
  assignModel,
  deleteVideo,
} from "../../../services/VideoData";
import { WindowManagerService } from "../../../services/WindowManager";
import { PromiseChain } from "../../../util/PromiseChain";
import { keyFromText } from "../../../util/Strings";
import FlexModal, { FlexModalConfig } from "../../FlexModal/FlexModal";
// import ModelDataInput from "../Model/ModelDataInput/ModelDataInput";
import ModelPopoverSelect from "../ModelPopoverSelect/ModelPopoverSelect";
import ToolTipButton from "../ToolTipButton/ToolTipButton";
import "./VideoEditRow.css";

const VideoEditButtons = (count, refind, remove, update, deselect) => [
  {
    icon: <Sync />,
    count,
    click: () => update && update(),
  },
  {
    icon: <Launch />,
    count,
    click: () => refind && refind(),
  },
  {
    icon: <Delete />,
    count,
    click: () => remove && remove(),
  },
  {
    icon: <CheckBox />,
    click: () => deselect && deselect(),
  },
  {
    icon: <ErrorOutline />,
    click: () => deselect && deselect(true),
  },
];

const VideoEditRow = ({
  deselect,
  selectedItemList,
  complete,
  editingID,
  unattributed,
}) => {
  const [dialogProps, setDialogProps] = useState({});
  const selectCount = selectedItemList?.length;
  const ask = FlexModalConfig(setDialogProps);
  const refind = () => {
    const keys = selectedItemList
      .map((f) => keyFromText(f.title))
      .filter((f) => !!f.length);
    const url = WindowManagerService.javdoeSearchLink(keys);
    remove();
    window.open(url);
  };

  const remove = () => {
    deleteKeys(selectedItemList.map((f) => f.ID));
  };

  const deleteKeys = (keys) => {
    ask(`Delete ${keys.length} items permanently?`).then((yes) => {
      if (yes) {
        PromiseChain(keys.map((key) => deleteVideo(key))).then(
          () => complete && complete()
        );
      }
    });
  };
  const update = () => {
    PromiseChain(
      selectedItemList.map((g) => {
        return editingID ? addURLWithModel(g.URL, editingID) : addURL(g.URL);
      })
    ).then(() => complete && complete());
  };
  const addModelToSelected = (star) => {
    PromiseChain(
      selectedItemList.map(({ ID }) => assignModel(star.ID, ID))
    ).then(() => complete && complete());
  };

  if (!selectCount) {
    return (
      <div className="flexed right">
        <em>select some items to continue...</em>
        <ToolTipButton
          small
          icon={<CheckBox />}
          title="select all"
          click={() => deselect()}
        />
        <ToolTipButton
          small
          icon={<ErrorOutline />}
          title="select all"
          click={() => deselect(true)}
        />
      </div>
    );
  }

  const buttons = VideoEditButtons(
    selectCount,
    refind,
    remove,
    update,
    deselect
  );

  return (
    <div className="VideoEditRow flexed right">
      {buttons?.map((button, i) => (
        <ToolTipButton small key={i} {...button} />
      ))}
      <ModelPopoverSelect
        text={`add model to ${selectCount} videos`}
        onModelSelect={(m) => addModelToSelected(m)}
      />

      <FlexModal {...dialogProps} />
    </div>
  );
};

VideoEditRow.defaultProps = {};
export default VideoEditRow;
