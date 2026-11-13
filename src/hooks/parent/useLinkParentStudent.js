import { useCallback, useState } from "react";
import { linkParentStudent } from "@/api/parent";
import useNotification from "@/hooks/useNotification";
import {
  getNotificationType,
  getUserFriendlyMessage,
  parseError
} from "@/lib/errorHandler";
import { unwrapParentResponse } from "./parentApiUtils";

export default function useLinkParentStudent() {
  const notification = useNotification("info", 5000);
  const { notify } = notification;
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);

  const linkStudent = useCallback(async (requestData) => {
    setMutating(true);
    setError(null);
    try {
      const response = await linkParentStudent(requestData);
      notify("Student link request sent successfully", "success");
      return unwrapParentResponse(response);
    } catch (requestError) {
      const appError = parseError(requestError, { action: "link_parent_student" });
      setError(appError);
      notify(
        `Unable to link student: ${getUserFriendlyMessage(appError)}`,
        getNotificationType(appError)
      );
      console.warn("Failed to link student to parent:", requestError);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notify]);

  return { linkStudent, mutating, error, notification };
}
