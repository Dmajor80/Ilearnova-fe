import { useCallback } from "react";
import { getParentChildTimetable } from "@/api/parent";
import useParentQuery from "./useParentQuery";

const selectDays = (payload) => {
  const data = payload && "data" in payload ? payload.data : payload;
  return Array.isArray(data?.days) ? data.days : [];
};

export default function useParentChildTimetable(childId) {
  const query = useCallback(() => getParentChildTimetable(childId), [childId]);
  const result = useParentQuery({
    action: "fetch_parent_child_timetable",
    enabled: Boolean(childId),
    initialData: [],
    label: "Timetable",
    query,
    select: selectDays,
  });
  return { ...result, days: result.data };
}
