import { useCallback, useEffect, useState } from "react";
import { getTeacherPermissions } from "@/api/teacher";

export const TEACHER_PERMISSIONS = {
  manageClassStudents: "manage_class_students",
  manageSubjectStudents: "manage_subject_students",
  createSubjects: "create_subjects",
  importStudents: "import_students",
};

/**
 * Extra permissions the school admin gave this teacher, and their own
 * classes (``leads``: they lead it rather than only teach a subject in it).
 * The server checks every action; this only decides which controls show.
 * Any failure means nothing is granted, so the controls stay hidden.
 */
export default function useTeacherPermissions() {
  const [permissions, setPermissions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await getTeacherPermissions();
      const data = payload?.data ?? payload;
      setPermissions(Array.isArray(data?.permissions) ? data.permissions : []);
      setClasses(Array.isArray(data?.classes) ? data.classes : []);
    } catch {
      setPermissions([]);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const has = useCallback((code) => permissions.includes(code), [permissions]);

  return { permissions, classes, loading, has, reload };
}
