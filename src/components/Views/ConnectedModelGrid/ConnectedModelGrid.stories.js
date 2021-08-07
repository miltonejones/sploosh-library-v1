import React, { useState } from "react";
import PageLayout from "../PageLayout/PageLayout";
import ConnectedModelGrid from "./ConnectedModelGrid";

export default {
  title: "Views/ConnectedModelGrid",
  component: ConnectedModelGrid,
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
    <PageLayout>
      <ConnectedModelGrid
        getSort={getSort}
        getPage={getPage}
        payload={payload}
        {...args}
      />
    </PageLayout>
  );
};

export const DefaultView = Template.bind({});

const orderWith = [
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

DefaultView.args = {
  orderWith,
  type: "model",
  package: {
    page: 1,
    sort: "ID",
    desc: 1,
  },
};
