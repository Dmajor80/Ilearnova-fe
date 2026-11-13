import { useState, useEffect, useCallback, useMemo } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";

/**
 * Hook that manages parent data fetching, caching, and state management.
 * Follows the same patterns as useStudentData / useSchoolDashboardData for consistency.
 */
export default function useParentData() {
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

  // Parent data state
  const [parents, setParents] = useState([]);
  const [totalParents, setTotalParents] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [parentsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [ordering, setOrdering] = useState("-date_joined");
  const [selectedParent, setSelectedParent] = useState(null);

  // Mutation loading state (create/update/delete)
  const [mutating, setMutating] = useState(false);

  /**
   * Fetch parents data from API
   */
  const fetchParents = useCallback(async (params = {}) => {
    const endpointName = "parents";

    // Check circuit breaker
    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping parents call - endpoint marked as failed");
      return;
    }

    try {
      const queryParams = {
        page: currentPage,
        page_size: parentsPerPage,
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

      const payload = await http.get("/api/admin/school/parents/", {
        auth: true,
        params: queryParams
      });

      const data = payload?.data ?? payload;
      console.log("Parents API response:", data);

      // Handle the documented { parents, pagination } response and legacy formats.
      if (Array.isArray(data.parents)) {
        setParents(data.parents);
        setTotalParents(data.pagination?.total ?? data.parents.length);
      } else if (data.results) {
        setParents(data.results || []);
        setTotalParents(data.pagination?.total ?? data.count ?? data.results.length);
      } else if (Array.isArray(data)) {
        // Direct array response
        setParents(data || []);
        setTotalParents(data?.length || 0);
      } else {
        // Fallback
        setParents([]);
        setTotalParents(0);
      }

      setError(null);
    } catch (err) {
      const appError = parseError(err, { action: "fetch_parents" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      // Mark endpoint as failed to prevent repeated calls
      circuitBreaker.markEndpointFailed(endpointName, userMessage);

      // Only show notification once when endpoint first fails
      notification.notify(`Parents data unavailable: ${userMessage}`, notificationType);

      // Set empty state on error - don't use fallback data
      console.warn("Failed to fetch parent data:", err);
      setParents([]);
      setTotalParents(0);
    }
  }, [currentPage, parentsPerPage, searchQuery, ordering, circuitBreaker, notification]);

  /**
   * Fetch individual parent details
   */
  const fetchParentDetails = useCallback(async (parentId) => {
    const endpointName = "parentDetails";

    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping parent details call - endpoint marked as failed");
      return null;
    }

    try {
      const payload = await http.get(`/api/admin/school/parents/${parentId}/`, {
        auth: true
      });

      const data = payload?.data ?? payload;
      console.log("Parent details API response:", data);

      return data;
    } catch (err) {
      const appError = parseError(err, { action: "fetch_parent_details" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      circuitBreaker.markEndpointFailed(endpointName, userMessage);
      notification.notify(`Parent details unavailable: ${userMessage}`, notificationType);

      console.warn("Failed to fetch parent details:", err);
      return null;
    }
  }, [circuitBreaker, notification]);

  /**
   * Create a parent with the documented ParentCreateUpdateRequest fields.
   */
  const createParent = useCallback(async (parentData) => {
    setMutating(true);
    try {
      const payload = await http.post("/api/admin/school/parents/", parentData, {
        auth: true
      });
      const data = payload?.data ?? payload;
      console.log("Create parent API response:", data);

      notification.notify("Parent added successfully", "success");
      await fetchParents();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "create_parent" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to add parent: ${userMessage}`, notificationType);
      console.warn("Failed to create parent:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchParents]);

  /**
   * Partially update an existing parent.
   */
  const updateParent = useCallback(async (parentId, parentData) => {
    setMutating(true);
    try {
      const payload = await http.patch(`/api/admin/school/parents/${parentId}/`, parentData, {
        auth: true
      });
      const data = payload?.data ?? payload;
      console.log("Update parent API response:", data);

      notification.notify("Parent updated successfully", "success");
      await fetchParents();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "update_parent" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to update parent: ${userMessage}`, notificationType);
      console.warn("Failed to update parent:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchParents]);

  /**
   * Delete a parent
   */
  const deleteParent = useCallback(async (parentId) => {
    setMutating(true);
    try {
      await http.del(`/api/admin/school/parents/${parentId}/`, {
        auth: true
      });

      notification.notify("Parent removed successfully", "success");
      await fetchParents();
    } catch (err) {
      const appError = parseError(err, { action: "delete_parent" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to remove parent: ${userMessage}`, notificationType);
      console.warn("Failed to delete parent:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchParents]);

  /**
   * Refresh parent data
   */
  const refreshData = useCallback(async (resetFailures = false) => {
    if (resetFailures) {
      circuitBreaker.resetAllEndpoints();
    }

    setLoading(true);
    setError(null);

    try {
      await fetchParents();
      setLastUpdated(new Date());
    } catch (err) {
      const appError = parseError(err, { action: "refresh_parent_data" });
      setError(appError);
      console.warn("Failed to refresh parent data:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchParents, circuitBreaker]);

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
   * Handle parent selection
   */
  const handleParentSelect = useCallback((parent) => {
    setSelectedParent(parent);
  }, []);

  /**
   * Clear parent selection
   */
  const clearParentSelection = useCallback(() => {
    setSelectedParent(null);
  }, []);

  // Initial data fetch
  useEffect(() => {
    refreshData();
  }, []); // Empty dependency array - only run once on mount

  // Refetch when filters change
  useEffect(() => {
    if (!loading) {
      fetchParents();
    }
  }, [currentPage, searchQuery, ordering]);

  /**
   * Computed values
   */
  const totalPages = useMemo(() => {
    return Math.ceil(totalParents / parentsPerPage);
  }, [totalParents, parentsPerPage]);

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
    parents,
    totalParents,
    selectedParent,
    mutating,

    // Pagination
    currentPage,
    totalPages,
    parentsPerPage,
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
    fetchParentDetails,
    createParent,
    updateParent,
    deleteParent,
    handleSearch,
    handleOrderingChange,
    handlePageChange,
    handleParentSelect,
    clearParentSelection,

    // Notifications
    notification
  };
}
