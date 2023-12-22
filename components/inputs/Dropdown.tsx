import React, { useMemo, useState, useRef, useEffect } from "react";
import classNames from "classnames";

const Dropdown = ({
  value,
  values,
  onSelect,
  className,
}: {
  value: string;
  className?: string;
  values: { name: string; value: string }[];
  onSelect: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = useMemo(
    () => values.find((v) => v.value === value),
    [values, value]
  );
  const dropdownRef = useRef(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        className={classNames(
          "text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-blue-800 cursor-pointer",
          className
        )}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.name}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
        >
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {values.map(({ value, name }, index) => (
              <li key={index}>
                <div
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => {
                    onSelect(value);
                    setIsOpen(false);
                  }}
                >
                  {name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
