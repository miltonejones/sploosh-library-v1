function makerFromText(title) {
  const match = [/([a-z|A-Z|0-9]+)-\d+/]
    .map((regex) => {
      return regex.exec(title);
    })
    .filter((f) => !!f)[0];
  if (match) {
    const key = match[1].toLowerCase();
    return isNaN(parseInt(key, 10)) ? key : "";
  }
  return "";
}
function chipParse(c, nuts) {
  if (c.indexOf(",") > 0) {
    c.split(",").map((d) =>
      nuts.push({
        text: d,
        and: !0,
      })
    );
    return nuts;
  }
  nuts.push({
    text: c,
  });

  return nuts;
}
function toString(payload) {
  const out = [];
  for (const n in payload) {
    if (
      payload.hasOwnProperty(n) &&
      payload[n] !== undefined &&
      payload[n] !== null
    ) {
      out.push(`${n}=${payload[n]}`);
    }
  }
  return out.join("&");
}
const collate = (collection, pageSize, page) => {
  const startPage = (page - 1) * pageSize;
  let truncated = collection?.slice(startPage, startPage + pageSize);
  const length = collection?.length;
  return {
    startPage,
    page,
    pageSize,
    truncated,
    length,
  };
};
function keyFromText(title) {
  const match = [/\[([^\]]+)]/, /([a-z|A-Z]+-\d+)/, /(FC\d-PPV\s[0-9]+)/]
    .map((regex) => {
      return regex.exec(title);
    })
    .filter((f) => !!f)[0];
  if (match) {
    return match[1].toLowerCase();
  }
  return "";
}
function createNameArray(params) {
  const items = [];
  console.log(params);
  if (params.length < 3) return params;
  params.map((param, i) => {
    if (i % 2 !== 0) return !1;
    items.push(`${param} ${params[i + 1]}`);
    return console.log(i, param);
  });
  return items;
}
const contains = (a, b) => a?.toLowerCase().indexOf(b?.toLowerCase()) > -1;
export const same = (a, b) => a?.toLowerCase() === b?.toLowerCase();

export const rxcs = (o) =>
  Object.keys(o)
    .filter((i) => !!o[i])
    .join(" ");
function getVideosByParam(related, param) {
  if (!param?.length) return related;
  const modelParam = param.split("|");
  let result = [];
  for (let i = 0; i < modelParam.length; i++) {
    result = result.concat(
      related.filter((video) => {
        return (
          video.title.toLowerCase().indexOf(modelParam[i].toLowerCase()) >= 0
        );
      })
    );
  }
  return result;
}

function mmss(value, exponent) {
  if (isNaN(value)) return value;
  if (exponent) value = value / exponent;
  const mins = Math.floor(value / 60);
  const secs = Math.floor(value % 60);
  const minutes = mins < 10 ? `0${mins}` : mins;
  const seconds = secs < 10 ? `0${secs}` : secs;
  return `${minutes}:${seconds}`;
}

function minsOf(value) {
  return timeOf(value) / 60;
}

function timeOf(value) {
  const re = /(\d+)\smin/.exec(value);
  if (re) {
    return parseInt(re[1]) * 60;
  }

  if (value?.length) {
    const parts = value.split(":").map((f) => parseInt(f));
    const multiplier = parts.length > 2 ? [1, 60, 3600] : [1, 60];
    let i = 0;
    let out = 0;
    while (parts.length) {
      out += parts.pop() * multiplier[i++];
    }
    return out;
  }
  return 0;
}

const collateCollection = (collection, pageSize, page) => {
  const startPage = (page - 1) * pageSize;
  let truncated = collection?.slice(startPage, startPage + pageSize);
  const length = collection?.length;
  return {
    startPage,
    page,
    pageSize,
    truncated,
    length,
  };
};
export {
  makerFromText,
  toString,
  collate,
  keyFromText,
  createNameArray,
  contains,
  getVideosByParam,
  chipParse,
  mmss,
  minsOf,
  timeOf,
  collateCollection,
};
