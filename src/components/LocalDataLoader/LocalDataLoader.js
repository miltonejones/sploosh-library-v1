import { CheckCircleOutline, HourglassEmptyOutlined } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { indexName, TABLE_DEF, versionNo } from "../../services/DataDef";
import { LocalDb, populateDb } from "../../services/IndexedDb";
import { indexDbResponse } from "../../util/Observers";
import "./LocalDataLoader.css";

const LocalDataLoader = () => {
  const [count, setCount] = useState(-1);
  const [percent, setPercent] = useState(-1);
  useEffect(() => {
    if (count > 0) return;
    LocalDb.init([TABLE_DEF], indexName, versionNo);
    const sub = indexDbResponse.subscribe((dbstatus) => {
      const { progress, state } = dbstatus;
      if (state === "PROGRESS") {
        setPercent(progress);
      }
      if (state === "CONNECTED") {
      }
    });

    LocalDb.tally(TABLE_DEF.name)
      .then((count) => {
        console.log({ count });
        setCount(count);

        count < 1 &&
          populateDb(TABLE_DEF.name).then((msg) => {
            console.log({ msg });
            setPercent(-1);
            setCount(1);
          });
      })
      .catch((e) => alert(e));
    return () => sub.unsubscribe();
  }, [count]);

  const button =
    count > 0 ? <CheckCircleOutline /> : <HourglassEmptyOutlined />;

  return (
    <div className="LocalDataLoader">
      {button}[{count}]{percent}
    </div>
  );
};

LocalDataLoader.defaultProps = {};
export default LocalDataLoader;
