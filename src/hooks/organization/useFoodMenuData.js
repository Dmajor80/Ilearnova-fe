import { useState, useEffect, useCallback, useMemo } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";

/**
 * Hook that manages food menu item fetching, caching, and state management.
 * Follows the same patterns as useStudentData / useParentData for consistency.
 *
 * The API documents MenuItem fields and returns menu_items with pagination.
 */
export default function useFoodMenuData() {
  const notification = useNotification("info", 5000);

  const circuitBreaker = useApiCircuitBreaker({
    maxRetries: 3,
    retryDelay: 60000,
    autoReset: false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [menuItems, setMenuItems] = useState([]);
  const [totalMenuItems, setTotalMenuItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const [mutating, setMutating] = useState(false);

  const fetchMenuItems = useCallback(async (params = {}) => {
    const endpointName = "foodMenu";

    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping food menu call - endpoint marked as failed");
      return;
    }

    try {
      const queryParams = {
        page: currentPage,
        page_size: itemsPerPage,
        search: searchQuery,
        ...params
      };

      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === "" || queryParams[key] === null || queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });

      const payload = await http.get("/api/admin/school/food/menu/", {
        auth: true,
        params: queryParams
      });

      const data = payload?.data ?? payload;
      console.log("Food menu API response:", data);

      if (data.results) {
        setMenuItems(data.results || []);
        setTotalMenuItems(data.pagination?.total ?? data.count ?? data.results.length);
      } else if (Array.isArray(data.menu_items)) {
        setMenuItems(data.menu_items || []);
        setTotalMenuItems(data.pagination?.total ?? data.menu_items.length);
      } else if (Array.isArray(data)) {
        setMenuItems(data || []);
        setTotalMenuItems(data?.length || 0);
      } else {
        setMenuItems([]);
        setTotalMenuItems(0);
      }

      setError(null);
    } catch (err) {
      const appError = parseError(err, { action: "fetch_food_menu" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      circuitBreaker.markEndpointFailed(endpointName, userMessage);
      notification.notify(`Menu unavailable: ${userMessage}`, notificationType);

      console.warn("Failed to fetch food menu:", err);
      setMenuItems([]);
      setTotalMenuItems(0);
    }
  }, [currentPage, itemsPerPage, searchQuery, circuitBreaker, notification]);

  const createMenuItem = useCallback(async (itemData) => {
    setMutating(true);
    try {
      const payload = await http.post("/api/admin/school/food/menu/", itemData, { auth: true });
      const data = payload?.data ?? payload;

      notification.notify("Menu item added successfully", "success");
      await fetchMenuItems();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "create_menu_item" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to add menu item: ${userMessage}`, notificationType);
      console.warn("Failed to create menu item:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchMenuItems]);

  const updateMenuItem = useCallback(async (itemId, itemData) => {
    setMutating(true);
    try {
      const payload = await http.patch(`/api/admin/school/food/menu/${itemId}/`, itemData, { auth: true });
      const data = payload?.data ?? payload;

      notification.notify("Menu item updated successfully", "success");
      await fetchMenuItems();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "update_menu_item" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to update menu item: ${userMessage}`, notificationType);
      console.warn("Failed to update menu item:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchMenuItems]);

  const deleteMenuItem = useCallback(async (itemId) => {
    setMutating(true);
    try {
      await http.del(`/api/admin/school/food/menu/${itemId}/`, { auth: true });

      notification.notify("Menu item removed successfully", "success");
      await fetchMenuItems();
    } catch (err) {
      const appError = parseError(err, { action: "delete_menu_item" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to remove menu item: ${userMessage}`, notificationType);
      console.warn("Failed to delete menu item:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchMenuItems]);

  const refreshData = useCallback(async (resetFailures = false) => {
    if (resetFailures) {
      circuitBreaker.resetAllEndpoints();
    }

    setLoading(true);
    setError(null);

    try {
      await fetchMenuItems();
      setLastUpdated(new Date());
    } catch (err) {
      const appError = parseError(err, { action: "refresh_food_menu" });
      setError(appError);
      console.warn("Failed to refresh food menu:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchMenuItems, circuitBreaker]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleItemSelect = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  const clearItemSelection = useCallback(() => {
    setSelectedItem(null);
  }, []);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchMenuItems();
    }
  }, [currentPage, searchQuery]);

  const totalPages = useMemo(() => {
    return Math.ceil(totalMenuItems / itemsPerPage);
  }, [totalMenuItems, itemsPerPage]);

  return {
    loading,
    error,
    lastUpdated,
    menuItems,
    totalMenuItems,
    selectedItem,
    mutating,

    currentPage,
    totalPages,
    itemsPerPage,
    searchQuery,

    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,

    refreshData,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    handleSearch,
    handlePageChange,
    handleItemSelect,
    clearItemSelection,

    notification
  };
}
