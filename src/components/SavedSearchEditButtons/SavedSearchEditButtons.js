import { MoreVert } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SearchPersistService } from "../../services/SearchPersistService";
import MenuSimple from "../Common/MenuSimple/MenuSimple";
import FlexModal, { FlexModalConfig } from "../FlexModal/FlexModal";
import "./SavedSearchEditButtons.css";

const SavedSearchEditButtons = ({ param, update, find, direct }) => {
  const location = useLocation();
  const [dialogProps, setDialogProps] = useState({});
  const [exists, setExists] = useState(false);
  const [heartMode, setHeartMode] = useState(false);
  const question = FlexModalConfig(setDialogProps);
  const commit = () => {
    if (exists) {
      question("Enter new value", "Update search", param).then((yes) => {
        if (!yes) return;
        update && update(yes);
      });
      return;
    }
    SearchPersistService.saveSearch(param);
    setExists(true);
  };
  const heart = () => {
    // const address = `/search/${param.replace("*", "")}${
    //   heartMode ? "" : "*"
    // }/1/ID/1`;
    const value = param.replace("*", "") + (heartMode ? "" : "*");
    // alert(address);
    direct && direct({ type: "search", value });
    // history.push(address);
  };
  useEffect(() => {
    setExists(SearchPersistService.exists(param?.replace("*", "")));
    setHeartMode(location?.pathname?.indexOf("*") > 0);
    console.log(heartMode.toString(), location?.pathname?.indexOf("*"));
  }, [param, location?.pathname, heartMode]);

  if (!param?.length) return "";

  const items = [
    {
      text: exists ? "Edit Search" : "Save Search",
      action: () => commit(),
      active: exists,
    },
    {
      text: "Favorites Only",
      action: () => heart(),
      active: heartMode,
    },
    {
      text: `Shop for '${param}'`,
      action: () => find && find(param),
    },
  ];
  const menuConfig = {
    items,
    icon: <MoreVert />,
  };
  return (
    <div className="flex-centered">
      <FlexModal {...dialogProps} />
      <MenuSimple {...menuConfig} />
      {/* <ToolTipButton
        active={exists}
        click={commit}
        icon={exists ? "edit" : "save"}
      /> */}
      {/* <ToolTipButton click={heart} active={heartMode} icon="favorite" /> */}
      {/* <ToolTipButton click={() => find(param)} icon="search" /> */}
      {/* <ToolTipButton
        click={() => history.push("/video/1/ID/1")}
        content="Exit search"
        icon="close"
      /> */}
    </div>
  );
};

SavedSearchEditButtons.defaultProps = {};
export default SavedSearchEditButtons;
