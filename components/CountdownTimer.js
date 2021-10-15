import { addMinutes } from "date-fns";
import { useState } from "react";
import Countdown from "react-countdown";

const CountdownTimer = ({ blocksRemaining }) => {
  const now = new Date(Date.now());
  const deadlineDate = addMinutes(now, parseInt(blocksRemaining));

  const [countdownCompleted, setCountdownCompleted] = useState(false);

  if (countdownCompleted) {
    return "Voting closed";
  }

  return (
    <Countdown
      key={deadlineDate}
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
