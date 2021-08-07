import { MoreVert } from "@material-ui/icons";
import React, { useState } from "react";
import { useEffect } from "react";
import { getData } from "../../../services/VideoData";
import MenuSimple from "../../Common/MenuSimple/MenuSimple";
import ModelList from "../../Common/Model/ModelList/ModelList";
import PaginationBar from "../../Common/PaginationBar/PaginationBar";
import GlobalModal, {
  DialogConfig,
  ModelContent,
} from "../../GlobalModal/GlobalModal";
import "./ConnectedModelGrid.css";

const ConnectedModelGrid = ({
  payload,
  getPage,
  orderWith,
  getSort,
  direct,
}) => {
  const { page, sort } = payload;
  const [response, setResponse] = useState(null);
  const [dialogProps, setDialogProps] = useState({});
  const show = DialogConfig(setDialogProps);
  const type = "model";

  const unload = (fn) => {
    setResponse({ ...response, loaded: false });
    fn && fn();
  };

  const setSort = (o) => {
    unload(() => getSort(o));
  };

  useEffect(() => {
    !response?.loaded && load();
  });
  const menuConfig = {
    items: orderWith?.map((f) => ({
      text: f.title,
      action: () => setSort && setSort(f.field),
      active: f.field === sort,
    })),
    icon: <MoreVert />,
  };

  const load = (reset) => {
    (reset || !response?.loaded) &&
      (function () {
        getData(payload, type).then((res) => {
          console.log({ res });
          setResponse({ ...res, loaded: true });
        });
      })();
  };

  const setPage = (i) => {
    setResponse({ ...response, loaded: false });
    getPage && getPage(i);
  };

  if (!response?.data) {
    return <em>Loading...</em>;
  }

  return (
    <div className="ConnectedModelGrid">
      <div className="flexed">
        {!!response?.count && (
          <PaginationBar
            startPage={(page - 1) * 64}
            pageSize={64}
            length={response.count}
            click={setPage}
          />
        )}
        <div className="pull-right">
          <MenuSimple {...menuConfig} />
        </div>
      </div>
      <ModelList
        field={sort}
        click={(m) => {
          show(ModelContent(m)).then(console.log);
        }}
        large
        models={response.data}
        grid
      />
      <GlobalModal refresh={() => load(!0)} {...dialogProps} />
    </div>
  );
};

ConnectedModelGrid.defaultProps = {};
export default ConnectedModelGrid;
