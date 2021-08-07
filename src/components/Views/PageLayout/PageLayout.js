import React, { useEffect, useState } from "react";
import { AppSidebarExpand } from "../../../util/Observers";
import AppSidebar from "../../Common/AppSidebar/AppSidebar";
import AppToolbar from "../../Common/AppToolbar/AppToolbar";
import WaitingProgress from "../../Common/WaitingProgress/WaitingProgress";
import "./PageLayout.css";

const PageLayout = (props) => {
  const { direct, param, type } = props;
  const [wide, setWide] = useState(false);
  useEffect(() => {
    AppSidebarExpand.subscribe(() => {
      setWide(!wide);
    });
  });
  return (
    <div className="PageLayout">
      <AppToolbar direct={direct} param={param} color="inherit" />
      <div className="layout-body">
        <AppSidebar wide={wide} direct={direct} param={param} type={type} />
        {props.children}
      </div>
      <WaitingProgress />
    </div>
  );
};

PageLayout.defaultProps = {};
export default PageLayout;
