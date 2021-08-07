import React, { useState } from "react";
import ConnectedVideoGrid from "./ConnectedVideoGrid";

export default {
  title: "Views/ConnectedVideoGrid",
  component: ConnectedVideoGrid,
};

const Template = (args) => {
  const [payload, setPayload] = useState({ ...args.package });
  const getPage = (page) => {
    setPayload({ ...payload, page: payload.page + page });
  };
  const getSort = (field) => {
    const other = !!payload.desc ? null : 1;
    const desc = field === payload.sort ? other : payload.desc;
    setPayload({ ...payload, sort: field, desc });
  };
  return (
    <ConnectedVideoGrid
      payload={payload}
      getSort={getSort}
      getPage={getPage}
      {...args}
    />
  );
};

export const DefaultView = Template.bind({});
export const SearchView = Template.bind({});
export const DomainView = Template.bind({});
export const FavoriteView = Template.bind({});

const orderWith = [
  {
    field: "ID",
    title: "Date Added",
  },
  {
    field: "title",
    title: "Title",
  },
];

DefaultView.args = {
  orderWith,
  type: "video",
  package: {
    page: 1,
    sort: "ID",
    desc: 1,
    simple: 1,
  },
};

SearchView.args = {
  orderWith,
  type: "video",
  package: {
    ...DefaultView.args.package,
    mask: "title/shemale",
  },
};

DomainView.args = {
  orderWith,
  type: "video",
  package: {
    ...DefaultView.args.package,
    mask: "domain/javsub.co",
  },
};

FavoriteView.args = {
  orderWith,
  type: "video",
  package: {
    ...DefaultView.args.package,
    mask: "favorite/1",
  },
};
