import { Collapse, Divider } from "@material-ui/core";
import {
  Add,
  CheckCircle,
  CheckCircleOutline,
  Close,
  ExpandLess,
  ExpandMore,
  LibraryAddCheck,
} from "@material-ui/icons";
import React from "react";
import { DEFAULT_IMAGE } from "../../Constants";
import {
  addVideoGroup,
  putSearchRequest,
  query,
  searchSites,
} from "../../services/ParserService";
import { importResponse, threadResponse } from "../../util/Observers";
import { collateCollection, minsOf, timeOf } from "../../util/Strings";
import PaginationBar from "../Common/PaginationBar/PaginationBar";
import PhotoChip from "../Common/PhotoChip/PhotoChip";
import Thumbnail, { PreviewThumb } from "../Common/Thumbnail/Thumbnail";
import ToolTipButton from "../Common/ToolTipButton/ToolTipButton";
import ToolTipImage from "../Common/ToolTipImage/ToolTipImage";
import ItemCaption from "../ItemCaption/ItemCaption";
import CircularProgressWithLabel from "./CircularProgressWithLabel/CircularProgressWithLabel";
import ParserList from "./ParserList/ParserList";
import "./ShoppingCard.css";
import ShoppingForm from "./ShoppingForm/ShoppingForm";
import ThreadMessageLineItem from "./ThreadMessageLineItem/ThreadMessageLineItem";

const TIME_STAMP_MAP = {
  xs: (n) => n > 0 && n <= 10,
  sm: (n) => n > 10 && n <= 20,
  md: (n) => n > 20 && n <= 40,
  lg: (n) => n > 40 && n <= 60,
  xl: (n) => n > 60,
  na: (n) => isNaN(n),
};

