import axios from "axios";
import { API_HOST } from "../Constants";
import { keyFromText } from "../util/Strings";
import { attachModel, postData } from "./VideoData";
import { importResponse, threadResponse } from "../util/Observers";
import { PromiseChain } from "../util/PromiseChain";

function searchSites(sites, searchParam, pageMax, specimenOnly) {
  const addresses = [];
  const addies = searchParam.split("|").map((param) => {
    return sites.map((f) => {
      return {
        site: f,
        param,
        url: createSearchUrl(f, param),
      };
    });
  });
  addies.map((a) => addresses.push(...a));
  console.log({ addresses });
  return new Promise((callback) => {
    PromiseChain(
      addresses.map((URL) =>
        putSearchRequest(URL.url, URL.site, URL.param, pageMax)
      )
    ).then((response) => {
      threadResponse.next({
        response,
        complete: !specimenOnly,
        done: !specimenOnly,
        message: "search complete!",
        param: searchParam,
      });

      callback(response);
    });
  });
}

function addVideoGroup(videos) {
  const added = [];
  const length = videos.length;
  const now = new Date().getTime();
  return new Promise((callback) => {
    const next = () => {
      if (!videos.length) {
        importResponse.next({ added, videos, length, complete: true });
        return callback();
      }
      const video = videos.pop();
      const { URL } = video;
      postData("video", { URL }).then(process);
    };
    const process = (video) => {
      attachModel([video]).then(() => {
        const elapsed = new Date().getTime() - now;
        const rate = elapsed / added.length;
        const remaining = length - added.length;
        const time = Math.floor(rate * remaining * 0.01) * 0.1;
        added.push(video);
        importResponse.next({ video, added, videos, length, time });
        next();
      });
    };
    next();
  });
}

function checkRegistry(displayList, msgr) {
  return new Promise((resolve) => {
    const keyList = displayList
      ?.map((f) => keyFromText(f.Text))
      .filter((f) => !!f.length);
    if (keyList.length) {
      if (msgr) {
        msgr(`Validating ${keyList.length} videos...`);
      }
      axios.post(`${API_HOST}/video`, { keyList }).then((res) => {
        const { data } = res;
        register(data.rows, displayList);
        resolve(displayList);
      });
      return;
    }
    resolve(displayList);
  });
}

function register(data, out) {
  if (data && data.length) {
    out.map((o) => {
      return (o.existing =
        o.existing ||
        !!data.filter((d) => {
          const key = keyFromText(d.title);
          if (key.length) {
            return o.Text.toLowerCase().indexOf(key.toLowerCase()) > -1;
          }
          return (
            o.Text.toLowerCase().indexOf(d.title.toLowerCase()) > -1 ||
            d.title.toLowerCase().indexOf(o.Text.toLowerCase()) > -1
          );
        }).length);
    });
  }
  return out;
}

function saveParser(body) {
  console.log({ saveParser: body });
  return axios.post(`${API_HOST}/parser`, { body });
}

const doTestParserURL = async (URL, parser) => {
  const payload = {
    URL,
    parser,
  };
  const res = await axios.post(`${API_HOST}/parser`, payload);
  const { data } = res;
  return data;
};

function putSearchRequest(address, site, param, pageMax) {
  return new Promise((callback, problem) => {
    const response = [];
    const visited = [];

    const fwd = (next) => {
      visited.push(next.page);
      threadResponse.next({
        message: `getting page ${next.page}`,
        domain: site.domain,
        param,
        response,
        progress: visited.length / pageMax,
      });

      promise(getSearchURL(site, next.url, param));
    };

    const promise = (URL) => {
      threadResponse.next({
        message: `searching ${site.domain} for "${param}"`,
        domain: site.domain,
        param,
        response,
        progress: visited.length / pageMax,
      });

      axios.post(`${API_HOST}/parser`, { URL }).then((res) => {
        const { data } = res;
        const { items, pages } = data;
        checkRegistry(items, (message) => {
          threadResponse.next({
            message,
            progress: visited.length / pageMax,
            domain: site.domain,
            response,
            param,
            pages,
          });
        })
          .then(() => {
            if (items?.length) response.push(...items);
            const next = pages?.filter(
              (f) => f && f.page && visited.indexOf(f.page) < 0
            )[0];
            if (next?.page && visited.length < pageMax) {
              console.log({ l: visited.length, pageMax });
              return fwd(next);
            }
            threadResponse.next({
              message: `Found ${response.length} items like "${param}"`,
              progress: 1,
              domain: site.domain,
              response,
              param,
              pages,
              complete: true,
            });
            response.map((v) => (v.domain = site.domain));
            callback(response);
          })
          .catch(problem);
      });
    };

    promise(address);
  });
}

function createSearchUrl(site, searchParam) {
  return getSearchURL(site, site.searchURL, searchParam);
}

function getSearchURL(site, url, searchParam) {
  let full = url.indexOf(searchParam) < 0 ? `${url}${searchParam}` : url;
  if (url.indexOf(site.domain) < 0) {
    url = `https://${site.domain}${url}`;
    full = url;
  }

  if (site.spaceChar) {
    searchParam = searchParam.replace(/\s/g, site.spaceChar);
  }
  return url.indexOf("[value]") > 0
    ? url.replace("[value]", searchParam)
    : full;
}

const query = () => {
  return new Promise((callback) => {
    axios.get(`${API_HOST}/parser`).then((res) => {
      const { data } = res;
      callback(data);
    });
  });
};

export {
  query,
  createSearchUrl,
  getSearchURL,
  searchSites,
  checkRegistry,
  putSearchRequest,
  addVideoGroup,
  saveParser,
  doTestParserURL,
};
