import { useState, useEffect, useCallback } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";

/**
 * Hook that manages the unpaid-tuition list fetching and state management.
 * Follows the same patterns as useStudentData / useSchoolDashboardData for consistency.
 *
 * Endpoint returns StudentDetail records (id, full_name, student_id, class_name,
 * fees, etc.) for students who currently owe tuition fees.
 */
export default function useUnpaidTuitionData() {
  const notification = useNotification("info", 5000);

  const circuitBreaker = useApiCircuitBreaker({
    maxRetries: 3,
    retryDelay: 60000,
    autoReset: false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);

  /**
   * Fetch students with unpaid tuition from the API
   */
  const fetchUnpaidTuition = useCallback(async () => {
    const endpointName = "unpaidTuition";

    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping unpaid tuition call - endpoint marked as failed");
      return;
    }

    try {
      const payload = await http.get("/api/admin/school/students/unpaid_tuition/", {
        auth: true
      });

      const data = payload?.data ?? payload;
      console.log("Unpaid tuition API response:", data);

      if (Array.isArray(data.students)) {
        setStudents(data.students);
        setTotalStudents(data.students.length);
      } else if (Array.isArray(data.results)) {
        setStudents(data.results);
        setTotalStudents(data.count ?? data.results.length);
      } else if (Array.isArray(data)) {
        setStudents(data);
        setTotalStudents(data.length);
      } else {
        setStudents([]);
        setTotalStudents(0);
      }

      setError(null);
    } catch (err) {
      const appError = parseError(err, { action: "fetch_unpaid_tuition" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      circuitBreaker.markEndpointFailed(endpointName, userMessage);
      notification.notify(`Unpaid tuition data unavailable: ${userMessage}`, notificationType);

      console.warn("Failed to fetch unpaid tuition data:", err);
      setStudents([]);
      setTotalStudents(0);
    }
  }, [circuitBreaker, notification]);

  const refreshData = useCallback(async (resetFailures = false) => {
    if (resetFailures) {
      circuitBreaker.resetAllEndpoints();
    }

    setLoading(true);
    setError(null);

    try {
      await fetchUnpaidTuition();
      setLastUpdated(new Date());
    } catch (err) {
      const appError = parseError(err, { action: "refresh_unpaid_tuition" });
      setError(appError);
      console.warn("Failed to refresh unpaid tuition data:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchUnpaidTuition, circuitBreaker]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    refreshData();
  }, []);

  return {
    loading,
    error,
    lastUpdated,
    students,
    totalStudents,
    currentPage,
    studentsPerPage,

    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,

    refreshData,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    handlePageChange,

    notification
  };
}
