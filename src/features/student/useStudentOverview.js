import { useEffect, useState } from "react";
import {
  getStudentAttendanceSummary,
  getStudentCourseProgress,
  getStudentTranscript,
} from "@/api/student";

const unwrap = (payload) => (payload && "data" in payload ? payload.data : payload);

const idle = { loading: true, data: null, error: null };

/** Loads one section and keeps it separate, so a failure in one leaves the others. */
function useSection(load) {
  const [state, setState] = useState(idle);
  useEffect(() => {
    let active = true;
    load()
      .then((payload) => active && setState({ loading: false, data: unwrap(payload), error: null }))
      .catch((error) => active && setState({ loading: false, data: null, error }));
    return () => {
      active = false;
    };
  }, [load]);
  return state;
}

/** Splits course progress into finished and unfinished classes. Classes
 * with no published lessons count as neither. */
export function summariseCourses(courses = []) {
  const withLessons = courses.filter((c) => c.total_lessons > 0);
  const inProgress = withLessons.filter((c) => c.completed_lessons < c.total_lessons);
  return {
    completed: withLessons.length - inProgress.length,
    inProgress,
  };
}

/**
 * The student Overview's data, from three existing endpoints:
 * course progress, attendance and graded online exams (transcript).
 */
export default function useStudentOverview() {
  const courses = useSection(getStudentCourseProgress);
  const attendance = useSection(getStudentAttendanceSummary);
  const transcript = useSection(getStudentTranscript);
  return { courses, attendance, transcript };
}
