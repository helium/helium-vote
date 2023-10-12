import { FunctionComponent } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineExclamationCircle,
  AiOutlineExclamation,
} from "react-icons/ai";

interface InlineNotificationProps {
  desc?: string | React.ReactNode;
  title?: string;
  type: string;
}

const InlineNotification: FunctionComponent<InlineNotificationProps> = ({
  desc,
  title,
  type,
}) => (
  <div
    className={`border ${
      type === "error"
        ? "border-red"
        : type === "success"
        ? "border-green"
        : type === "info"
        ? "border-bkg-4"
        : "border-orange"
    } flex items-center p-2 rounded-md`}
  >
    {type === "error" ? (
      <AiOutlineExclamationCircle className="flex-shrink-0 h-5 w-5 mr-2 text-red" />
    ) : null}
    {type === "success" ? (
      <AiOutlineCheckCircle className="flex-shrink-0 h-5 w-5 mr-2 text-green" />
    ) : null}
    {type === "warning" ? (
      <AiOutlineExclamation className="flex-shrink-0 h-5 w-5 mr-2 text-orange" />
    ) : null}
    {type === "info" ? (
      <AiOutlineExclamation className="flex-shrink-0 h-5 w-5 mr-2 text-fgd-3" />
    ) : null}
    <div>
      <div className="text-fgd-3">{title}</div>
      <div
        className={`${title && desc && "pt-1"} font-normal text-xs text-fgd-3`}
      >
        {desc}
      </div>
    </div>
  </div>
);

export default InlineNotification;
