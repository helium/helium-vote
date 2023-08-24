import { toast } from "react-toastify"
import InlineNotification from "../components/InlineNotification"

export const notify = ({ type, message, error }: { type: 'error' | 'success', message: string, error?: any }) => {
  if (typeof error !== 'undefined') {
    console.error(error)
  }
  toast(<InlineNotification title={type} desc={message} type={type}></InlineNotification>)
}
