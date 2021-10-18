import classNames from "classnames";

const VoteDetailField = ({
  value,
  label,
  title = false,
  small = false,
  className,
}) => {
  return (
    <div className={classNames("flex flex-col", className)}>
      <p className="text-xs font-light text-gray-500 font-sans">{label}</p>
      {title ? (
        <h2 className="text-4xl font-sans text-white">{value}</h2>
      ) : (
        <p
          className={classNames("font-sans text-gray-300 max-w-2xl", {
            "text-sm break-all": small,
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
