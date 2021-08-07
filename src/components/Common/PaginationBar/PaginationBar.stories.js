import React, { useState } from "react";
import PaginationBar from "./PaginationBar";

export default {
  title: "Common/PaginationBar",
  component: PaginationBar,
};

const Template = (args) => {
  const [page, setPage] = useState(1);

  return (
    <PaginationBar
      startPage={page}
      click={(i) => {
        setPage(page + i);
      }}
      {...args}
    />
  );
};

export const DefaultView = Template.bind({});

DefaultView.args = {
  pageSize: 30,
  length: 50000,
  small: true,
};
