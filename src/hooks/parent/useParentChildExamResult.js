import { useCallback } from "react";
import { getParentChildExamResult } from "@/api/parent";
import useParentQuery from "./useParentQuery";

export default function useParentChildExamResult(childId, examId) {
  const query = useCallback(
    () => getParentChildExamResult(childId, examId),
    [childId, examId]
  );
  const result = useParentQuery({
    action: "fetch_parent_child_exam_result",
    enabled: Boolean(childId && examId),
    label: "Exam result",
    query
  });

  return { ...result, examResult: result.data };
}
