import { useCallback, useEffect, useState } from "react";
import {
  createSchoolExam,
  deleteSchoolExam,
  getAdminSubjects,
  getSchoolExamResults,
  getSchoolExams,
  updateSchoolExam
} from "@/api/schoolAdminApi";
import useNotification from "@/hooks/useNotification";
import { getNotificationType, getUserFriendlyMessage, parseError } from "@/lib/errorHandler";

const PAGE_SIZE = 10;

const unwrap = (payload) => payload?.data ?? payload;

/** First readable message from a DRF error body ({field: ["msg"]}, {detail}, ...). */
export const describeApiError = (err) => {
  const find = (value) => {
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value.map(find).find(Boolean);
    if (value && typeof value === "object") {
      for (const [key, inner] of Object.entries(value)) {
        if (key === "success") continue;
        const message = find(inner);
        if (message) return key === "non_field_errors" || key === "detail" || key === "message" || key === "errors" ? message : `${key}: ${message}`;
      }
    }
    return null;
  };
  const raw = err?.context?.originalError ?? err;
  return find(raw?.data) || getUserFriendlyMessage(parseError(raw));
};

/**
 * School (org-admin) exams: list with status/search filters, create/edit,
 * delete (archives when attempted) and per-exam results.
 * The backend scopes everything to the admin's school, so no org context is needed.
 */
export default function useSchoolExamsData({ page = 1, status = "", search = "" } = {}) {
  const notification = useNotification("info", 5000);
  const { notify } = notification;

  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);
  const [exams, setExams] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [subjects, setSubjects] = useState([]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = unwrap(await getSchoolExams({
        page,
        page_size: PAGE_SIZE,
        status: status || undefined,
        search: search.trim() || undefined,
        ordering: "-created_at"
      }));
      setExams(Array.isArray(data?.exams) ? data.exams : Array.isArray(data) ? data : []);
      setPagination(data?.pagination ?? null);
    } catch (err) {
      const appError = parseError(err, { action: "fetch_school_exams" });
      setError(appError);
      setExams([]);
      setPagination(null);
      console.warn("Failed to fetch school exams:", err);
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Subject options for the exam form; exams also provide a fallback list.
  useEffect(() => {
    let cancelled = false;
    getAdminSubjects()
      .then((payload) => {
        const data = unwrap(payload);
        const list = Array.isArray(data) ? data : data?.subjects ?? data?.results ?? [];
        if (!cancelled) setSubjects(Array.isArray(list) ? list : []);
      })
      .catch((err) => console.warn("Failed to fetch subjects:", err));
    return () => { cancelled = true; };
  }, []);

  const mutate = useCallback(async (operation, action, successMessage) => {
    setMutating(true);
    try {
      const data = unwrap(await operation());
      notify(successMessage, "success");
      await refreshData();
      return data;
    } catch (err) {
      const appError = parseError(err, { action });
      notify(describeApiError(err), getNotificationType(appError));
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notify, refreshData]);

  const saveExam = useCallback((examData, id) => (id
    ? mutate(() => updateSchoolExam(id, examData), "update_school_exam", "Exam updated successfully")
    : mutate(() => createSchoolExam(examData), "create_school_exam", "Exam created successfully")
  ), [mutate]);

  const deleteExam = useCallback((exam) => mutate(
    () => deleteSchoolExam(exam.id),
    "delete_school_exam",
    exam.attempt_count ? "Exam archived (students have attempted it)" : "Exam deleted successfully"
  ), [mutate]);

  const fetchResults = useCallback(async (id) => {
    const data = unwrap(await getSchoolExamResults(id));
    return Array.isArray(data) ? data : data?.results ?? [];
  }, []);

  return {
    loading,
    mutating,
    error,
    exams,
    pagination,
    subjects,
    pageSize: PAGE_SIZE,
    refreshData,
    saveExam,
    deleteExam,
    fetchResults,
    notification
  };
}
