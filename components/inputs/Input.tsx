import { inputClasses } from "./styles";
import ErrorField from "./ErrorField";
import { AiOutlineCheckCircle } from "react-icons/ai";
import {
  ChangeEventHandler,
  DetailedHTMLProps,
  InputHTMLAttributes,
} from "react";

export interface InputProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "prefix"
  > {
  type: string;
  value: any;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  disabled?: boolean;
  useDefaultStyle?: boolean;
  checkIcon?: boolean;
  wrapperClassName?: string;
  label?: string;
  prefix?: JSX.Element;
  prefixClassName?: string;
  suffix?: JSX.Element;
  error?: string;
  showErrorState?: boolean;
  noMaxWidth?: boolean;
  subtitle?: JSX.Element | string;
}

const Input = ({
  checkIcon = false,
  type,
  value = "",
  onChange,
  className,
  wrapperClassName = "w-full",
  disabled,
  label,
  prefix,
  prefixClassName,
  suffix,
  min,
  error = "",
  max = Number.MAX_SAFE_INTEGER,
  step,
  showErrorState = false,
  noMaxWidth,
  useDefaultStyle = true,
  subtitle,
  ...props
}: InputProps) => {
  const numberInputOnWheelPreventChange = (e) => {
    // Prevent the input value change
    e.target.blur();

    // Prevent the page/container scrolling
    e.stopPropagation();

    // Refocus immediately, on the next tick (after the current     function is done)
    setTimeout(() => {
      e.target.focus();
    }, 0);
  };
  return (
    <div className={`text-black flex flex-col relative ${wrapperClassName}`}>
      {label && <div className="mb-1.5 text-sm text-fgd-1">{label}</div>}
      {subtitle && <p className="text-fgd-3 mb-1 -mt-2">{subtitle}</p>}
      {prefix ? (
        <div
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${prefixClassName}`}
        >
          {prefix}
        </div>
      ) : null}
      <input
        onWheel={numberInputOnWheelPreventChange}
        max={max}
        min={min}
        type={type}
        value={value}
        onChange={onChange}
        className={inputClasses({
          className,
          disabled,
          error,
          noMaxWidth,
          useDefaultStyle,
          showErrorState,
        })}
        disabled={disabled}
        step={step}
        {...props}
      />

      {checkIcon && !error && (
        <AiOutlineCheckCircle className="w-6 h-6 absolute right-2 top-1/2 text-green" />
      )}

      {suffix && (
        <div className="absolute right-0 text-xs flex items-center pr-2 h-full bg-transparent text-fgd-4">
          {suffix}
        </div>
      )}

      <div className={error && "pt-1"}>
        <ErrorField text={error}></ErrorField>
      </div>
    </div>
  );
};

export default Input;
