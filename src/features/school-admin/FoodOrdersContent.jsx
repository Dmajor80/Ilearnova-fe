import React, { useState } from "react";
import {
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import useFoodOrdersData from "@/hooks/useFoodOrdersData";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import NotificationBar from "@/components/ui/NotificationBar";

const STATUS_OPTIONS = ["pending", "preparing", "ready", "completed", "cancelled"];

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-indigo-100 text-indigo-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-600",
};

export const FoodOrdersContent = () => {
  const {
    loading,
    error,
    orders,
    totalOrders,
    mutating,
    currentPage,
    totalPages,
    ordersPerPage,
    searchQuery,
    refreshData,
    updateOrder,
    deleteOrder,
    handleSearch,
    handlePageChange,
    notification
  } = useFoodOrdersData();

  const [searchInput, setSearchInput] = useState("");

  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = Math.min(startIndex + ordersPerPage, totalOrders);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setTimeout(() => handleSearch(value), 300);
  };

  const handleStatusChange = async (order, status) => {
    try {
      await updateOrder(order.id, { status });
    } catch (err) {
      // Notification already surfaced by the hook
    }
  };

  const handleDelete = async (order) => {
    if (!window.confirm("Remove this order?")) return;
    try {
      await deleteOrder(order.id);
    } catch (err) {
      // Notification already surfaced by the hook
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen p-6">
        {notification.show && (
          <NotificationBar
            message={notification.message}
            type={notification.type}
            onClose={notification.hide}
          />
        )}

        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white mb-10 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchInput}
                onChange={handleSearchInputChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>
          <button
            onClick={() => refreshData(true)}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-t-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f3f1f8]">
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Order</th>
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Student</th>
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Items</th>
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Total</th>
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Status</th>
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      <span className="text-gray-500">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                      <span className="text-gray-500">Failed to load orders</span>
                      <button
                        onClick={() => refreshData(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <ShoppingBag className="w-12 h-12 text-gray-400" />
                      <span className="text-gray-600 font-medium">No food orders yet</span>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => {
                  const itemsLabel = Array.isArray(order.items)
                    ? order.items.map((i) => i.name || i).join(", ")
                    : order.items;
                  const status = (order.status || "pending").toLowerCase();
                  return (
                    <tr key={order.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-bold text-[#303972] text-[16px] font-poppins">
                        #{order.id ? String(order.id).slice(0, 8) : index + 1}
                      </td>
                      <td className="p-4 text-[#4D44B5] font-medium text-[15px] font-poppins">
                        {order.student_name || order.student || "—"}
                      </td>
                      <td className="p-4 text-[#A098AE] text-[15px] font-poppins">
                        {itemsLabel || "—"}
                      </td>
                      <td className="p-4 text-[#303972] font-semibold text-[16px] font-poppins">
                        {typeof order.total_amount === "number"
                          ? `$${order.total_amount.toFixed(2)}`
                          : order.total_amount}
                      </td>
                      <td className="p-4">
                        <select
                          value={status}
                          onChange={(e) => handleStatusChange(order, e.target.value)}
                          disabled={mutating}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${
                            STATUS_STYLES[status] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDelete(order)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {!loading && totalOrders > 0 && (
            <div className="flex justify-between items-center p-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {endIndex} of {totalOrders} entries
              </div>
              <div className="flex items-center space-x-2">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        currentPage === page ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default FoodOrdersContent;
