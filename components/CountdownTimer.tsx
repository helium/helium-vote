import { addMinutes } from "date-fns";
import { useState } from "react";
import Countdown from "react-countdown";

const CountdownTimer: React.FC<{ endTs?: number; blocksRemaining?: number }> = ({ endTs, blocksRemaining }) => {
  const now = new Date(Date.now());
  let deadlineDate;
  if (endTs) {
    deadlineDate = new Date(endTs * 1000);
  } else {
    deadlineDate = addMinutes(now, blocksRemaining);
  }

  const [countdownCompleted, setCountdownCompleted] = useState(false);

  if (countdownCompleted) {
    return <div>Voting closed</div>;
  }

  return (
    <Countdown
      key={deadlineDate.toString()}
      date={deadlineDate}
      renderer={({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
          setCountdownCompleted(true);
        } else {
          setCountdownCompleted(false);
        }
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }}
    />
  );
};
export default CountdownTimer;
