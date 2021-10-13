import classNames from "classnames";

const VoteDetailField = ({ value, label, title = false, small = false }) => {
  return (
    <div className="flex flex-col">
      <p className="text-xs font-light text-gray-500 font-sans">{label}</p>
      {title ? (
        <h2 className="text-4xl font-sans text-white">{value}</h2>
      ) : (
        <p
          className={classNames("font-sans break-all text-gray-300", {
            "text-sm": small,
            "text-lg": !small,
          })}
        >
          {value}
        </p>
      )}
    </div>
  );
};

export default VoteDetailField;
