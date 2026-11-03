import { useCallback } from "react";
import { getParentChildProgress } from "@/api/parent";
import useParentQuery from "./useParentQuery";

export default function useParentChildProgress(childId) {
  const query = useCallback(() => getParentChildProgress(childId), [childId]);
  const result = useParentQuery({
    action: "fetch_parent_child_progress",
    enabled: Boolean(childId),
    label: "Progress",
    query
  });

  return { ...result, progress: result.data };
}
