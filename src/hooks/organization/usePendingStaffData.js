import { useCallback, useEffect, useRef, useState } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { getNotificationType, getUserFriendlyMessage, parseError } from "@/lib/errorHandler";

const pendingStaffPath = "/api/admin/school/pending-staff/";

const unwrapResponse = (payload) => {
  const response = payload?.data ?? payload;
  return response?.data ?? response;
};

/**
 * Pending people for this school, by role: "teacher" (default), "student" or
 * "parent". Students who self-register stay pending until verified.
 */
export default function usePendingStaffData(role = "teacher") {
  const noun = role;
  const label = role.charAt(0).toUpperCase() + role.slice(1);
  const { notify } = useNotification("info", 5000);
  const [pendingStaff, setPendingStaff] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
    has_next: false,
    has_prev: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  const refreshData = useCallback(async () => {
    const request = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const payload = await http.get(pendingStaffPath, {
        auth: true,
        params: { page: currentPage, page_size: 20, role }
      });
      const data = unwrapResponse(payload);

      if (!Array.isArray(data?.pending_staff)) {
        throw new Error("The pending staff endpoint returned an unexpected response.");
      }

      if (request === requestId.current) {
        const nextPagination = data.pagination || {};
        setPendingStaff(data.pending_staff);
        setPagination({
          page: nextPagination.page ?? currentPage,
          limit: nextPagination.limit ?? 20,
          total: nextPagination.total ?? data.pending_staff.length,
          pages: nextPagination.pages ?? 0,
          has_next: Boolean(nextPagination.has_next),
          has_prev: Boolean(nextPagination.has_prev)
        });
      }
    } catch (err) {
      if (request !== requestId.current) return;
      const appError = parseError(err, { action: `fetch_pending_${noun}s` });
      const message = getUserFriendlyMessage(appError);
      setError(appError);
      setPendingStaff([]);
      setPagination((current) => ({ ...current, total: 0, pages: 0, has_next: false, has_prev: false }));
      notify(`Pending ${noun}s unavailable: ${message}`, getNotificationType(appError));
      console.warn(`Failed to fetch pending ${noun}s:`, err);
    } finally {
      if (request === requestId.current) setLoading(false);
    }
  }, [currentPage, notify, role, noun]);

  const refreshDataRef = useRef(refreshData);
  refreshDataRef.current = refreshData;

  // Load on mount and whenever the page changes (Previous / Next).
  useEffect(() => {
    refreshDataRef.current();
  }, [currentPage]);

  const fetchPendingStaffDetails = useCallback(async (staffId) => {
    try {
      const payload = await http.get(`${pendingStaffPath}${staffId}/`, { auth: true });
      return unwrapResponse(payload);
    } catch (err) {
      const appError = parseError(err, { action: `fetch_pending_${noun}_details` });
      notify(
        `Unable to load ${noun} details: ${getUserFriendlyMessage(appError)}`,
        getNotificationType(appError)
      );
      throw appError;
    }
  }, [notify, noun]);

  const runMutation = useCallback(async (staffId, action, successMessage) => {
    setMutating(true);
    try {
      let payload;
      const path = `${pendingStaffPath}${staffId}/`;
      if (action.method === "DELETE") {
        payload = await http.del(path, { auth: true });
      } else if (action.method === "PUT") {
        payload = await http.put(path, action.data, { auth: true });
      } else {
        payload = await http.post(`${path}${action.path}/`, {}, { auth: true });
      }

      notify(successMessage, "success");
      if (pendingStaff.length === 1 && currentPage > 1) {
        setCurrentPage((page) => Math.max(1, page - 1));
      } else {
        await refreshData();
      }
      return unwrapResponse(payload);
    } catch (err) {
      const appError = parseError(err, { action: `pending_${noun}_${action.name}` });
      notify(
        `Unable to ${action.name} ${noun} request: ${getUserFriendlyMessage(appError)}`,
        getNotificationType(appError)
      );
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [currentPage, notify, noun, pendingStaff.length, refreshData]);

  const updatePendingStaff = useCallback((staffId, data) =>
    runMutation(staffId, { method: "PUT", data, name: "update" }, `${label} request updated.`),
  [label, runMutation]);

  const deletePendingStaff = useCallback((staffId) =>
    runMutation(staffId, { method: "DELETE", name: "delete" }, `${label} request deleted.`),
  [label, runMutation]);

  const verifyPendingStaff = useCallback((staffId) =>
    runMutation(staffId, { method: "POST", path: "verify", name: "verify" }, `${label} verified successfully.`),
  [label, runMutation]);

  const rejectPendingStaff = useCallback((staffId) =>
    runMutation(staffId, { method: "POST", path: "reject", name: "reject" }, `${label} request rejected.`),
  [label, runMutation]);

  /** Verify several at once, e.g. a whole intake. Returns { verified, not_found }. */
  const bulkVerifyPendingStaff = useCallback(async (ids) => {
    setMutating(true);
    try {
      const payload = await http.post(`${pendingStaffPath}bulk-verify/`, { ids }, { auth: true });
      const result = unwrapResponse(payload) || {};
      notify(`Verified ${result.verified ?? ids.length} ${noun}(s).`, "success");
      if (currentPage > 1) setCurrentPage(1);
      else await refreshData();
      return result;
    } catch (err) {
      const appError = parseError(err, { action: `pending_${noun}_bulk_verify` });
      notify(`Unable to verify ${noun}s: ${getUserFriendlyMessage(appError)}`, getNotificationType(appError));
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [currentPage, notify, noun, refreshData]);

  return {
    pendingStaff,
    totalPendingStaff: pagination.total,
    pagination,
    currentPage,
    totalPages: pagination.pages,
    hasNextPage: pagination.has_next,
    hasPreviousPage: pagination.has_prev,
    loading,
    mutating,
    error,
    setCurrentPage,
    refreshData,
    fetchPendingStaffDetails,
    updatePendingStaff,
    deletePendingStaff,
    verifyPendingStaff,
    rejectPendingStaff,
    bulkVerifyPendingStaff
  };
}
