import { useState } from "react";
import VoteOption from "./VoteOption";

const VoteOptionsSection = ({ outcomes }) => {
  const [expandedId, setExpandedId] = useState(null);

  const handleExpandClick = (id) => {
    setExpandedId(id);
  };

  return (
    <div className="flex flex-col space-y-2 max-w-5xl mx-auto mt-5 px-4 sm:px-10">
      <div className="flex-col space-y-2">
        <div>
          <p className="text-xs font-light text-gray-500 font-sans pb-2">
            Vote Options
          </p>
          <div className="w-full space-y-2">
            {outcomes?.map((o, i) => (
              <VoteOption
                index={i}
                key={o.address}
                outcome={o}
                expandedId={expandedId}
                handleExpandClick={handleExpandClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteOptionsSection;
