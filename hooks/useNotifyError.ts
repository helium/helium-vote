import { useEffect } from "react";
import { notify } from "../utils/notifications";

export function useNotifyError(error: Error | undefined, backupMessage: string) {
  useEffect(() => {
    if (error) {
      notify({
        message: error.message || backupMessage, 
        type: "error",
        error
      })
    }
  }, [error, backupMessage])
}
