import { useCallback, useEffect, useRef, useState } from "react";
import { getTeacherSubjects, getTeacherSubjectStudents } from "@/api/teacher";
import useTeacherApi, { getTeacherList } from "./teacherApiUtils";

/**
 * Subjects the teacher teaches, classless ones included, and each subject's
 * students. Use this for subject pickers instead of a class -> subject cascade,
 * which can never reach a subject that has no class.
 */
export default function useTeacherSubjects() {
  const { request, circuitBreaker, loading, error, lastUpdated, notification } = useTeacherApi();
  const { resetAllEndpoints } = circuitBreaker;
  const [subjects, setSubjects] = useState([]);

  const refreshData = useCallback(async (resetFailures = false) => {
    if (resetFailures) resetAllEndpoints();
    try {
      const result = await request(
        "teacherSubjects",
        "fetch_teacher_subjects",
        () => getTeacherSubjects(),
        { failureMessage: "Your subjects are unavailable" }
      );
      if (result !== null) setSubjects(getTeacherList(result, ["subjects"]));
      return result;
    } catch {
      setSubjects([]);
      return null;
    }
  }, [request, resetAllEndpoints]);

  const fetchStudents = useCallback(async (subjectId) => {
    const result = await request(
      `teacherSubjectStudents:${subjectId}`,
      "fetch_teacher_subject_students",
      () => getTeacherSubjectStudents(subjectId),
      { failureMessage: "Students unavailable" }
    );
    return getTeacherList(result, ["students"]);
  }, [request]);

  const refreshRef = useRef(refreshData);
  refreshRef.current = refreshData;
  useEffect(() => {
    refreshRef.current();
  }, []);

  return {
    subjects,
    loading,
    error,
    lastUpdated,
    refreshData,
    fetchStudents,
    notification
  };
}
