import { useState, useEffect, useCallback, useRef } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";

/**
 * Hook that manages fetching the school's subject list.
 * Follows the same patterns as useStudentData / useParentData for consistency.
 *
 * Uses the documented organization-admin subject endpoint.
 */
export default function useSubjectsData() {
  const notification = useNotification("info", 5000);

  const circuitBreaker = useApiCircuitBreaker({
    maxRetries: 3,
    retryDelay: 60000,
    autoReset: false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [subjectsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSubjects = useCallback(async () => {
    const endpointName = "subjects";

    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping subjects call - endpoint marked as failed");
      return;
    }

    try {
      const payload = await http.get("/api/admin/school/subjects/", {
        auth: true,
        params: {
          page: currentPage,
          page_size: subjectsPerPage,
          ...(searchQuery ? { search: searchQuery } : {})
        }
      });
      const data = payload?.data ?? payload;
      console.log("Subjects API response:", data);

      if (Array.isArray(data.subjects)) {
        setSubjects(data.subjects);
        setTotalSubjects(data.pagination?.total ?? data.subjects.length);
      } else if (Array.isArray(data.results)) {
        setSubjects(data.results);
        setTotalSubjects(data.pagination?.total ?? data.count ?? data.results.length);
      } else if (Array.isArray(data)) {
        setSubjects(data);
        setTotalSubjects(data.length);
      } else {
        setSubjects([]);
        setTotalSubjects(0);
      }

      setError(null);
    } catch (err) {
      const appError = parseError(err, { action: "fetch_subjects" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      circuitBreaker.markEndpointFailed(endpointName, userMessage);
      notification.notify(`Subjects unavailable: ${userMessage}`, notificationType);

      console.warn("Failed to fetch subjects:", err);
      setSubjects([]);
      setTotalSubjects(0);
      setError(appError);
    }
  }, [currentPage, subjectsPerPage, searchQuery, circuitBreaker, notification]);

  const refreshData = useCallback(async (resetFailures = false) => {
    if (resetFailures) {
      circuitBreaker.resetAllEndpoints();
    }
    setLoading(true);
    setError(null);
    try {
      await fetchSubjects();
    } catch (err) {
      const appError = parseError(err, { action: "refresh_subjects" });
      setError(appError);
    } finally {
      setLoading(false);
    }
  }, [fetchSubjects, circuitBreaker]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const refreshDataRef = useRef(refreshData);
  refreshDataRef.current = refreshData;
  const fetchSubjectsRef = useRef(fetchSubjects);
  fetchSubjectsRef.current = fetchSubjects;
  const loadingRef = useRef(loading);
  loadingRef.current = loading;
  const lastFilters = useRef({ currentPage, searchQuery });
  const pendingFilterFetch = useRef(false);

  useEffect(() => {
    refreshDataRef.current();
  }, []);

  useEffect(() => {
    const changed = lastFilters.current.currentPage !== currentPage ||
      lastFilters.current.searchQuery !== searchQuery;
    lastFilters.current = { currentPage, searchQuery };

    if (!changed && !pendingFilterFetch.current) return;
    if (loadingRef.current) {
      pendingFilterFetch.current = true;
      return;
    }

    pendingFilterFetch.current = false;
    setLoading(true);
    fetchSubjectsRef.current().finally(() => setLoading(false));
  }, [currentPage, searchQuery, loading]);

  const totalPages = Math.ceil(totalSubjects / subjectsPerPage);

  return {
    loading,
    error,
    subjects,
    totalSubjects,
    currentPage,
    totalPages,
    subjectsPerPage,
    searchQuery,

    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,

    refreshData,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    handleSearch,
    handlePageChange,

    notification
  };
}
