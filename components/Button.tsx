import { FunctionComponent } from "react";
import Loading, { LoadingDots } from "./Loading";
import Tooltip from "./Tooltip";
import classNames from "classnames";

interface ButtonProps {
  className?: string;
  isLoading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  small?: boolean;
  tooltipMessage?: string;
  style?: any;
  type?: "button" | "submit";
}

const Button: FunctionComponent<React.PropsWithChildren<ButtonProps>> = ({
  children,
  className,
  disabled,
  isLoading,
  small,
  tooltipMessage = "",
  style,
  type = "button",
  ...props
}) => {
  return (
    <button
      className={`${className} default-transition font-bold px-4 bg-blue-600 rounded-lg ${
        small ? "py-1" : "py-2.5"
      } text-sm focus:outline-none ${
        disabled
          ? "opacity-60 cursor-not-allowed"
          : "hover:bg-blue-500 text-bkg-2 hover:bg-fgd-1"
      }`}
      {...props}
      style={style}
      type={type}
      disabled={disabled}
    >
      <Tooltip content={tooltipMessage}>
        <div>{isLoading ? <Loading /> : children}</div>
      </Tooltip>
    </button>
  );
};

export default Button;

export const SecondaryButton: FunctionComponent<React.PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  disabled = false,
  className,
  isLoading,
  small = false,
  tooltipMessage = "",
  type = "button",
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={classNames(
        className,
        `border border-white ${
          disabled ? "opacity-60" : "hover:bg-gray-700"
        } font-bold default-transition rounded-lg ${className?.includes("px") ? '' : 'px-4'} ${
          small ? "py-1" : "py-2.5"
        } text-primary-light text-sm hover:border-fgd-1 hover:text-fgd-1 focus:outline-none disabled:border-fgd-4 disabled:text-fgd-3 disabled:cursor-not-allowed`,
      )}
      {...props}
    >
      <Tooltip content={tooltipMessage}>
        {isLoading ? <Loading /> : children}
      </Tooltip>
    </button>
  );
};

export const LinkButton: FunctionComponent<React.PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  disabled = false,
  className,
  type = "button",
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${className} border-0 default-transition text-sm disabled:cursor-not-allowed disabled:opacity-60 hover:opacity-60 focus:outline-none`}
      {...props}
    >
      {children}
    </button>
  );
};

interface NewButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  secondary?: boolean;
  radio?: boolean;
  selected?: boolean;
  className?: string;
}

export const NewButton: FunctionComponent<NewButtonProps> = ({
  className = "",
  loading = false,
  secondary = false,
  children,
  ...props
}) => {
  let classNames = `heading-cta default-transition rounded-full focus-visible:outline-none disabled:cursor-not-allowed `;

  if (loading) {
    classNames +=
      " h-[64px] min-w-[208px] border border-fgd-3 disabled:border-fgd-3";
  } else if (secondary) {
    classNames +=
      "py-3 px-2 h-[64px] min-w-[208px] text-fgd-1 border border-fgd-3 focus:border-fgd-1 hover:bg-fgd-1 hover:text-bkg-1 active:bg-fgd-2 active:text-bkg-1 active:border-none disabled:bg-fgd-4 disabled:text-bkg-1 disabled:border-none ";
  } else {
    // this is a primary button
    // TODO: make sure this using the typogrpahic class for CTAs
    classNames +=
      "py-4 px-2 h-[64px] min-w-[208px] text-bkg-1 bg-fgd-1 hover:bg-fgd-2 active:bg-fgd-3 active:border-none focus:border-2 focus:border-[#00E4FF] disabled:bg-fgd-4";
  }

  classNames += ` ${className}`;

  return (
    <button
      className={classNames}
      disabled={props.disabled || loading}
      {...props}
    >
      {!loading ? children : <LoadingDots />}
    </button>
  );
};
