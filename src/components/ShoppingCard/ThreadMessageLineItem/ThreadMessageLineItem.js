import React from "react";
import { mmss } from "../../../util/Strings";
import ProgressAvatar from "../ProgressAvatar/ProgressAvatar";
import "./ThreadMessageLineItem.css";

function ThreadMessageLineItem({ message, domain, time, error }) {
  const color = error ? "red" : "black";
  return (
    <div className="flex-centered right thread-message">
      <ProgressAvatar
        message={message}
        domain={domain}
        time={time}
        error={error}
        letter={domain?.substr(0, 1)}
      />
      <div className="thread-message-domain no-wrap">{domain}</div>
      <div style={{ color }} className="thread-message-text no-wrap">
        {message}
      </div>
      {time && (
        <div className="thread-message-time no-wrap">
          <em>{mmss(time)}</em>
        </div>
      )}
    </div>
  );
}

ThreadMessageLineItem.defaultProps = {};
export default ThreadMessageLineItem;
