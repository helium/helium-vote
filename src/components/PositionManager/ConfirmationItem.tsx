import classNames from "classnames";
import React, { FC } from "react";
import Image from "next/image";

export const ConfirmationItem: FC<{
  img: { alt: string; src: string };
  title: string;
  description?: string;
  className?: string;
}> = ({ img, title, description = "", className = "" }) => {
  return (
    <div
      className={classNames(
        "flex flex-col flex-1 gap-4 p-6 justiy-center items-center",
        className
      )}
    >
      <div className="size-12 rounded-full relative">
        <Image alt={img.alt} src={img.src} fill />
      </div>
      <div className="flex flex-col text-center items-center">
        <span className="text-sm">{title}</span>
        <span className="font-medium">{description}</span>
      </div>
    </div>
  );
};
