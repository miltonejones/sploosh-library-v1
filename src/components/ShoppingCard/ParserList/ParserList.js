import React from "react";
import SwitchLabel from "../SwitchLabel/SwitchLabel";
import "./ParserList.css";

const ParserList = ({ parsers, handleClick }) => {
  return (
    <div className="ParserList flexed wrap right">
      {parsers?.map((parser, i) => (
        <SwitchLabel
          key={i}
          label={parser.domain}
          isChecked={parser.selected}
          click={() => handleClick(parser)}
        />
      ))}
    </div>
  );
};

ParserList.defaultProps = {};
export default ParserList;
