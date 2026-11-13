import { useState, useEffect, useCallback, useMemo } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";

/**
 * Hook that manages food order fetching, caching, and state management.
 * Follows the same patterns as useStudentData / useParentData for consistency.
 *
 * The API documents FoodOrder fields and returns orders with pagination.
 */
export default function useFoodOrdersData() {
  const notification = useNotification("info", 5000);

  const circuitBreaker = useApiCircuitBreaker({
    maxRetries: 3,
    retryDelay: 60000,
    autoReset: false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [mutating, setMutating] = useState(false);

  const fetchOrders = useCallback(async (params = {}) => {
    const endpointName = "foodOrders";

    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping food orders call - endpoint marked as failed");
      return;
    }

    try {
      const queryParams = {
        page: currentPage,
        page_size: ordersPerPage,
        search: searchQuery,
        ...params
      };

      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === "" || queryParams[key] === null || queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });

      const payload = await http.get("/api/admin/school/food/orders/", {
        auth: true,
        params: queryParams
      });

      const data = payload?.data ?? payload;
      console.log("Food orders API response:", data);

      if (data.results) {
        setOrders(data.results || []);
        setTotalOrders(data.pagination?.total ?? data.count ?? data.results.length);
      } else if (Array.isArray(data.orders)) {
        setOrders(data.orders || []);
        setTotalOrders(data.pagination?.total ?? data.orders.length);
      } else if (Array.isArray(data)) {
        setOrders(data || []);
        setTotalOrders(data?.length || 0);
      } else {
        setOrders([]);
        setTotalOrders(0);
      }

      setError(null);
    } catch (err) {
      const appError = parseError(err, { action: "fetch_food_orders" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      circuitBreaker.markEndpointFailed(endpointName, userMessage);
      notification.notify(`Orders unavailable: ${userMessage}`, notificationType);

      console.warn("Failed to fetch food orders:", err);
      setOrders([]);
      setTotalOrders(0);
    }
  }, [currentPage, ordersPerPage, searchQuery, circuitBreaker, notification]);

  const createOrder = useCallback(async (orderData) => {
    setMutating(true);
    try {
      const payload = await http.post("/api/admin/school/food/orders/", orderData, { auth: true });
      const data = payload?.data ?? payload;

      notification.notify("Order created successfully", "success");
      await fetchOrders();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "create_food_order" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to create order: ${userMessage}`, notificationType);
      console.warn("Failed to create food order:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchOrders]);

  /**
   * Update an order - most commonly used to change its status
   * (e.g. { status: "preparing" | "ready" | "delivered" | "cancelled" }).
   */
  const updateOrder = useCallback(async (orderId, orderData) => {
    setMutating(true);
    try {
      const payload = await http.patch(`/api/admin/school/food/orders/${orderId}/`, orderData, { auth: true });
      const data = payload?.data ?? payload;

      notification.notify("Order updated successfully", "success");
      await fetchOrders();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "update_food_order" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to update order: ${userMessage}`, notificationType);
      console.warn("Failed to update food order:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchOrders]);

  const deleteOrder = useCallback(async (orderId) => {
    setMutating(true);
    try {
      await http.del(`/api/admin/school/food/orders/${orderId}/`, { auth: true });

      notification.notify("Order removed successfully", "success");
      await fetchOrders();
    } catch (err) {
      const appError = parseError(err, { action: "delete_food_order" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to remove order: ${userMessage}`, notificationType);
      console.warn("Failed to delete food order:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchOrders]);

  const refreshData = useCallback(async (resetFailures = false) => {
    if (resetFailures) {
      circuitBreaker.resetAllEndpoints();
    }

    setLoading(true);
    setError(null);

    try {
      await fetchOrders();
      setLastUpdated(new Date());
    } catch (err) {
      const appError = parseError(err, { action: "refresh_food_orders" });
      setError(appError);
      console.warn("Failed to refresh food orders:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchOrders, circuitBreaker]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleOrderSelect = useCallback((order) => {
    setSelectedOrder(order);
  }, []);

  const clearOrderSelection = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchOrders();
    }
  }, [currentPage, searchQuery]);

  const totalPages = useMemo(() => {
    return Math.ceil(totalOrders / ordersPerPage);
  }, [totalOrders, ordersPerPage]);

  return {
    loading,
    error,
    lastUpdated,
    orders,
    totalOrders,
    selectedOrder,
    mutating,

    currentPage,
    totalPages,
    ordersPerPage,
    searchQuery,

    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,

    refreshData,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    createOrder,
    updateOrder,
    deleteOrder,
    handleSearch,
    handlePageChange,
    handleOrderSelect,
    clearOrderSelection,

    notification
  };
}
