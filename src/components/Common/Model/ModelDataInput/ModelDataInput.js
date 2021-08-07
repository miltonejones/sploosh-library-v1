import { Avatar, Chip } from "@material-ui/core";
import { Person } from "@material-ui/icons";
import React, { useState } from "react";
import { indexName, TABLE_DEF, versionNo } from "../../../../services/DataDef";
import { LocalDb, populateDb } from "../../../../services/IndexedDb";
import { createModel } from "../../../../services/VideoData";
import { PromiseChain } from "../../../../util/PromiseChain";
import { contains, createNameArray } from "../../../../util/Strings";
import ActionTextField from "../../ActionTextField/ActionTextField";
import PhotoChip from "../../PhotoChip/PhotoChip";
import ModelList from "../ModelList/ModelList";
import "./ModelDataInput.css";

export const setup = async (_) => {
  LocalDb.init([TABLE_DEF], indexName, versionNo);
  let count = await LocalDb.tally(TABLE_DEF.name);
  console.log({ count });
  if (count > 0) return count;
  const result = await populateDb(TABLE_DEF.name);
  console.log({ result });
  return await LocalDb.tally(TABLE_DEF.name);
};

const ModelDataInput = ({ onModelSelect, text }) => {
  const [models, setModels] = useState([]);
  const [faux, setFaux] = useState("");
  const [people, setPeople] = useState([]);

  const getStar = (name) => {
    return new Promise((callback) => {
      setup().then(() => {
        LocalDb.select(TABLE_DEF.name, (row) => contains(row.name, name)).then(
          (data) => {
            callback({
              data,
              count: data?.length,
            });
          }
        );
      });
    });
  };

  // const getStarWww = (name) => {
  //   const payload = {
  //     page: 1,
  //     mask: `name/${name}`,
  //   };
  //   return getData(payload, "model");
  // };

  const createStar = (name) => {
    createModel(name).then((star) => {
      LocalDb.insert(TABLE_DEF.name, [star]).then(() => {
        setPeople([star]);
        setModels([]);
        setFaux("");
      });
    });
  };

  const process = (value) => {
    const names =
      value.indexOf(",") > 0
        ? value.split(",")
        : createNameArray(value.split(" "));

    PromiseChain(names.map(getStar)).then((stars) => {
      console.log({ stars });
      const folks = [];
      stars?.map((star) => {
        return folks.push(...star.data);
      });
      setModels(folks);
      setFaux(value);
    });
  };

  const removePerson = (star) => {
    setPeople(people.filter((m) => m.ID !== star.ID));
    setFaux("");
  };

  const selectModel = (star) => {
    setModels(models.filter((m) => m.ID !== star.ID));
    people.push(star);
    setPeople(people);
  };

  const commitModel = (p) => {
    onModelSelect && onModelSelect(p);
    // removePerson(p);
    handleClickClearInput();
  };

  const handleClickClearInput = () => {
    setPeople([]);
    setModels([]);
    setFaux("");
  };

  const args = {
    icon: <Person />,
    text,
    action: handleClickClearInput,
    commit: process,
    initial: "",
    // button: <Close />,
  };

  return (
    <div className="ModelDataInput">
      {" "}
      {!!people?.length &&
        people.map((person) => (
          <PhotoChip
            click={() => commitModel(person)}
            remove={() => removePerson(person)}
            text={person.name}
            image={person.image}
          />
        ))}
      {!people?.length && <ActionTextField {...args} />}
      <div className="flexed right">
        <ModelList
          models={models}
          click={selectModel}
          param={faux}
          chip
          limit={16}
        />
        {!!faux.length && (
          <Chip
            variant="default"
            color="primary"
            size="small"
            onClick={() => createStar(faux)}
            avatar={<Avatar alt={faux} />}
            label={`Add "${faux}" as new model`}
          />
        )}
      </div>
    </div>
  );
};

ModelDataInput.defaultProps = {};
export default ModelDataInput;
