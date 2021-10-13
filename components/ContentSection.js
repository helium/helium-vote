import classNames from "classnames";

const ContentSection = ({ children, className, flatBottom, flatTop }) => {
  return (
    <div
      className={classNames(
        "max-w-5xl mx-auto backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-white bg-opacity-5 p-5",
        {
          "rounded-3xl mt-5": !flatBottom && !flatTop,
          "rounded-t-3xl mt-5": flatBottom,
          "rounded-b-3xl mt-px": flatTop,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

export default ContentSection;
