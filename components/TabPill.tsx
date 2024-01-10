import classNames from "classnames";
import Link from "next/link";

export const TabPill = ({
  icon,
  name,
  href,
  active,
}: {
  icon: string;
  name: string;
  href: string;
  active: boolean;
}) => {
  return (
    <Link
      href={href}
      className={classNames(
        "p-1 flex flex-row space-x-2 pr-4 h-12 rounded-3xl cursor-pointer align-center text-white font-medium",
        {
          "bg-gray-600": active,
          "hover:bg-gray-500": !active,
        }
      )}
    >
      <img alt={`${name} icon`} src={icon} />
      <span
        className={classNames(
          "flex-grow flex items-center justify-center text-base md:text-xl",
          {
            "font-bold": active,
          }
        )}
      >
        {name}
      </span>
    </Link>
  );
};
