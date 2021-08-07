import {
  ConnectedVideoGridUnload,
  SearchParamChanged,
} from "../util/Observers";

class ViewConfig {
  constructor(history, params) {
    this.history = history;
    this.params = params;
  }

  configure() {
    const params = this.params;
    for (const n in defaultProps) {
      defaultProps.hasOwnProperty(n) &&
        params[n] === undefined &&
        Object.assign(params, { [n]: defaultProps[n] });
    }
    params.type === "favorite" && Object.assign(params, { mask: `favorite/1` });
    !!params.param &&
      Object.assign(params, { mask: `title/${params.param.replace("^", "")}` });
    !!params.domain &&
      Object.assign(params, { mask: `domain/${params.domain}` });
    this.params = params;
  }

  prefixOf() {
    const params = this.params;
    let prefix = params.type;
    !!params.param && (prefix = `search/${params.param}`);
    !!params.domain && (prefix = `domain/${params.domain}`);
    return prefix;
  }

  direct(path) {
    const types = {
      studio: `/search/${path.value}-/1/ID/1`,
      search: `/search/${path.value}/1/ID/1`,
      domain: `/domain/${path.value}/1/ID/1`,
      reset: `/video/1/ID/1`,
      path: path.value,
    };
    const dest = types[path.type];
    path.type === "reset" && SearchParamChanged.next("");
    this.next(dest);
  }

  getSort(field) {
    const params = this.params;
    const other = !!params.desc ? null : 1;
    const desc = field === params.sort ? other : params.desc;
    const o = { ...params, sort: field, desc };

    const m = makePath(o);
    const dest = `/${this.prefixOf()}/${m}`;

    this.next(dest);
  }

  getPage(page) {
    const o = { ...this.params, page: (this.params.page || 1) - -page };

    const m = makePath(o);
    const dest = `/${this.prefixOf()}/${m}`;

    this.next(dest);
  }

  next(dest) {
    ConnectedVideoGridUnload.next();
    this.history.push(dest);
  }
}

const defaultProps = {
  page: 1,
  sort: "ID",
  desc: 1,
  simple: 1,
  type: "video",
};

const makePath = (o) => {
  const m = [];
  ["page", "sort", "desc"].map((f) => {
    return m.push(o[f]);
  });
  return m.join("/");
};

const orderModel = [
  {
    title: "Liked",
    field: "likedCount",
  },
  {
    title: "Count",
    field: "videoCount",
  },
  {
    title: "Date Added",
    field: "ID",
  },
  {
    title: "Name",
    field: "name",
  },
];

const orderVideo = [
  {
    field: "ID",
    title: "Date Added",
  },
  {
    field: "title",
    title: "Title",
  },
];

export { ViewConfig, orderModel, orderVideo };
