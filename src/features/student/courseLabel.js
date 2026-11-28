import { teacherSubjectLabel } from "@/hooks/teacher/teacherSubjects";

/** A course-progress row's name: the class, or for a subject taken outside
 * the student's classes "French (no class)" / "Science — JSS2". */
export const progressLabel = (row) =>
  row.kind === "subject" ? teacherSubjectLabel({ name: row.course_name, class_name: row.class_name }) : row.course_name;
