import { useEffect, useState } from "react";
import classNames from "classnames";

const CopyableText: React.FC<
  React.PropsWithChildren<{
    textToCopy: string;
    className?: string;
    iconClasses?: string;
    customIcon?: React.ReactNode;
  }>
> = ({ textToCopy, className, iconClasses, children, customIcon }) => {
  const [successStatus, setSuccessStatus] = useState(false);

  useEffect(() => {
    const timer = window?.setTimeout(() => {
      setSuccessStatus(false);
    }, 1500);

    return () => window?.clearTimeout(timer);
  }, [successStatus]);

  const fallbackCopyTextToClipboard = (text) => {
    if (!document) return;
    let textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      let successful = document.execCommand("copy");
      setSuccessStatus(successful);
    } catch (err) {
      setSuccessStatus(false);
      console.error("Unable to copy", err);
    }

    document.body.removeChild(textArea);
  };

  const copyTextToClipboard = (text) => {
    if (!navigator.clipboard) {
      // if navigator.clipboard API isn't available
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function () {
        setSuccessStatus(true);
      },
      function (err) {
        setSuccessStatus(false);
        console.error("Unable to copy", err);
      }
    );
  };

  if (!textToCopy) return <span className={className}>{children}</span>;

  return (
    <>
      <span
        className="relative inline-flex items-center justify-center"
        onClick={() => copyTextToClipboard(textToCopy)}
      >
        <span className="relative inline-flex items-center justify-between">
          <span
            className={classNames(
              { "mr-2": !className && children },
              className
            )}
          >
            {children}
          </span>
          <span className="flex-1">
            {successStatus ? (
              <svg
                width="20"
                height="23"
                viewBox="0 0 20 23"
                className={classNames(
                  "text-hv-green-500",
                  { "h-4 w-auto": !iconClasses },
                  iconClasses
                )}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.1199 0.0947266H2.11987C1.01987 0.0947266 0.119873 0.994727 0.119873 2.09473V16.0947H2.11987V2.09473H14.1199V0.0947266ZM17.1199 4.09473H6.11987C5.01987 4.09473 4.11987 4.99473 4.11987 6.09473V20.0947C4.11987 21.1947 5.01987 22.0947 6.11987 22.0947H17.1199C18.2199 22.0947 19.1199 21.1947 19.1199 20.0947V6.09473C19.1199 4.99473 18.2199 4.09473 17.1199 4.09473ZM17.1199 20.0947H6.11987V6.09473H17.1199V20.0947Z"
                  fill="currentColor"
                />
              </svg>
            ) : customIcon ? (
              customIcon
            ) : (
              <img
                className={classNames(
                  "flex text-gray-600 cursor-pointer",
                  { "h-4 w-auto": !iconClasses },
                  iconClasses
                )}
                src="/images/clipboard.svg"
              />
            )}
          </span>
        </span>
      </span>
    </>
  );
};

export default CopyableText;
