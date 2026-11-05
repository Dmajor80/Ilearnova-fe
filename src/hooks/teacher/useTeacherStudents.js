import { useCallback, useEffect, useRef, useState } from "react";
import { getTeacherStudents } from "@/api/teacher";
import useTeacherApi, { getTeacherList } from "./teacherApiUtils";

export default function useTeacherStudents() {
  const { request, circuitBreaker, loading, error, lastUpdated, notification } = useTeacherApi();
  const { resetAllEndpoints } = circuitBreaker;
  const [students, setStudents] = useState([]);

  const refreshData = useCallback(async (params = {}, resetFailures = false) => {
    if (resetFailures) resetAllEndpoints();
    try {
      const result = await request(
        "teacherStudents",
        "fetch_teacher_students",
        () => getTeacherStudents(params),
        { failureMessage: "Students unavailable" }
      );
      if (result !== null) setStudents(getTeacherList(result, ["students"]));
      return result;
    } catch {
      setStudents([]);
      return null;
    }
  }, [request, resetAllEndpoints]);

  const refreshRef = useRef(refreshData);
  refreshRef.current = refreshData;
  useEffect(() => {
    refreshRef.current();
  }, []);

  return {
    students,
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
