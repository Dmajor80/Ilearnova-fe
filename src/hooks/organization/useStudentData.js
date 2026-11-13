import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";

/**
 * Hook that manages student data fetching, caching, and state management.
 * Follows the same patterns as useSchoolDashboardData for consistency.
 */
export default function useStudentData() {
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

  // Student data state
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const requestId = useRef(0);

  // Grades data state
  const [availableGrades, setAvailableGrades] = useState([]);
  const [gradesLoading, setGradesLoading] = useState(false);
  const [gradesError, setGradesError] = useState(null);

  // Mutation loading state (create/update/delete)
  const [mutating, setMutating] = useState(false);



  /**
   * Fetch students data from API
   */
  const fetchStudents = useCallback(async (params = {}) => {
    const endpointName = "students";

    // Check circuit breaker
    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping students call - endpoint marked as failed");
      return;
    }

    const request = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const queryParams = {
        page: currentPage,
        page_size: studentsPerPage,
        search: searchQuery.trim(),
        ...params
      };

      // Remove empty parameters
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === "" || queryParams[key] === null || queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });

      const payload = await http.get("/api/admin/school/students/", {
        auth: true,
        params: queryParams
      });
      const responseData = payload?.data ?? payload;
      const data = responseData?.data ?? responseData;
      console.log("Students API response:", data);

      // Handle the documented { students, pagination } response and legacy formats.
      if (Array.isArray(data?.students)) {
        if (request !== requestId.current) return;
        setStudents(data.students);
        setTotalStudents(data.pagination?.total ?? data.students.length);
      } else if (Array.isArray(data?.results)) {
        // Paginated response
        if (request !== requestId.current) return;
        setStudents(data.results || []);
        setTotalStudents(data.pagination?.total ?? data.count ?? data.results.length);
      } else if (Array.isArray(data)) {
        // Direct array response
        if (request !== requestId.current) return;
        setStudents(data || []);
        setTotalStudents(data?.length || 0);
      } else {
        throw new Error("The students endpoint returned an unexpected response.");
      }

      if (request === requestId.current) setError(null);
    } catch (err) {
      if (request !== requestId.current) return;
      const appError = parseError(err, { action: "fetch_students" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      setError(appError);
      // Mark endpoint as failed to prevent repeated calls
      circuitBreaker.markEndpointFailed(endpointName, userMessage);

      // Only show notification once when endpoint first fails
      notification.notify(`Students data unavailable: ${userMessage}`, notificationType);

      // Set empty state on error - don't use fallback data
      console.warn("Failed to fetch student data:", err);
      setStudents([]);
      setTotalStudents(0);
    } finally {
      if (request === requestId.current) setLoading(false);
    }
  }, [currentPage, studentsPerPage, searchQuery, circuitBreaker, notification]);

  /**
   * Fetch available grades from API
   */
  const fetchGrades = useCallback(async () => {
    const endpointName = "grades";
    const { shouldCallEndpoint, markEndpointFailed } = circuitBreaker;

    if (!shouldCallEndpoint(endpointName)) {
      console.log("Skipping grades call - endpoint marked as failed");
      return;
    }

    setGradesLoading(true);
    setGradesError(null);

    try {
      const response = await http.get("/api/admin/school/classes/", {
        auth: true,
        params: { page_size: 100 }
      });
      const data = response?.data ?? response;
      console.log("Grades API response:", data);

      // Handle different response formats
      if (Array.isArray(data.classes)) {
        setAvailableGrades(data.classes);
      } else if (Array.isArray(data.results)) {
        setAvailableGrades(data.results);
      } else if (Array.isArray(data)) {
        setAvailableGrades(data);
      } else {
        setAvailableGrades([]);
      }
    } catch (err) {
      const appError = parseError(err, { action: "fetch_grades" });
      const userMessage = getUserFriendlyMessage(appError);

      markEndpointFailed(endpointName, userMessage);
      setGradesError(userMessage);
      console.warn("Failed to fetch grades:", err);

      // Don't use fallback data - set empty array
      setAvailableGrades([]);
    } finally {
      setGradesLoading(false);
    }
  }, [circuitBreaker]);

  /**
   * Fetch individual student details
   */
  const fetchStudentDetails = useCallback(async (studentId) => {
    const endpointName = "studentDetails";

    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping student details call - endpoint marked as failed");
      return null;
    }

    try {
      const payload = await http.get(`/api/admin/school/students/${studentId}/`, {
        auth: true
      });
      
      const data = payload?.data ?? payload;
      console.log("Student details API response:", data);

      return data;
    } catch (err) {
      const appError = parseError(err, { action: "fetch_student_details" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      circuitBreaker.markEndpointFailed(endpointName, userMessage);
      notification.notify(`Student details unavailable: ${userMessage}`, notificationType);

      console.warn("Failed to fetch student details:", err);
      return null;
    }
  }, [circuitBreaker, notification]);

  /**
   * Create a new student (StudentCreateUpdateRequest: email required).
   * Reuses the existing createStudent() from schoolAdminApi.js rather than
   * duplicating the POST call.
   */
  const createStudent = useCallback(async (studentData) => {
    setMutating(true);
    try {
      const payload = await http.post("/api/admin/school/students/", studentData, {
        auth: true
      });
      const data = payload?.data ?? payload;
      console.log("Create student API response:", data);

      notification.notify("Student added successfully", "success");
      await fetchStudents();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "create_student" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to add student: ${userMessage}`, notificationType);
      console.warn("Failed to create student:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchStudents]);

  /**
   * Update an existing student (PatchedStudentCreateUpdateRequest - partial update).
   * NOTE: schoolAdminApi.js already exports an updateStudent() but it calls
   * http.put (a full replace) - fine for a complete edit form, but unsafe for
   * partial updates like the activate/deactivate toggle below (PUT-ing just
   * { is_active } would blank out the other required fields). This calls
   * PATCH directly instead, matching the spec's PatchedStudentCreateUpdateRequest.
   * If/when a full "edit student" form is built, prefer the PUT-based
   * updateStudent() from schoolAdminApi.js for that case.
   */
  const updateStudent = useCallback(async (studentId, studentData) => {
    setMutating(true);
    try {
      const payload = await http.patch(`/api/admin/school/students/${studentId}/`, studentData, {
        auth: true
      });
      const data = payload?.data ?? payload;
      console.log("Update student API response:", data);

      notification.notify("Student updated successfully", "success");
      await fetchStudents();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "update_student" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to update student: ${userMessage}`, notificationType);
      console.warn("Failed to update student:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchStudents]);

  /**
   * Delete a student. Reuses the existing deleteStudent() from
   * schoolAdminApi.js (which correctly calls http.del, not http.delete).
   */
  const deleteStudent = useCallback(async (studentId) => {
    setMutating(true);
    try {
      await http.del(`/api/admin/school/students/${studentId}/`, {
        auth: true
      });

      notification.notify("Student removed successfully", "success");
      await fetchStudents();
    } catch (err) {
      const appError = parseError(err, { action: "delete_student" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to remove student: ${userMessage}`, notificationType);
      console.warn("Failed to delete student:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchStudents]);

  /**
   * Refresh student data
   */
  const refreshData = useCallback(async (resetFailures = false, includeGrades = false) => {
    if (resetFailures) {
      circuitBreaker.resetAllEndpoints();
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch students and optionally grades
      const promises = [fetchStudents()];
      if (includeGrades) {
        promises.push(fetchGrades());
      }

      await Promise.all(promises);
      setLastUpdated(new Date());
    } catch (err) {
      const appError = parseError(err, { action: "refresh_student_data" });
      setError(appError);
      console.warn("Failed to refresh student data:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchStudents, fetchGrades, circuitBreaker]);

  /**
   * Refresh grades data specifically (for manual refresh)
   */
  const refreshGrades = useCallback(async () => {
    await fetchGrades();
  }, [fetchGrades]);

  /**
   * Handle search functionality
   */
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  /**
   * Handle pagination
   */
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  /**
   * Handle student selection
   */
  const handleStudentSelect = useCallback((student) => {
    setSelectedStudent(student);
  }, []);

  /**
   * Clear student selection
   */
  const clearStudentSelection = useCallback(() => {
    setSelectedStudent(null);
  }, []);

  const refreshDataRef = useRef(refreshData);
  refreshDataRef.current = refreshData;
  const fetchGradesRef = useRef(fetchGrades);
  fetchGradesRef.current = fetchGrades;

  const fetchStudentsRef = useRef(fetchStudents);
  fetchStudentsRef.current = fetchStudents;
  const lastSearch = useRef({ currentPage, searchQuery });

  useEffect(() => {
    refreshDataRef.current();
    fetchGradesRef.current();
    return () => {
      requestId.current += 1;
    };
  }, []);

  // Refetch when the user changes the page or search term, including during initial loading.
  useEffect(() => {
    if (lastSearch.current.currentPage === currentPage &&
      lastSearch.current.searchQuery === searchQuery) return;

    lastSearch.current = { currentPage, searchQuery };
    fetchStudentsRef.current();
  }, [currentPage, searchQuery]);

  /**
   * Computed values
   */
  const totalPages = useMemo(() => {
    return Math.ceil(totalStudents / studentsPerPage);
  }, [totalStudents, studentsPerPage]);

  const hasNextPage = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  const hasPreviousPage = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  const filteredStudents = useMemo(() => {
    return students; // API handles filtering, so return as-is
  }, [students]);

  return {
    // State
    loading,
    error,
    lastUpdated,
    students: filteredStudents,
    totalStudents,
    selectedStudent,
    mutating,

    // Grades data
    availableGrades,
    gradesLoading,
    gradesError,

    // Pagination
    currentPage,
    totalPages,
    studentsPerPage,
    hasNextPage,
    hasPreviousPage,

    // Filters
    searchQuery,

    // Error handling (from circuit breaker)
    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,
    endpointRetries: circuitBreaker.endpointRetries,

    // Actions
    refreshData,
    refreshGrades,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    resetEndpoint: circuitBreaker.resetEndpoint,
    getEndpointStatus: circuitBreaker.getEndpointStatus,
    fetchStudentDetails,
    createStudent,
    updateStudent,
    deleteStudent,
    fetchGrades,
    handleSearch,
    handlePageChange,
    handleStudentSelect,
    clearStudentSelection,

    // Notifications
    notification
  };
}
