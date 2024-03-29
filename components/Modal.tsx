import { AiOutlineClose } from "react-icons/ai";
import { Portal } from "react-portal";

const Modal = ({
  isOpen,
  onClose,
  children,
  hideClose = false,
  sizeClassName = "sm:max-w-md",
  background = "bg-hv-gray-750",
  zIndex = "z-30",
  wrapperStyle,
  bgBlack = true,
  bgClickClose = true,
}: {
  isOpen: boolean;
  onClose: any;
  children: any;
  hideClose?: boolean;
  sizeClassName?: string;
  background?: string;
  wrapperStyle?: any;
  bgBlack?: boolean;
  zIndex?: string;
  bgClickClose?: boolean;
}) => {
  return (
    <Portal>
      <div
        style={wrapperStyle}
        className={`text-white dark fixed inset-0 ${zIndex} overflow-y-auto text-fgd-1`}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center min-h-screen px-4 pb-20 text-center sm:block sm:p-0">
          {isOpen ? (
            <div
              className={`fixed inset-0 transition-opacity ${
                bgBlack ? "bg-black" : ""
              } bg-opacity-70`}
              aria-hidden="true"
              onClick={bgClickClose ? onClose : null}
            ></div>
          ) : null}

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          {isOpen ? (
            <div
              className={`inline-block bg-bkg-2 ${background}
              rounded-lg text-left px-8 pt-6 pb-8 shadow-lg transform transition-all
              sm:my-8 align-middle ${sizeClassName} w-full bg-opacity-100`}
            >
              {!hideClose ? (
                <div className="">
                  <button
                    onClick={onClose}
                    className={`absolute right-2 top-2 text-fgd-1 hover:text-primary focus:outline-none`}
                  >
                    <AiOutlineClose className={`h-5 w-5`} />
                  </button>
                </div>
              ) : (
                <div className="w-full pt-4" />
              )}
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </Portal>
  );
};

const Header = ({ children }) => {
  return <div className={`flex justify-center bg-bkg-2 pb-4`}>{children}</div>;
};

Modal.Header = Header;

export default Modal;
