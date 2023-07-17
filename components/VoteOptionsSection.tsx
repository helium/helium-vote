import VoteOption, { Outcome } from "./VoteOption";

const VoteOptionsSection: React.FC<{
  outcomes: Outcome[]
}> = ({ outcomes }) => {
  return (
    <div className="w-full bg-hv-gray-750 py-5 sm:py-10 mt-10 sm:mt-20">
      <div className="flex flex-col space-y-2 max-w-5xl mx-auto px-0 sm:px-10">
        <div>
          <p className="text-xl ml-4 sm:ml-0 mb-3 tracking-tight sm:text-3xl font-semibold text-white font-sans pb-4">
            Vote Options
          </p>
          <div className="w-full">
            {outcomes?.map((o, i, { length }) => (
              <VoteOption
                index={o.index}
                length={length}
                key={o.name}
                outcome={o}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteOptionsSection;
