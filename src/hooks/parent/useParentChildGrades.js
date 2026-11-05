import { useCallback } from "react";
import { getParentChildGrades } from "@/api/parent";
import { getParentGradesList } from "./parentApiUtils";
import useParentQuery from "./useParentQuery";

export default function useParentChildGrades(childId) {
  const query = useCallback(() => getParentChildGrades(childId), [childId]);
  const result = useParentQuery({
    action: "fetch_parent_child_grades",
    enabled: Boolean(childId),
    initialData: [],
    label: "Grades",
    query,
    select: getParentGradesList
  });

  return { ...result, grades: result.data };
}
