import classNames from "classnames";
import React, { FC } from "react";

export const ContentSection: FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <div
    className={classNames(
      "flex flex-col max-w-7xl w-full mx-auto px-4",
      className
    )}
  >
    {children}
  </div>
);
