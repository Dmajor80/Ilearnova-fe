import React, { useState } from "react";
import {
  Search,
  Plus,
  X,
  RefreshCw,
  Loader2,
  AlertCircle,
  UtensilsCrossed,
  Pencil,
  Trash2,
} from "lucide-react";
import useFoodMenuData from "@/hooks/useFoodMenuData";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import NotificationBar from "@/components/ui/NotificationBar";

export const FoodMenuContent = () => {
  const {
    loading,
    error,
    menuItems,
    totalMenuItems,
    mutating,
    currentPage,
    totalPages,
    itemsPerPage,
    searchQuery,
    refreshData,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    handleSearch,
    handlePageChange,
    notification
  } = useFoodMenuData();

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    is_available: true,
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalMenuItems);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setTimeout(() => handleSearch(value), 300);
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", category: "", is_available: true });
    setEditingItem(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      description: item.description || "",
      price: item.price ?? "",
      category: item.category || "",
      is_available: item.is_available ?? true,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, formData);
      } else {
        await createMenuItem(formData);
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      // Notification already surfaced by the hook; keep modal open.
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Remove "${item.name}" from the menu?`)) return;
    try {
      await deleteMenuItem(item.id);
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
                placeholder="Search menu items..."
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
            onClick={openCreateModal}
            className="bg-[#4D44B5] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            <Plus className="w-4 h-4 font-semibold" />
            <span className="text-[13px] font-semibold">New Menu Item</span>
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-t-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f3f1f8]">
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Item</th>
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Category</th>
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Price</th>
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Status</th>
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      <span className="text-gray-500">Loading menu...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                      <span className="text-gray-500">Failed to load the menu</span>
                      <button
                        onClick={() => refreshData(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : menuItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <UtensilsCrossed className="w-12 h-12 text-gray-400" />
                      <span className="text-gray-600 font-medium">No menu items yet</span>
                      <span className="text-sm text-gray-500">Add your first item to get started.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                menuItems.map((item, index) => (
                  <tr key={item.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-bold text-[#303972] text-[16px] font-poppins">{item.name}</div>
                      {item.description && (
                        <div className="text-[#A098AE] text-sm font-poppins">{item.description}</div>
                      )}
                    </td>
                    <td className="p-4 text-[#4D44B5] font-medium text-[15px] font-poppins">
                      {item.category || "—"}
                    </td>
                    <td className="p-4 text-[#303972] font-semibold text-[16px] font-poppins">
                      {typeof item.price === "number" ? `$${item.price.toFixed(2)}` : item.price}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.is_available
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.is_available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!loading && totalMenuItems > 0 && (
            <div className="flex justify-between items-center p-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {endIndex} of {totalMenuItems} entries
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

        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h- overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingItem? "Edit Menu Item" : "New Menu Item"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g. 4.50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g. Lunch"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_available"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <label htmlFor="is_available" className="text-sm font-medium text-gray-700">
                  Available today
                </label>
              </div>
                
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
                  {editingItem? "Save Changes" : "Add Item"}
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

export default FoodMenuContent;
