import { useCallback, useEffect, useRef, useState } from "react";
import { getTeacherAnalytics } from "@/api/teacher";
import useTeacherApi from "./teacherApiUtils";

export default function useTeacherAnalytics() {
  const { request, circuitBreaker, loading, error, lastUpdated, notification } = useTeacherApi();
  const { resetAllEndpoints } = circuitBreaker;
  const [analytics, setAnalytics] = useState(null);

  const refreshData = useCallback(async (classId, resetFailures = false) => {
    if (resetFailures) resetAllEndpoints();
    try {
      const result = await request(
        "teacherAnalytics",
        "fetch_teacher_analytics",
        () => getTeacherAnalytics(classId),
        { failureMessage: "Teacher analytics unavailable" }
      );
      if (result !== null) setAnalytics(result);
      return result;
    } catch {
      setAnalytics(null);
      return null;
    }
  }, [request, resetAllEndpoints]);

  const refreshRef = useRef(refreshData);
  refreshRef.current = refreshData;
  useEffect(() => {
    refreshRef.current();
  }, []);

  return {
    analytics,
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
