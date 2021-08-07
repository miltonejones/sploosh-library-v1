import { Button } from "@material-ui/core";
import { ChevronRight } from "@material-ui/icons";
import React from "react";
import ActionTextField from "../../Common/ActionTextField/ActionTextField";
import PageMaxSlider from "../PageMaxSlider/PageMaxSlider";
import SwitchLabel from "../SwitchLabel/SwitchLabel";
import "./ShoppingForm.css";

const ShoppingForm = ({
  param,
  pageMax,
  addressMode,
  searchDomains,
  setState,
  execSearch,
}) => {
  return (
    <div className="ShoppingForm">
      {!!param ? (
        <Button
          color="primary"
          autoFocus
          onClick={() => searchDomains(param)}
          class="app-link"
        >
          search for "{param}" <ChevronRight />
        </Button>
      ) : (
        <ActionTextField
          button={<ChevronRight />}
          onhttp={() => setState({ addressMode: !0 })}
          description={
            addressMode
              ? "enter search URL and press 'Enter'"
              : "provide search parameters seperated by '|'"
          }
          commit={(value) => execSearch(value)}
          text={addressMode ? "enter URL" : "enter search text"}
        />
      )}

      {!param && (
        <SwitchLabel
          minWidth={100}
          label={addressMode ? "URL" : "Text"}
          isChecked={!addressMode}
          click={() => setState({ addressMode: !addressMode })}
        />
      )}
      {!(addressMode || param) && (
        <PageMaxSlider
          value={pageMax}
          change={(pageMax) => setState({ pageMax })}
        />
      )}
    </div>
  );
};

ShoppingForm.defaultProps = {};
export default ShoppingForm;
