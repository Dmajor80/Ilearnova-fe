export const NO_CLASS = "No class";

/**
 * The class a timetable slot is for: its class's name, or "No class" for a
 * subject without a class (e.g. French, taken by pupils from several classes).
 * Reads the student (`course_name`) and teacher (`class_name`) shapes.
 */
export const slotClassName = (slot) =>
  slot?.course_name || slot?.class_name || slot?.class?.name || (slot?.subject_name ? NO_CLASS : "");
