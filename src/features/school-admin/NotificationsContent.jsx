import React, { useState } from "react";
import {
  Search,
  Megaphone,
  X,
  RefreshCw,
  Loader2,
  AlertCircle,
  Bell,
  Trash2,
  CheckSquare,
} from "lucide-react";
import useNotificationsData from "@/hooks/useNotificationsData";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import NotificationBar from "@/components/ui/NotificationBar";

const RECIPIENT_OPTIONS = [
  { value: "all", label: "Everyone" },
  { value: "students", label: "Students" },
  { value: "teachers", label: "Teachers" },
  { value: "parents", label: "Parents" },
  { value: "specific", label: "Specific user (by ID)" },
];

export const NotificationsContent = () => {
  const {
    loading,
    error,
    notifications,
    totalNotifications,
    selectedIds,
    mutating,
    currentPage,
    totalPages,
    notificationsPerPage,
    searchQuery,
    refreshData,
    deleteNotification,
    createNotification,
    broadcastNotification,
    bulkOperation,
    handleSearch,
    handlePageChange,
    toggleSelectId,
    clearSelectedIds,
    notification
  } = useNotificationsData();

  const [searchInput, setSearchInput] = useState("");
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    recipient_type: "all",
    recipient_id: "",
  });

  const startIndex = (currentPage - 1) * notificationsPerPage;
  const endIndex = Math.min(startIndex + notificationsPerPage, totalNotifications);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setTimeout(() => handleSearch(value), 300);
  };

  const handleBroadcastInputChange = (e) => {
    setBroadcastForm({ ...broadcastForm, [e.target.name]: e.target.value });
  };

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    try {
      if (broadcastForm.recipient_type === "specific") {
        await createNotification({
          title: broadcastForm.title,
          message: broadcastForm.message,
          recipient_id: broadcastForm.recipient_id,
        });
      } else {
        await broadcastNotification({
          title: broadcastForm.title,
          message: broadcastForm.message,
          recipient_type: broadcastForm.recipient_type,
        });
      }
      setShowBroadcastModal(false);
      setBroadcastForm({ title: "", message: "", recipient_type: "all", recipient_id: "" });
    } catch (err) {
      // Notification already surfaced by the hook; keep modal open.
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Remove this notification?")) return;
    try {
      await deleteNotification(item.id);
    } catch (err) {
      // Notification already surfaced by the hook
    }
  };

  const handleBulkMarkRead = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkOperation("mark_read", selectedIds);
    } catch (err) {
      // Notification already surfaced by the hook
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Remove ${selectedIds.length} selected notifications?`)) return;
    try {
      await bulkOperation("delete", selectedIds);
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
                placeholder="Search notifications..."
                value={searchInput}
                onChange={handleSearchInputChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
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
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="bg-[#4D44B5] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            <Megaphone className="w-4 h-4 font-semibold" />
            <span className="text-[13px] font-semibold">Broadcast</span>
          </button>
        </div>

        {/* Bulk actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 mb-4">
            <span className="text-sm text-[#4D44B5] font-medium">
              {selectedIds.length} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkMarkRead}
                disabled={mutating}
                className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"
              >
                <CheckSquare className="w-4 h-4" /> Mark read
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={mutating}
                className="px-3 py-1.5 text-sm bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button
                onClick={clearSelectedIds}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto bg-white rounded-t-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f3f1f8]">
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider w-10"></th>
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Title</th>
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Audience</th>
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Sent</th>
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
                      <span className="text-gray-500">Loading notifications...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                      <span className="text-gray-500">Failed to load notifications</span>
                      <button
                        onClick={() => refreshData(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <Bell className="w-12 h-12 text-gray-400" />
                      <span className="text-gray-600 font-medium">No notifications yet</span>
                    </div>
                  </td>
                </tr>
              ) : (
                notifications.map((item, index) => (
                  <tr key={item.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelectId(item.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#303972] text-[16px] font-poppins">{item.title}</div>
                      {item.message && (
                        <div className="text-[#A098AE] text-sm font-poppins">{item.message}</div>
                      )}
                    </td>
                    <td className="p-4 text-[#4D44B5] font-medium text-[15px] font-poppins capitalize">
                      {item.recipient_type || "—"}
                    </td>
                    <td className="p-4 text-[#A098AE] text-sm font-poppins">
                      {item.created_at ? new Date(item.created_at).toLocaleString() : "—"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.is_read ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.is_read ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!loading && totalNotifications > 0 && (
            <div className="flex justify-between items-center p-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {endIndex} of {totalNotifications} entries
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

        {/* Broadcast Modal */}
        {showBroadcastModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Broadcast Notification</h2>
                <button
                  onClick={() => setShowBroadcastModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleBroadcastSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={broadcastForm.title}
                    onChange={handleBroadcastInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={broadcastForm.message}
                    onChange={handleBroadcastInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Send to</label>
                  <select
                    name="recipient_type"
                    value={broadcastForm.recipient_type}
                    onChange={handleBroadcastInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {RECIPIENT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {broadcastForm.recipient_type === "specific" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient User ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="recipient_id"
                      value={broadcastForm.recipient_id}
                      onChange={handleBroadcastInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="UUID of the parent/teacher/student"
                      required
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowBroadcastModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={mutating}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {mutating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Send Broadcast
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default NotificationsContent;
