import React, { useState } from "react";
import { ConnectedVideoGridUnload } from "../../../util/Observers";
import ConnectedVideoGrid from "../ConnectedVideoGrid/ConnectedVideoGrid";
import PageLayout from "./PageLayout";

export default {
  title: "Views/PageLayout",
  component: PageLayout,
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

  const direct = (a) => {
    const types = {
      studio: `title/${a.value}-`,
      search: `title/${a.value}`,
      domain: `domain/${a.value}`,
      reset: null,
    };
    ConnectedVideoGridUnload.next(true);
    setPayload({ ...payload, page: 1, mask: types[a.type] });
  };
  return (
    <PageLayout direct={direct} {...args}>
      <div>
        <ConnectedVideoGrid
          payload={payload}
          getSort={getSort}
          getPage={getPage}
          direct={direct}
        />
      </div>
    </PageLayout>
  );
};

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

export const DefaultView = Template.bind({});

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
