import { useState, useEffect, useCallback, useMemo } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";
import { getSchoolGrades } from "@/api/schoolAdminApi";
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
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Grades data state
  const [availableGrades, setAvailableGrades] = useState([]);
  const [gradesLoading, setGradesLoading] = useState(false);
  const [gradesError, setGradesError] = useState(null);



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

    try {
      const queryParams = {
        page: currentPage,
        page_size: studentsPerPage,
        search: searchQuery,
        grade: selectedGrade,
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
      
      const data = payload?.data ?? payload;
      console.log("Students API response:", data);

      // Handle both paginated and non-paginated responses
      if (data.results) {
        // Paginated response
        setStudents(data.results || []);
        setTotalStudents(data.count || 0);
      } else if (Array.isArray(data.students)) {
        // Non-paginated response with students array
        setStudents(data.students || []);
        setTotalStudents(data.students?.length || 0);
      } else if (Array.isArray(data)) {
        // Direct array response
        setStudents(data || []);
        setTotalStudents(data?.length || 0);
      } else {
        // Fallback
        setStudents([]);
        setTotalStudents(0);
      }

      setError(null);
    } catch (err) {
      const appError = parseError(err, { action: "fetch_students" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      // Mark endpoint as failed to prevent repeated calls
      circuitBreaker.markEndpointFailed(endpointName, userMessage);

      // Only show notification once when endpoint first fails
      notification.notify(`Students data unavailable: ${userMessage}`, notificationType);

      // Set empty state on error - don't use fallback data
      console.warn("Failed to fetch student data:", err);
      setStudents([]);
      setTotalStudents(0);
    }
  }, [currentPage, studentsPerPage, searchQuery, selectedGrade, circuitBreaker, notification]);

  /**
   * Fetch available grades from API
   */
  const fetchGrades = useCallback(async () => {
    const endpointName = "grades";

    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping grades call - endpoint marked as failed");
      return;
    }

    setGradesLoading(true);
    setGradesError(null);

    try {
      // Organization ID is automatically injected via X-Org-Id header by org_gate system
      const response = await getSchoolGrades({
        active_only: true
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

      circuitBreaker.markEndpointFailed(endpointName, userMessage);
      setGradesError(userMessage);
      console.warn("Failed to fetch grades:", err);

      // Don't use fallback data - set empty array
      setAvailableGrades([]);
    } finally {
      setGradesLoading(false);
    }
  }, [circuitBreaker.shouldCallEndpoint, circuitBreaker.markEndpointFailed]);

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
   * Handle grade filter
   */
  const handleGradeFilter = useCallback((grade) => {
    setSelectedGrade(grade);
    setCurrentPage(1); // Reset to first page when filtering
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

  // Initial data fetch
  useEffect(() => {
    refreshData(); // Fetches students only
  }, []); // Empty dependency array - only run once on mount

  // Fetch grades only once on mount (separate effect to avoid re-runs)
  useEffect(() => {
    let mounted = true;

    const loadGrades = async () => {
      const endpointName = "grades";

      if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
        console.log("Skipping grades call - endpoint marked as failed");
        return;
      }

      setGradesLoading(true);
      setGradesError(null);

      try {
        // Organization ID is automatically injected via X-Org-Id header by org_gate system
        const response = await getSchoolGrades({
          active_only: true
        });
        const data = response?.data ?? response;
        console.log("Grades API response:", data);

        if (!mounted) return; // Component unmounted

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
        if (!mounted) return; // Component unmounted

        const appError = parseError(err, { action: "fetch_grades" });
        const userMessage = getUserFriendlyMessage(appError);

        circuitBreaker.markEndpointFailed(endpointName, userMessage);
        setGradesError(userMessage);
        console.warn("Failed to fetch grades:", err);

        // Don't use fallback data - set empty array
        setAvailableGrades([]);
      } finally {
        if (mounted) {
          setGradesLoading(false);
        }
      }
    };

    loadGrades();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  // Refetch when filters change
  useEffect(() => {
    if (!loading) {
      fetchStudents();
    }
  }, [currentPage, searchQuery, selectedGrade]);

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
    selectedGrade,

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
    fetchGrades,
    handleSearch,
    handleGradeFilter,
    handlePageChange,
    handleStudentSelect,
    clearStudentSelection,

    // Notifications
    notification
  };
}


