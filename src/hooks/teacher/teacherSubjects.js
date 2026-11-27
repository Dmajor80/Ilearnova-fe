/** "Mathematics — JSS1A" for a class's subject, "French (no class)" otherwise. */
export const teacherSubjectLabel = (subject) => {
  if (!subject) return "";
  return subject.class_name
    ? `${subject.name} — ${subject.class_name}`
    : `${subject.name} (no class)`;
};
