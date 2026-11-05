import { useCallback, useState } from "react";
import {
  getTeacherAttendanceReport,
  signTeacherAttendance
} from "@/api/teacher";
import useTeacherApi from "./teacherApiUtils";

export default function useTeacherAttendance() {
  const { request, circuitBreaker, loading, mutating, error, lastUpdated, notification } = useTeacherApi();
  const [attendanceReport, setAttendanceReport] = useState(null);

  const fetchAttendanceReport = useCallback(async (subjectId, params = {}) => {
    const result = await request(
      `teacherAttendanceReport:${subjectId}`,
      "fetch_teacher_attendance_report",
      () => getTeacherAttendanceReport(subjectId, params),
      { failureMessage: "Attendance report unavailable" }
    );
    if (result !== null) setAttendanceReport(result);
    return result;
  }, [request]);

  const signAttendance = useCallback(async (subjectId, attendanceData) => {
    const result = await request(
      `teacherAttendanceSign:${subjectId}`,
      "sign_teacher_attendance",
      () => signTeacherAttendance(subjectId, attendanceData),
      {
        mutation: true,
        successMessage: "Attendance submitted successfully",
        failureMessage: "Failed to submit attendance"
      }
    );
    return result;
  }, [request]);

  return {
    attendanceReport,
    loading,
    mutating,
    error,
    lastUpdated,
    fetchAttendanceReport,
    signAttendance,
    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,
    endpointRetries: circuitBreaker.endpointRetries,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    notification
  };
}
