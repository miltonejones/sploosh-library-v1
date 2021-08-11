import axios from "axios";
import { API_HOST } from "../Constants";
import { PromiseChain } from "../util/PromiseChain";
import { randomize, toString } from "../util/Strings";
import { attachModel, getData } from "./VideoData";

export const DASH_COOKIE_NAME = "dashboard-cookie-new";

const cacheTags = (tags) => {
  const cache = JSON.stringify(tags.filter((f) => f.likedCount > 5));
  localStorage[DASH_COOKIE_NAME] = cache;
};

const checkCache = () => {
  const cache = localStorage[DASH_COOKIE_NAME];
  return new Promise((cb) => {
    cb(!cache ? [] : JSON.parse(cache));
  });
};

const dashTags = () => {
  return new Promise((callback) => {
    const payload = (page) => {
      return { page, sort: "likedCount", desc: 1 };
    };
    const refresh = (tags) => {
      cacheTags(tags);
      const words = randomize(tags.map((f) => f.word)).slice(0, 3);
      console.log({ words, tags });
      get(words).then((answers) => callback(answers));
    };
    const get = (words) => {
      return new Promise((wordProm) => {
        console.log({ words });
        const ret = [];
        const download = () => {
          if (words.length) {
            const word = words.pop();
            getDashData({ word, page: 1 }, "tag").then((res) => {
              const { data } = res;
              const { related } = data;
              console.log({ data, related });
              attachModel(res.data?.related).then(() => {
                ret.push(res.data);
                download();
              });
            });
            return;
          }

          wordProm(ret);
        };
        download();
      });
    };
    const search = (page) => {
      checkCache().then((cache) => {
        console.error({ cache });
        if (cache.length) {
          return refresh(cache);
        }
        return getDashData(payload(page), "tag").then((res) => {
          const { data } = res;
          console.log({ data: data.data });
          refresh(data.data);
        });
      });
    };
    search(1);
  });
};

const getDashData = (payload, type) => {
  const endpoint = toString(payload);
  return axios.get(`${API_HOST}/${type}?${endpoint}`);
};

const pageOf = (page) => {
  return {
    page,
    sort: "ID",
    desc: 1,
    simple: 1,
  };
};

const getLatest = () => {
  const out = [];
  return new Promise((callback) => {
    PromiseChain([1].map((page) => getData(pageOf(page), "video"))).then(
      (res) => {
        res.map((row) => out.push(...row.rows));
        callback(out);
      }
    );
  });
};

const getModels = () => {
  const out = [];
  return new Promise((callback) => {
    PromiseChain(
      [1].map((page) =>
        getDashData({ page, sort: "likedCount", desc: 1 }, "model")
      )
    ).then((res) => {
      res.map((row) => out.push(...row.data.data));
      callback(out);
    });
  });
};

export { getLatest, getModels, dashTags };
