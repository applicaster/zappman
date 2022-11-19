import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useState } from "react";

dayjs.extend(relativeTime);

export default function TimeAgo({ timestamp }: { timestamp: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    setInterval(() => {
      setNow(Date.now());
    }, 60_000);
  }, [timestamp]);
  return (
    <React.Fragment key={now}>{dayjs(timestamp).fromNow()}</React.Fragment>
  );
}
