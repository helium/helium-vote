import classNames from "classnames";

const ContentSection = ({
  children,
  className,
  flatBottom,
  flatTop,
  first,
}) => {
  return (
    <div
      className={classNames(
        "max-w-5xl mx-auto backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-white bg-opacity-5",
        {
          "rounded-none sm:rounded-3xl mt-5": !flatBottom && !flatTop,
          "rounded-none sm:rounded-t-3xl mt-5": flatBottom,
          "rounded-none sm:rounded-b-3xl mt-px": flatTop,
          "pt-20 pb-4 px-4 sm:pt-5 sm:px-5": first,
          "p-4 sm:p-5": !first,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

export default ContentSection;
