import { Collapse, Tab, Tabs } from "@material-ui/core";
import { ExpandLess, ExpandMore, Filter } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { getData } from "../../services/VideoData";
import { SearchParamChanged } from "../../util/Observers";
import ActionTextField from "../Common/ActionTextField/ActionTextField";
import PaginationBar from "../Common/PaginationBar/PaginationBar";
import ThumbnailGrid from "../Common/Thumbnail/ThumbnailGrid/ThumbnailGrid";
import ToolTipButton from "../Common/ToolTipButton/ToolTipButton";
import "./TabbedSearchCard.css";

function a11yProps(index) {
  return {
    id: `wrapped-tab-${index}`,
    "aria-controls": `wrapped-tabpanel-${index}`,
  };
}

const find = async (param, page, favorite) => {
  const star = favorite ? "*" : "";
  const payload = {
    page,
    sort: "ID",
    desc: 1,
    simple: 1,
    mask: `title/${param}${star}`,
  };
  const answer = await getData(payload, "video");
  console.log({ answer });
  return answer;
};

const TabbedSearchCard = ({ params, modelClick, titleClick }) => {
  // const [searchResults, setSearchResults] = useState({});
  const [state, setState] = useState({});
  const [expanded, setExpanded] = useState(false);
  const searchParam = SearchParams.current();
  const { searchResults = {}, startPage } = state;
  const current = searchResults?.[searchParam];
  const rows = !current ? [] : current.rows;
  const tabParams = SearchParams.get();
  const pageSize = 30;

  useEffect(() => {
    params?.length &&
      !SearchParams.params.length &&
      params.map((p) => SearchParams.add(p));
    SearchParams.params?.length &&
      !current &&
      locate(SearchParams.current(), 1);
  });

  const locate = (name, page, heart) => {
    const { heartMode } = state;
    const startPage = (page - 1) * pageSize;
    find(name, page, heartMode || heart).then((data) => {
      setState({
        searchResults: Object.assign(searchResults, {
          [name]: data,
        }),
        searchParam: name,
        startPage,
        page,
      });
    });
  };

  const getPage = (num) => {
    let { searchParam, page } = state;
    page -= -num;
    locate(searchParam, page);
  };

  const handleChange = (event, searchParam) => {
    console.log({ event });
    SearchParams.is(searchParam);
    setState({ searchParam, page: 1 });
    locate(searchParam, 1);
  };

  const add = (name) => {
    // const { searchParams } = this.state;
    // searchParams.push(name);
    setExpanded(false);

    SearchParams.add(name);
    locate(name, 1);
  };

  return (
    <div className="TabbedSearchCard">
      <Tabs
        value={searchParam}
        onChange={handleChange}
        aria-label="wrapped label tabs example"
      >
        {tabParams.map((name) => (
          <Tab value={name} label={name} wrapped {...a11yProps(name)} />
        ))}
      </Tabs>

      <div className="flexed right">
        {" "}
        {!!current?.count && (
          <PaginationBar
            startPage={startPage}
            pageSize={pageSize}
            length={current?.count}
            click={getPage}
          />
        )}
        <div className="pull-right">
          <ToolTipButton
            small
            icon={expanded ? <ExpandLess /> : <ExpandMore />}
            content="more..."
            click={() => setExpanded(!expanded)}
          />
        </div>
      </div>

      <Collapse
        timeout="auto"
        in={expanded || !tabParams?.length}
        style={{ padding: "0 18px" }}
        unmountOnExit
      >
        <ActionTextField
          commit={(i) => add(i)}
          text="filter"
          icon={<Filter />}
        />
      </Collapse>

      {!!rows?.length && (
        <ThumbnailGrid
          modelClick={modelClick}
          titleClick={titleClick}
          videos={rows}
          small
        />
      )}
    </div>
  );
};

class SearchParams$ {
  params = [];
  param = "";
  get() {
    return this.params;
  }
  add(param) {
    !!param && (this.params = this.of(param).concat(param));
    SearchParamChanged.next(param);
    this.is(param);
  }
  remove(param) {
    this.params = this.of(param);
    !!this.params[0] && (this.param = this.params[0]);
  }
  is(param) {
    this.param = param;
  }
  of(param) {
    return this.params.filter((f) => f !== param);
  }
  current() {
    return this.param?.length
      ? this.param
      : this.params[this.params.length - 1];
  }
}
const SearchParams = new SearchParams$();

TabbedSearchCard.defaultProps = {};
export default TabbedSearchCard;

export { SearchParams };
