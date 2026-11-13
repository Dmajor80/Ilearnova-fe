import { useState, useEffect, useCallback, useMemo } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const unwrapApiData = (payload) => {
  const response = payload?.data ?? payload;
  return response?.data ?? response;
};

const fetchPendingTeacherRecords = async () => {
  const records = [];
  let page = 1;
  let pages = 1;

  while (page <= pages) {
    const payload = await http.get("/api/admin/school/pending-staff/", {
      auth: true,
      params: { page, page_size: 100, role: "teacher" }
    });
    const data = unwrapApiData(payload);

    if (!Array.isArray(data?.pending_staff)) {
      throw new Error("The pending staff endpoint returned an unexpected response.");
    }

    records.push(...data.pending_staff);
    pages = Math.max(page, Number(data.pagination?.pages) || page);
    page += 1;
  }

  return records;
};

/**
 * Hook that manages teacher data fetching, caching, and state management.
 * Follows the same patterns as useStudentData / useParentData for consistency.
 */
export default function useTeacherData() {
  const notification = useNotification("info", 5000);

  // Use unified circuit breaker
  const circuitBreaker = useApiCircuitBreaker({
    maxRetries: 3,
    retryDelay: 60000, // 1 minute
    autoReset: false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Teacher data state
  const [teachers, setTeachers] = useState([]);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [teachersPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Mutation loading state (create/update/delete)
  const [mutating, setMutating] = useState(false);

  /**
   * Fetch teachers data from API
   */
  const fetchTeachers = useCallback(async (params = {}) => {
    const endpointName = "teachers";

    // Check circuit breaker
    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping teachers call - endpoint marked as failed");
      return;
    }

    try {
      const queryParams = {
        page: currentPage,
        page_size: teachersPerPage,
        search: searchQuery,
        ordering,
        ...params
      };

      // Remove empty parameters
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === "" || queryParams[key] === null || queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });

      const [payload, pendingTeacherRecords] = await Promise.all([
        http.get("/api/admin/school/teachers/", {
          auth: true,
          params: queryParams
        }),
        fetchPendingTeacherRecords()
      ]);

      const data = unwrapApiData(payload);
      console.log("Teachers API response:", data);
      const pendingTeacherEmails = new Set(
        pendingTeacherRecords.map((record) => normalizeEmail(record.user?.email)).filter(Boolean)
      );
      const search = searchQuery.trim().toLowerCase();
      const pendingTeachersMatchingSearch = new Set(
        pendingTeacherRecords
          .filter((record) => {
            if (!search) return true;
            return `${record.user?.name || ""} ${record.user?.email || ""}`
              .toLowerCase()
              .includes(search);
          })
          .map((record) => normalizeEmail(record.user?.email))
          .filter(Boolean)
      ).size;

      const setVerifiedTeachers = (records, total) => {
        const verifiedTeachers = records.filter((teacher) => (
          teacher.is_verified !== false &&
          !pendingTeacherEmails.has(normalizeEmail(teacher.email || teacher.user?.email))
        ));
        const otherUnverifiedTeachers = records.filter((teacher) => (
          teacher.is_verified === false &&
          !pendingTeacherEmails.has(normalizeEmail(teacher.email || teacher.user?.email))
        )).length;
        setTeachers(verifiedTeachers);
        setTotalTeachers(Math.max(0, total - pendingTeachersMatchingSearch - otherUnverifiedTeachers));
      };

      // Handle the documented { teachers, pagination } response and legacy formats.
      if (Array.isArray(data.teachers)) {
        setVerifiedTeachers(data.teachers, data.pagination?.total ?? data.teachers.length);
      } else if (Array.isArray(data.results)) {
        // Paginated response (PaginatedTeacherListList)
        setVerifiedTeachers(data.results, data.pagination?.total ?? data.count ?? data.results.length);
      } else if (Array.isArray(data)) {
        // Direct array response
        setVerifiedTeachers(data, data.length);
      } else {
        // Fallback
        setTeachers([]);
        setTotalTeachers(0);
      }

      setError(null);
    } catch (err) {
      const appError = parseError(err, { action: "fetch_teachers" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      setError(appError);
      // Mark endpoint as failed to prevent repeated calls
      circuitBreaker.markEndpointFailed(endpointName, userMessage);

      // Only show notification once when endpoint first fails
      notification.notify(`Teachers data unavailable: ${userMessage}`, notificationType);

      // Set empty state on error - don't use fallback data
      console.warn("Failed to fetch teacher data:", err);
      setTeachers([]);
      setTotalTeachers(0);
    }
  }, [currentPage, teachersPerPage, searchQuery, ordering, circuitBreaker, notification]);

  /**
   * Fetch individual teacher details
   */
  const fetchTeacherDetails = useCallback(async (teacherId) => {
    const endpointName = "teacherDetails";

    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping teacher details call - endpoint marked as failed");
      return null;
    }

    try {
      const payload = await http.get(`/api/admin/school/teachers/${teacherId}/`, {
        auth: true
      });

      const data = payload?.data ?? payload;
      console.log("Teacher details API response:", data);

      return data;
    } catch (err) {
      const appError = parseError(err, { action: "fetch_teacher_details" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      circuitBreaker.markEndpointFailed(endpointName, userMessage);
      notification.notify(`Teacher details unavailable: ${userMessage}`, notificationType);

      console.warn("Failed to fetch teacher details:", err);
      return null;
    }
  }, [circuitBreaker, notification]);

  /**
   * Create a new teacher (TeacherCreateUpdateRequest: email required)
   */
  const createTeacher = useCallback(async (teacherData) => {
    setMutating(true);
    try {
      const payload = await http.post("/api/admin/school/teachers/", teacherData, {
        auth: true
      });
      const data = payload?.data ?? payload;
      console.log("Create teacher API response:", data);

      notification.notify("Teacher added successfully", "success");
      await fetchTeachers();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "create_teacher" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to add teacher: ${userMessage}`, notificationType);
      console.warn("Failed to create teacher:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchTeachers]);

  /**
   * Update an existing teacher (PatchedTeacherCreateUpdateRequest - partial update)
   */
  const updateTeacher = useCallback(async (teacherId, teacherData) => {
    setMutating(true);
    try {
      const payload = await http.patch(`/api/admin/school/teachers/${teacherId}/`, teacherData, {
        auth: true
      });
      const data = payload?.data ?? payload;
      console.log("Update teacher API response:", data);

      notification.notify("Teacher updated successfully", "success");
      await fetchTeachers();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "update_teacher" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to update teacher: ${userMessage}`, notificationType);
      console.warn("Failed to update teacher:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchTeachers]);

  /**
   * Delete a teacher
   */
  const deleteTeacher = useCallback(async (teacherId) => {
    setMutating(true);
    try {
      await http.del(`/api/admin/school/teachers/${teacherId}/`, {
        auth: true
      });

      notification.notify("Teacher removed successfully", "success");
      await fetchTeachers();
    } catch (err) {
      const appError = parseError(err, { action: "delete_teacher" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to remove teacher: ${userMessage}`, notificationType);
      console.warn("Failed to delete teacher:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchTeachers]);

  /**
   * Refresh teacher data
   */
  const refreshData = useCallback(async (resetFailures = false) => {
    if (resetFailures) {
      circuitBreaker.resetAllEndpoints();
    }

    setLoading(true);
    setError(null);

    try {
      await fetchTeachers();
      setLastUpdated(new Date());
    } catch (err) {
      const appError = parseError(err, { action: "refresh_teacher_data" });
      setError(appError);
      console.warn("Failed to refresh teacher data:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchTeachers, circuitBreaker]);

  /**
   * Handle search functionality
   */
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  /**
   * Handle ordering/sort
   */
  const handleOrderingChange = useCallback((value) => {
    setOrdering(value);
    setCurrentPage(1);
  }, []);

  /**
   * Handle pagination
   */
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  /**
   * Handle teacher selection
   */
  const handleTeacherSelect = useCallback((teacher) => {
    setSelectedTeacher(teacher);
  }, []);

  /**
   * Clear teacher selection
   */
  const clearTeacherSelection = useCallback(() => {
    setSelectedTeacher(null);
  }, []);

  // Initial data fetch
  useEffect(() => {
    refreshData();
  }, []); // Empty dependency array - only run once on mount

  // Refetch when filters change
  useEffect(() => {
    if (!loading) {
      fetchTeachers();
    }
  }, [currentPage, searchQuery, ordering]);

  /**
   * Computed values
   */
  const totalPages = useMemo(() => {
    return Math.ceil(totalTeachers / teachersPerPage);
  }, [totalTeachers, teachersPerPage]);

  const hasNextPage = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  const hasPreviousPage = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  return {
    // State
    loading,
    error,
    lastUpdated,
    teachers,
    totalTeachers,
    selectedTeacher,
    mutating,

    // Pagination
    currentPage,
    totalPages,
    teachersPerPage,
    hasNextPage,
    hasPreviousPage,

    // Filters
    searchQuery,
    ordering,

    // Error handling (from circuit breaker)
    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,
    endpointRetries: circuitBreaker.endpointRetries,

    // Actions
    refreshData,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    resetEndpoint: circuitBreaker.resetEndpoint,
    getEndpointStatus: circuitBreaker.getEndpointStatus,
    fetchTeacherDetails,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    handleSearch,
    handleOrderingChange,
    handlePageChange,
    handleTeacherSelect,
    clearTeacherSelection,

    // Notifications
    notification
  };
}
