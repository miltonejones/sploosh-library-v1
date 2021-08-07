import { Add, Person } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { TABLE_DEF } from "../../../services/DataDef";
import { LocalDb } from "../../../services/IndexedDb";
import { contains, same } from "../../../util/Strings";
import { setup } from "../Model/ModelDataInput/ModelDataInput";
import PopoverSelect from "./PopoverSelect";

export default {
  title: "PopoverSelect",
  component: PopoverSelect,
};

const Template = (args) => {
  // const [count, setCount] = useState(-1);
  // useEffect(() => {
  //   LocalDb.select(TABLE_DEF.name, (row) => !!row.image).then((d) =>
  //     setCount(d.length)
  //   );
  // }, []);
  return (
    <>
      <PopoverSelect {...args} />
      {/* <hr />
      {count} */}
    </>
  );
};

export const DefaultView = Template.bind({});

const getStar = (name) => {
  return setup().then((count) => {
    console.log({ count });
    return LocalDb.select(TABLE_DEF.name, (row) => contains(row.name, name));
  });
};

const promise = (param) => {
  const add = [
    { value: `Add "${param}" as new model`, param, avatar: { icon: <Add /> } },
  ];
  return new Promise((callback) => {
    getStar(param).then((rows) => {
      console.log({ rows });
      callback(
        add.concat(
          rows?.map((row) => ({
            value: row.name,
            active: same(row.name, param),
            avatar: {
              src: row.image,
              alt: row.name,
            },
          }))
        )
      );
    });
  });
};

DefaultView.args = {
  title: "Find Models",
  icon: <Person />,
  promise,
  onSelect: (a) => {
    if (a.param) return alert(`Add ${a.param}`);
    alert(`Select ${a.value}`);
  },
  onSave: (a) => {
    alert(`Save ${a.value}`);
  },
};
