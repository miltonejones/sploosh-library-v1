import React, { useEffect, useState } from "react";
import { importResponse, threadResponse } from "../../../util/Observers";
import ThreadMessageLineItem from "../ThreadMessageLineItem/ThreadMessageLineItem";
import "./ThreadProgressLine.css";

const ThreadProgressLine = () => {
  const [thread, setThread] = useState(null);
  const [message, setMessage] = useState(null);
  useEffect(() => {
    const subs = [
      threadResponse.subscribe((t) => setThread((x) => ({ ...x, ...t }))),
      importResponse.subscribe((data) => {
        const { video, videos, length, complete, time } = data;
        if (complete) {
          return setMessage(null);
        }
        const progressMessage = {
          time,
          domain: video?.domain,
          progress: ((length || 1) - videos?.length) / length,
          message: video?.title ? `Added ${video?.title}...` : "== [ERROR] ==",
          photo: video?.image,
          error: !video?.title,
        };
        console.log(progressMessage);
        setMessage((m) => ({ ...m, ...progressMessage }));
      }),
    ];
    return () => subs.map((s) => s.unsubscribe);
  }, []);

  return (
    <div className="ThreadProgressLine">
      {!!thread && !thread.complete && <i>{thread.message}</i>}
      {!!message && <ThreadMessageLineItem {...message} />}
    </div>
  );
};

ThreadProgressLine.defaultProps = {};
export default ThreadProgressLine;
