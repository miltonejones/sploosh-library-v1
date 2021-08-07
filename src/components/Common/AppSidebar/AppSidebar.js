import { Collapse, Divider, IconButton } from "@material-ui/core";
import { ExpandLess, ExpandMore, MoreVert } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { APP_NAME, ROUTES } from "../../../Constants";
import { SearchPersistService } from "../../../services/SearchPersistService";
import { AppSidebarExpand } from "../../../util/Observers";
import FlexModal, { FlexModalConfig } from "../../FlexModal/FlexModal";
import { SearchParams } from "../../TabbedSearchCard/TabbedSearchCard";
import MenuSimple from "../MenuSimple/MenuSimple";
import "./AppSidebar.css";

const AppSidebar = ({ wide, direct, param, type }) => {
  const [dialogProps, setDialogProps] = useState({});
  const [searches, setSearches] = React.useState([]);
  const [expanded, setExpanded] = useState(false);
  // const searches = SearchPersistService.getSavedSearches();
  const truncated = searches?.slice(0, 10);
  const remaining = searches?.slice(10);

  const remove = (text) => {
    ask(`Really remove search "${text}"?`, "Confirm delete").then((yes) => {
      if (yes) {
        SearchPersistService.dropSearch(text);
        setSearches(SearchPersistService.getSavedSearches());
      }
    });
  };

  const update = (old) => {
    ask("Enter a new value:", "Update search params", old).then((answer) => {
      if (!answer?.length) return;
      SearchPersistService.updateSearch(old, answer);
      setSearches(SearchPersistService.getSavedSearches());
    });
  };

  const ask = FlexModalConfig(setDialogProps);
  useEffect(() => {
    const chosen = ROUTES.filter((f) => f.flag === type)[0];
    !searches?.length && setSearches(SearchPersistService.getSavedSearches());
    // console.log({ chosen });
    !!chosen && (document.title = `${APP_NAME} - ${chosen.label}`);
  }, [searches, type]);

  return (
    <div className={["AppSidebar", wide ? "wide" : ""].join(" ")}>
      <FlexModal {...dialogProps} />
      {ROUTES.map((r, i) => (
        <div
          key={i}
          className={["sidebar-link", r.flag === type ? "active" : ""].join(
            " "
          )}
          onClick={() => direct && direct({ type: "path", value: r.path })}
        >
          <IconButton color={r.flag === type ? "secondary" : "primary"}>
            {r.icon}
          </IconButton>
          <div className="sidebar-label">{r.label}</div>
        </div>
      ))}

      <Divider />

      <h4>Saved Searches</h4>
      {!!wide &&
        truncated?.map((value, i) => (
          <SearchItem
            key={value}
            direct={direct}
            value={value}
            active={value === param}
            update={update}
            remove={remove}
          />
        ))}

      {wide && !!remaining.length && (
        <>
          <div onClick={() => setExpanded(!expanded)} className="app-link">
            <IconButton size="small">
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            Show {remaining.length} {expanded ? "Less" : "More"}
          </div>

          <Collapse in={expanded}>
            {remaining?.map((value, i) => (
              <SearchItem
                key={value}
                direct={direct}
                value={value}
                active={value === param}
                update={update}
                remove={remove}
              />
            ))}
          </Collapse>
        </>
      )}
    </div>
  );
};

AppSidebar.defaultProps = {};
export default AppSidebar;

function SearchItem({ direct, value, active, remove, update }) {
  const send = (value) => {
    AppSidebarExpand.next(false);
    SearchParams.add(value);
    direct && direct({ type: "search", value });
  };
  const className = [
    " flexed sidebar-search",
    "no-wrap",
    " app-link",
    active ? "active" : "",
  ].join(" ");

  const items = [
    {
      text: "Edit Search",
      action: () => update(value),
    },
    {
      text: "Delete",
      action: () => remove(value),
    },
  ];
  const menuConfig = {
    items,
    icon: <MoreVert />,
  };
  return (
    <div key={value} className={className}>
      <IconButton size="small">
        <MenuSimple {...menuConfig} />
      </IconButton>
      <div onClick={() => send(value)}>{value}</div>
    </div>
  );
}
