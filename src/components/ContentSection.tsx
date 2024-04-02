import classNames from "classnames";
import React, { FC } from "react";

export const ContentSection: FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <div
    className={classNames(
      "flex flex-col max-w-7xl w-full mx-auto px-16 max-lg:px-8 max-md:px-4 max-sm:px-2",
      className
    )}
  >
    {children}
  </div>
);
