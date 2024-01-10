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
        "flex flex-row space-x-2 pl-2 pr-4 h-12 rounded-3xl cursor-pointer align-center text-white font-medium items-center",
        {
          "bg-gray-600": active,
          "bg-gray-600 bg-opacity-25 hover:bg-gray-500 hover:bg-opacity-50":
            !active,
        }
      )}
    >
      <img
        alt={`${name} icon`}
        src={icon}
        className="rounded-3xl border-2 w-8 h-8"
      />
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
