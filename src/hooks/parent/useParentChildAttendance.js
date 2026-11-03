import { useCallback, useMemo } from "react";
import { getParentChildAttendance } from "@/api/parent";
import { getParentAttendanceList } from "./parentApiUtils";
import useParentQuery from "./useParentQuery";

const EMPTY_PARAMS = {};

export default function useParentChildAttendance(childId, params = EMPTY_PARAMS) {
  const paramsKey = JSON.stringify(params);
  const stableParams = useMemo(() => JSON.parse(paramsKey), [paramsKey]);
  const query = useCallback(
    () => getParentChildAttendance(childId, stableParams),
    [childId, stableParams]
  );
  const result = useParentQuery({
    action: "fetch_parent_child_attendance",
    enabled: Boolean(childId),
    initialData: [],
    label: "Attendance",
    query,
    select: getParentAttendanceList
  });

  return { ...result, attendance: result.data };
}
