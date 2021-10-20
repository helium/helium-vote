import { useState } from "react";
import VoteOption from "./VoteOption";

const VoteOptionsSection = ({ outcomes }) => {
  const [expandedId, setExpandedId] = useState(null);

  const handleExpandClick = (id) => {
    setExpandedId(id);
  };

  return (
    <div className="w-full bg-hv-gray-750 py-4 sm:py-10 mt-5 sm:mt-20">
      <div className="flex flex-col space-y-2 max-w-5xl mx-auto px-4 sm:px-10">
        <div className="flex-col space-y-2">
          <div>
            <p className="text-md sm:text-2xl font-semibold text-white font-sans pb-2">
              Vote Options
            </p>
            <div className="w-full">
              {outcomes?.map((o, i, { length }) => (
                <VoteOption
                  index={o.index}
                  length={length}
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
    </div>
  );
};

export default VoteOptionsSection;
