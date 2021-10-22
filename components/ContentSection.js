import classNames from "classnames";

const ContentSection = ({
  children,
  className,
  flatBottom,
  flatTop,
  first,
}) => {
  return (
    <div className={classNames("max-w-5xl mx-auto px-4 sm:px-10", className)}>
      {children}
    </div>
  );
};

export default ContentSection;
