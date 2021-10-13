import classNames from "classnames";

const ContentSection = ({ children, className }) => {
  return (
    <div
      className={classNames(
        "mt-5 max-w-5xl mx-auto backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-white bg-opacity-50 rounded-3xl p-5",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ContentSection;
