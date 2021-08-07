import { Add, Person } from "@material-ui/icons";
import React, { useState } from "react";
import { TABLE_DEF } from "../../../services/DataDef";
import { LocalDb } from "../../../services/IndexedDb";
import { createModel } from "../../../services/VideoData";
import { contains, same } from "../../../util/Strings";
import { setup } from "../Model/ModelDataInput/ModelDataInput";
import PopoverSelect from "../PopoverSelect/PopoverSelect";
import "./ModelPopoverSelect.css";

const ModelPopoverSelect = ({ onModelSelect, text }) => {
  const [rows, setRows] = useState([]);
  const getStar = (name) => {
    return setup().then((count) => {
      console.log({ count });
      return LocalDb.select(TABLE_DEF.name, (row) => contains(row.name, name));
    });
  };

  const promise = (param) => {
    const add = [
      {
        value: `Add "${param}" as new model`,
        param,
        avatar: { icon: <Add /> },
      },
    ];
    return new Promise((callback) => {
      getStar(param).then((rows) => {
        console.log({ rows });
        setRows(rows);
        callback(
          add.concat(
            rows?.map((row) => ({
              value: row.name,
              id: row.ID,
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

  const select = (option) => {
    const model = rows?.filter((row) => row.ID === option.id)[0];
    console.log({ model });
    !!model && onModelSelect && onModelSelect(model);
  };

  const createStar = (name) => {
    createModel(name).then((star) => {
      LocalDb.insert(TABLE_DEF.name, [star]).then(() => {
        // setPeople([star]);
        // setModels([]);
        // setFaux("");
        onModelSelect && onModelSelect(star);
      });
    });
  };

  const args = {
    title: text,
    icon: <Person />,
    promise,
    onSelect: (a) => {
      !!a.param && createStar(a.param); //alert(`add new model ${a.param}`);
    },
    // onSelect: (a) => {
    //   if (a.param) return alert(`Add ${a.param}`);
    //   alert(`Select ${a.value}`);
    // },
    onSave: select,
  };

  return (
    <div className="ModelPopoverSelect">
      {" "}
      <PopoverSelect {...args} />
    </div>
  );
};

ModelPopoverSelect.defaultProps = {};
export default ModelPopoverSelect;
