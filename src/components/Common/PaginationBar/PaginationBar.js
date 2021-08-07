import {
  DoubleArrow,
  FirstPage,
  NavigateBefore,
  NavigateNext,
} from "@material-ui/icons";
import React from "react";
import ToolTipButton from "../ToolTipButton/ToolTipButton";
import "./PaginationBar.css";

const PaginationBar = ({ startPage, pageSize, length, click, small }) => {
  const descText = `${startPage + 1} to ${Math.min(
    startPage + pageSize,
    length
  )} of  ${length}`;
  const thisPage = startPage / pageSize;
  const last = startPage + pageSize >= length;

  if (length <= pageSize) return "";
  return (
    <div className="PaginationBar flexed right">
      {descText}
      <ToolTipButton
        when={() => thisPage > 1}
        small={small}
        icon={<FirstPage />}
        content="First Page"
        disabled={startPage < 1}
        click={() => click(-thisPage)}
      />
      <ToolTipButton
        small={small}
        icon={<NavigateBefore />}
        content="Previous"
        disabled={startPage < 1}
        click={() => click(-1)}
      />
      <ToolTipButton
        small={small}
        icon={<NavigateNext />}
        content="Next"
        disabled={last}
        click={() => click(1)}
      />
      <ToolTipButton
        small={small}
        icon={<DoubleArrow />}
        content="Next"
        disabled={last}
        click={() => click(5)}
      />
      {/* <ToolTipButton icon="filter_center_focus" content="center" disabled={diff === 0 || !selection} click={() => click(diff)} /> */}
    </div>
  );
};

PaginationBar.defaultProps = {};
export default PaginationBar;
