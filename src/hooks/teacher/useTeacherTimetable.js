import { useCallback, useEffect, useRef, useState } from "react";
import { getTeacherTimetable } from "@/api/teacher";
import useTeacherApi from "./teacherApiUtils";

export default function useTeacherTimetable() {
  const { request, circuitBreaker, loading, error, lastUpdated, notification } = useTeacherApi();
  const { resetAllEndpoints } = circuitBreaker;
  const [timetable, setTimetable] = useState(null);

  const refreshData = useCallback(async (resetFailures = false) => {
    if (resetFailures) resetAllEndpoints();
    try {
      const result = await request(
        "teacherTimetable",
        "fetch_teacher_timetable",
        getTeacherTimetable,
        { failureMessage: "Teacher timetable unavailable" }
      );
      if (result !== null) setTimetable(result);
      return result;
    } catch {
      setTimetable(null);
      return null;
    }
  }, [request, resetAllEndpoints]);

  const refreshRef = useRef(refreshData);
  refreshRef.current = refreshData;
  useEffect(() => {
    refreshRef.current();
  }, []);

  return {
    timetable,
    loading,
    error,
    lastUpdated,
    refreshData,
    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,
    endpointRetries: circuitBreaker.endpointRetries,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    notification
  };
}
