import axios from "axios";
import { API_HOST } from "../Constants";
import { ServerConnected } from "../util/Observers";
import { toString } from "../util/Strings";

const getData = (payload, type) => {
  const endpoint = toString(payload);
  return new Promise((callback) => {
    ServerConnected.next(true);
    return axios
      .get(`${API_HOST}/${type}?${endpoint}&timestamp=${new Date().getTime()}`)
      .then((res) => {
        const data = res.data;
        if (data.rows || data.related) {
          attachModel(data.rows || data.related).then((d) => {
            ServerConnected.next(false);
            callback(data);
          });
          return;
        }
        ServerConnected.next(false);
        callback(data);
      });
  });
};

const setModelAlias = (aliasFk, modelFk) => {
  return postData("model", {
    modelFk,
    aliasFk,
  });
};
const postData = (type, payload) => {
  return new Promise((callback) => {
    ServerConnected.next(true);
    return axios.post(`${API_HOST}/${type}`, payload).then((res) => {
      // console.log({ res })
      ServerConnected.next(false);
      callback(res.data);
    });
  });
};

const deleteVideo = (videoId) => {
  return new Promise((callback) => {
    axios.delete(`${API_HOST}/video?ID=${videoId}`).then(callback);
  });
};

const likeVideo = (track) => {
  return new Promise((callback) => {
    const payload = {
      ID: track.ID,
      src: track.src,
      URL: track.URL,
      favorite: track.favorite ? 0 : 1,
    };
    // console.error({ payload })
    postData("video", payload).then((video) => {
      track.favorite = video.favorite;
      // console.log(track);
      callback(video);
    });
  });
};
function removeModel(modelFk, trackFk) {
  const payload = { modelFk, trackFk };
  return getData(payload, "model");
}
function assignModel(ID, trackFk) {
  return postData("model", {
    ID,
    trackFk,
  });
}

const assignModels = (videos, rows) => {
  videos.map((video) => {
    video.models = rows.filter((f) => f.trackFk === video.ID);
    return video.models.map((f) => (f.modelFk = f.modelFk || f.ID));
  });
};

function getUnattributedVideos(model) {
  let matchTracks = [];
  const options = {
    page: 1,
    sort: "ID",
    mask: `title/${model.name}`,
    desc: 1,
    simple: 1,
  };
  return new Promise((callback) => {
    getData(options, "video").then((answer) => {
      if (!(answer.rows && answer.rows.length)) return;
      attachModel(answer.rows).then(() => {
        matchTracks = answer.rows.filter((f) => {
          return !(
            f.models &&
            f.models.filter((o) => {
              return o.modelFk === model.ID;
            }).length > 0
          );
        });
        callback(matchTracks);
      });
    });
  });
}

const getModelsByIdList = (trackKeys) => {
  return postData("model", { trackKeys });
};

const attachModel = (videos) => {
  return new Promise((callback) => {
    try {
      const ids = videos?.map((f) => f.ID).filter((f) => !!f);

      if (ids?.length) {
        return getModelsByIdList(ids).then((f) => {
          if (f?.rows) {
            assignModels(videos, f.rows);
          }
          return callback(videos);
        });
      }
    } catch (e) {
      console.log("an error occured", e);
    }
    callback(videos);
  });
};

function addURLWithModel(URL, modelID) {
  return new Promise((callback) => {
    addURL(URL).then((video) => {
      assignModel(modelID, video.ID).then(callback);
    });
  });
}

function setModelImage(ID, image) {
  return postData("model", {
    ID,
    image,
  });
}

function createModel(name) {
  const payload = { name };
  return getData(payload, "model");
}

function addURL(URL) {
  return postData("video", { URL });
}

export {
  getData,
  postData,
  attachModel,
  likeVideo,
  deleteVideo,
  setModelAlias,
  assignModel,
  removeModel,
  createModel,
  addURL,
  setModelImage,
  addURLWithModel,
  getUnattributedVideos,
};
