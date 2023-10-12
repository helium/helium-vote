import { FunctionComponent } from "react";

interface ButtonGroupProps {
  activeValue: string;
  className?: string;
  onChange: (x) => void;
  unit?: string;
  values: Array<string>;
  names?: Array<string>;
}

const ButtonGroup: FunctionComponent<ButtonGroupProps> = ({
  activeValue,
  className,
  unit,
  values,
  onChange,
  names,
}) => {
  return (
    <div className="bg-bkg-3 rounded-md">
      <div className="flex relative">
        {values.map((v, i) => (
          <button
            type="button"
            className={`${className} mx-1 cursor-pointer default-transition font-normal px-2 py-1.5 relative rounded-lg text-center text-xs w-1/2
              ${
                v === activeValue
                  ? `text-primary-light border border-hv-blue-700`
                  : `border border-hv-gray-400 text-fgd-2 hover:text-primary-light`
              }
            `}
            key={`${v}${i}`}
            onClick={() => onChange(v)}
            style={{
              width: `${100 / values.length}%`,
            }}
          >
            {names ? (unit ? names[i] + unit : names[i]) : unit ? v + unit : v}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ButtonGroup;
