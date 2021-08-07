import React from "react";
import { HtmlTooltip } from "../Common/HtmlToolTip/HtmlToolTip";
import "./ItemCaption.css";

const CAPTION_TEXT_LIMIT = 20;

const ItemCaption = ({ title, details, click, limit, wide }) => {
  let lines = parseLines(title, limit);
  if (!details) lines = [lines[0]];

  return (
    <HtmlTooltip title={title}>
      <div
        className={["ItemCaption", wide ? "wide" : ""].join(" ")}
        onClick={() => click && click()}
      >
        {lines.map((line, i) => (
          <div className="no-wrap" key={i}>
            {line}
          </div>
        ))}
      </div>
    </HtmlTooltip>
  );
};

ItemCaption.defaultProps = {};
export default ItemCaption;

function parseLine(words, limit) {
  let count = 0;
  const tmp = [];
  while (count < limit && !!words?.length) {
    tmp.push(words.shift());
    count = tmp.join(" ").length;
  }
  return tmp.join(" ");
}
function parseLines(value, limit = CAPTION_TEXT_LIMIT) {
  const words = value?.split(" ");
  return [parseLine(words, limit), parseLine(words, limit)];
}