export default class ShoppingCard extends React.Component {
  subscriptions = [];
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pageMax: 1,
      excludedTimeList: [],
      excludedDomainList: [],
    };
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.searchDomains = this.searchDomains.bind(this);
    this.execSearch = this.execSearch.bind(this);
    this.threadedResponse = this.threadedResponse.bind(this);
    this.setState = this.setState.bind(this);
  }
  excludeCandidates(name) {
    let { excludedDomainList } = this.state;
    if (excludedDomainList.indexOf(name) < 0) {
      excludedDomainList.push(name);
    } else {
      excludedDomainList = excludedDomainList.filter((f) => f !== name);
    }
    this.setState({ excludedDomainList, page: 1 });
  }
  excludeTimes(name) {
    let { excludedTimeList } = this.state;
    if (excludedTimeList.indexOf(name) < 0) {
      excludedTimeList.push(name);
    } else {
      excludedTimeList = excludedTimeList.filter((f) => f !== name);
    }
    this.setState({ excludedTimeList, page: 1 });
  }
  threadedResponse(msg) {
    const messages = this.state.messages || {};
    messages[msg.domain + "." + msg.param] = msg;
    this.setState({ ...this.state, messages });
  }
  selectGroup(group) {
    group.map((g) => (g.selected = !g.selected));
    this.setState({ ...this.state });
  }
  execSearch(value) {
    const { addressMode } = this.state;
    if (addressMode) {
      return this.searchByURL(value);
    }
    this.searchDomains(value);
  }
  handleKeyUp(e) {
    const { keyCode, target } = e;
    const { value } = target;
    if (keyCode === 13) {
      this.execSearch(value);
    }
  }

  handleClick(parser) {
    parser.selected = !parser.selected;
    this.setState({ ...this.state });
  }

  save() {
    const str = JSON.stringify(this.state.parsers);
    localStorage["parser-list-local"] = str;
  }

  setSearchResponse(data, searchParam) {
    const { expand } = this.props;
    const domainList = {};
    let candidates = [];
    data?.map((d) => candidates.push(...d));
    candidates = candidates.sort(CandidateSort);

    candidates?.map((c) => {
      const params = searchParam.split("|");
      params.map((param) => {
        c.exact =
          c.exact || c.Text?.toLowerCase().indexOf(param.toLowerCase()) > -1;
        return c.exact && (c.match = param);
      });
      domainList[c.domain] =
        domainList[c.domain] === undefined ? 1 : ++domainList[c.domain];
      c.timeKey = "unset";
      return Object.keys(TIME_STAMP_MAP).map((key) => {
        const is = TIME_STAMP_MAP[key](minsOf(c.Time));
        return is && (c.timeKey = key);
      });
    });
    this.setState({ ...this.state, candidates, domainList, existFilter: true });
    expand && expand(true);
  }

  searchDomains(searchParam) {
    const { pageMax } = this.state;
    const maximum = pageMax || 5;
    const sites = this.state.parsers.filter((f) => f.selected);
    searchSites(sites, searchParam, maximum).then((data) =>
      this.setSearchResponse(data, searchParam)
    );
    this.save();
  }

  searchByURL(searchURL, append) {
    const { expand } = this.props;
    const { parsers } = this.state;
    const chosenParser = parsers.filter(
      (f) => searchURL.indexOf(f.domain) > -1
    )[0];
    if (chosenParser) {
      putSearchRequest(searchURL, chosenParser, "", this.threadedResponse).then(
        (candidates) => {
          !!append &&
            !!this.state.candidates &&
            (candidates = this.state.candidates.concat([...candidates]));
          candidates = candidates.sort(CandidateSort);
          this.setState({ ...this.state, candidates });
          expand && expand(true);
        }
      );
      return;
    }
    alert("Could not find parser");
  }

  componentWillUnmount() {
    this.subscriptions.map((s) => s.unsubscribe());
  }

  componentDidMount() {
    const { expand, candidateList, searchParam } = this.props;
    const str = localStorage["parser-list-local"];
    expand && expand(false);
    this.subscriptions.push(
      threadResponse.subscribe((msg) => {
        this.threadedResponse(msg);
      }),
      importResponse.subscribe((data) => {
        const { video, added, videos } = data;
        this.setState({ ...this.state, video, added, videos });
      })
    );
    if (candidateList?.length) {
      this.setSearchResponse(candidateList, searchParam);
    }
    if (str?.length) {
      const parsers = JSON.parse(str);
      this.setState({ ...this.state, parsers });
      return;
    }
    query().then((parsers) => {
      this.setState({
        ...this.state,
        parsers: parsers.filter((f) => !!f.pageParser),
      });
    });
  }

  getPage(num) {
    let { page } = this.state;
    page -= -num;
    this.setState({ ...this.state, page });
  }

  reset() {
    const { parsers } = this.state;
    const { update, expand } = this.props;
    this.setState({
      parsers,
      page: 1,
      messages: null,
      candidates: null,
      adding: false,
    });
    expand && expand(false);
    update && update();
  }

  addVideos() {
    this.addVideoList().then(() => this.reset());
  }

  addVideoList() {
    const { candidates } = this.state;
    const { expand } = this.props;
    const videos = candidates?.filter((f) => f.selected);
    this.setState({ ...this.state, adding: true, addCount: videos.length });
    expand && expand(false);
    return addVideoGroup(videos);
  }

  render() {
    const {
      addressMode,
      domainList,
      parsers,
      candidates,
      page,
      existFilter,
      adding,
      messages,
      video,
      videos,
      excludedDomainList,
      excludedTimeList,
      collapseOpen,
      addCount,
      pageMax,
    } = this.state;
    const { param } = this.props;
    const legacy = candidates?.filter((f) => !f.existing);
    const collated = (function (arr) {
      let included = arr?.filter(
        (v) => excludedDomainList?.indexOf(v.domain) < 0
      );
      included = included?.filter(
        (v) => excludedTimeList?.indexOf(v.timeKey) < 0
      );
      return collateCollection(included, 24, page);
    })(existFilter ? legacy : candidates);
    const selectedCount = candidates?.filter((f) => f.selected).length;
    const progressMessage = {
      domain: video?.domain,
      progress: ((addCount || 1) - videos?.length) / addCount,
      message: `Added ${video?.title}...`,
    };
    const hiddenVidCount = candidates?.length - legacy?.length;
    const formConfig = {
      param,
      pageMax,
      addressMode,
      searchDomains: this.searchDomains,
      setState: this.setState,
      execSearch: this.execSearch,
    };
    const listConfig = {
      parsers,
      handleClick: this.handleClick.bind(this),
    };
    return (
      <div className="ShoppingCard">
        <Collapse
          in={!(adding || candidates?.length)}
          timeout="auto"
          unmountOnExit
        >
          <div>
            {!messages && <ShoppingForm {...formConfig} />}

            <Divider />

            {!(addressMode || messages) && <ParserList {...listConfig} />}

            <Divider />
            {/* STEP 2 */}
            <div className="modal-data-grid">
              {messages &&
                Object.keys(messages).map((key) => (
                  <ThreadMessageThumbnail key={key} {...messages[key]} />
                ))}
            </div>
          </div>
        </Collapse>

        {/* STEP 3 */}
        <Collapse
          in={candidates?.length && !adding}
          timeout="auto"
          unmountOnExit
        >
          <div>
            <div style={{ height: 40 }} className="flexed right">
              <PaginationBar
                small
                startPage={collated?.startPage}
                pageSize={collated?.pageSize}
                length={collated?.length}
                click={(i) => this.getPage(i)}
              />

              <div
                className="flexed right"
                style={{ marginLeft: "auto", marginRight: 20 }}
              >
                {existFilter && !!hiddenVidCount && (
                  <div>
                    Hiding {candidates?.length - legacy?.length} exisiting
                    videos
                  </div>
                )}
                {!!selectedCount && (
                  <ToolTipButton
                    click={() => this.addVideos()}
                    small
                    count={selectedCount}
                    icon={<Add />}
                    content="Add videos"
                  />
                )}
                <ToolTipButton
                  small
                  click={() =>
                    this.setState({
                      ...this.state,
                      page: 1,
                      existFilter: !existFilter,
                    })
                  }
                  title="Shop"
                  icon={existFilter ? <CheckCircleOutline /> : <CheckCircle />}
                />
                <ToolTipButton
                  small
                  click={() => this.selectGroup(collated?.truncated)}
                  icon={<LibraryAddCheck />}
                />
                <ToolTipButton
                  small
                  icon={collapseOpen ? <ExpandLess /> : <ExpandMore />}
                  title="more..."
                  click={() =>
                    this.setState({
                      ...this.state,
                      collapseOpen: !collapseOpen,
                    })
                  }
                />
                <ToolTipButton
                  small
                  click={() => this.reset()}
                  icon={<Close />}
                />
              </div>
            </div>

            <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
              {Object.keys(domainList || {}).map((f) => (
                <PhotoChip
                  active={excludedDomainList?.indexOf(f) > -1}
                  text={`${f} [${domainList[f]}]`}
                  click={() => this.excludeCandidates(f)}
                />
              ))}
            </Collapse>

            <div className="modal-data-grid">
              {collated?.truncated?.length &&
                collated?.truncated.map((candidate, i) => (
                  <PreviewThumb
                    key={i}
                    append={(i) => this.searchByURL(i, !0)}
                    {...candidate}
                    select={() => {
                      candidate.selected = !candidate.selected;
                      this.setState({ ...this.state });
                    }}
                  />
                ))}
            </div>
          </div>
        </Collapse>

        {/* STEP 4 */}
        <Collapse in={adding} timeout="auto" unmountOnExit>
          {video?.title && <ThreadMessageLineItem {...progressMessage} />}
          <div className="flexed right">
            {video?.title && <Thumbnail details video={video} />}
            {video?.error && <b>Error downloading video...</b>}
          </div>
        </Collapse>
      </div>
    );
  }
}

ShoppingCard.defaultProps = {};

function ThreadMessageThumbnail(props) {
  const { progress, message, domain, response } = props;
  let photo = DEFAULT_IMAGE;
  if (response?.length) {
    const latest = response[response.length - 1];
    photo = latest.Photo;
  }
  const className = ["app-data-item"];
  return (
    <div className={className.join(" ")}>
      <ToolTipImage title={message} image={photo} click={console.log} />
      <ItemCaption title={message} details click={console.log} />
      <div style={{ position: "absolute", top: 90, right: 0 }}>
        <CircularProgressWithLabel value={(progress || 0.1) * 100} />
      </div>

      {domain && <div className="app-data-item-domain">{domain}</div>}
    </div>
  );
}

const CandidateSort = (a, b) => timeOf(b.Time) - timeOf(a.Time);

export { ThreadMessageThumbnail };
