export function capitalize(str?: string) {
  return str ? str?.charAt(0).toUpperCase() + str?.slice(1) : str
}

const ErrorField = ({ text }) => {
  return text ? (
    <div className="text-red text-xs">{text ? capitalize(text) : text}</div>
  ) : null;
};

export default ErrorField;
