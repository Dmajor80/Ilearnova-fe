import React, { useState } from "react";
import {
  Search,
  Phone,
  Mail,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  User,
  Users,
  ArrowLeft,
  RefreshCw,
  Loader2,
  AlertCircle,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { PaymentHistory } from "./PaymentHistory";
import useParentData from "@/hooks/useParentData";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import NotificationBar from "@/components/ui/NotificationBar";
import Avatar from "@/components/ui/Avatar";
import { formatRegistrationDate } from "@/lib/formatters";

// Parent Details Component
const ParentDetails = ({ parent, onBack, onToggleActive, onDelete, mutating }) => {
  const fullName =
    `${parent.first_name || ""} ${parent.last_name || ""}`.trim() ||
    parent.username;

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className=" ">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Main Content */}
        <div className="flex flex-col w-full">
          <div className="  flex-1 p-6 relative ">
            {/* Parent Profile Card */}
            <div className="bg-gradient-to-r bg-[#3d3690] rounded-xl p-6   overflow-hidden h-[200px]">
              <div className=""></div>
              <div className=""></div>

              <div className="absolute mt-[2rem]  flex flex-col items-center space-x-6">
                <div className="w-40 h-40 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <Avatar
                    src={parent.avatar || parent.profile_picture}
                    name={fullName}
                    size="w-36 h-36"
                    textSize="text-4xl"
                    className="border-4 border-white"
                  />
                </div>
                <div className="absolute flex justify-center right-[-35rem] z-0 mt-[0.6rem]">
                  <div
                    className="w-[250px] h-[150px] absolute mt-[2rem] z-[-10] ml-[-15rem] rounded-2xl"
                    style={{ background: "rgb(252, 196, 62" }}
                  ></div>
                  <div className="bg-[#FB7D5B] w-[250px] h-[150px] rounded-2xl  mb-[10.5]"></div>
                </div>
                <div className="mt-[1rem] z-40 ">
                  <h2 className="text-3xl font-bold mb-1 text-[#303972] font-poppins">
                    {fullName}
                  </h2>
                  <p className="text-[#4D44B5] mb-1 font-poppins text-[16px] font-semibold text-center">
                    Parent
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                        parent.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {parent.is_active ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {parent.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-8 bg-[white] grid grid-col-1 lg:grid-cols-2 gap-6 mb-2 pt-[8rem]  relative">
              {/* Username */}
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <User size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Username:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {parent.username}
                  </p>
                </div>
              </div>
              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <Mail size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Email:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {parent.email}
                  </p>
                </div>
              </div>
              {/* Date joined */}
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <Phone size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Member Since:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {formatRegistrationDate(parent)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-8 pb-6 flex gap-3">
              <button
                onClick={() => onToggleActive(parent)}
                disabled={mutating}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
                  parent.is_active
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {parent.is_active ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => onDelete(parent)}
                disabled={mutating}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove Parent
              </button>
            </div>
          </div>
          <div>
            <PaymentHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ParentListContent = () => {
  const {
    loading,
    error,
    parents,
    totalParents,
    selectedParent,
    mutating,
    currentPage,
    totalPages,
    parentsPerPage,
    hasNextPage,
    hasPreviousPage,
    searchQuery,
    ordering,
    refreshData,
    updateParent,
    deleteParent,
    handleSearch,
    handleOrderingChange,
    handlePageChange,
    handleParentSelect,
    clearParentSelection,
    notification
  } = useParentData();

  const [searchInput, setSearchInput] = useState("");

  const startIndex = (currentPage - 1) * parentsPerPage;
  const endIndex = Math.min(startIndex + parentsPerPage, totalParents);
  const currentParents = parents;

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    // Debounce search to avoid too many API calls
    setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleParentClick = (parent) => {
    handleParentSelect(parent);
  };

  const handleBackToList = () => {
    clearParentSelection();
  };

  const handleToggleActive = async (parent) => {
    try {
      await updateParent(parent.id, { is_active: !parent.is_active });
      clearParentSelection();
    } catch (err) {
      // Notification already surfaced by the hook
    }
  };

  const handleDeleteParent = async (parent) => {
    if (!window.confirm(`Remove ${parent.username} from parents? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteParent(parent.id);
      clearParentSelection();
    } catch (err) {
      // Notification already surfaced by the hook
    }
  };

  // Show parent details if a parent is selected
  if (selectedParent) {
    return (
      <ParentDetails
        parent={selectedParent}
        onBack={handleBackToList}
        onToggleActive={handleToggleActive}
        onDelete={handleDeleteParent}
        mutating={mutating}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen p-6">
        {/* Notification */}
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
                placeholder="Search parents..."
                value={searchInput}
                onChange={handleSearchInputChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <select
              value={ordering}
              onChange={(e) => handleOrderingChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="-date_joined">Newest</option>
              <option value="date_joined">Oldest</option>
              <option value="first_name">Name</option>
            </select>
            <button
              onClick={() => refreshData(true)}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

        </div>
        <div className="">
          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-t-lg">
            <table className="w-full">
              <thead className="">
                <tr className="bg-[#f3f1f8]">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                    Name
                  </th>
                  <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                    Username
                  </th>
                  <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                    Email
                  </th>
                  <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                    Joined
                  </th>
                  <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                    Status
                  </th>
                  <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[white] rounded-[5px]">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                        <span className="text-gray-500">Loading parents...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                        <span className="text-gray-500">Failed to load parents</span>
                        <button
                          onClick={() => refreshData(true)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : currentParents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <Users className="w-12 h-12 text-gray-400" />
                        {searchQuery ? (
                          <>
                            <span className="text-gray-600 font-medium">No parents match your search</span>
                            <div className="text-sm text-gray-500">Search: "{searchQuery}"</div>
                            <button
                              onClick={() => {
                                setSearchInput("");
                                handleSearch("");
                              }}
                              className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              Clear search
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-gray-600 font-medium">No parents registered yet</span>
                            <span className="text-sm text-gray-500">
                              Parents will appear here once they are registered in the system
                            </span>
                            <button
                              onClick={() => refreshData(true)}
                              className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              Refresh
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentParents.map((parent, index) => {
                    const fullName =
                      `${parent.first_name || ""} ${parent.last_name || ""}`.trim() ||
                      parent.username;
                    return (
                      <tr
                        key={parent.id || index}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleParentClick(parent)}
                      >
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar
                              src={parent.avatar || parent.profile_picture}
                              name={fullName}
                              size="w-8 h-8"
                              textSize="text-sm"
                            />
                            <span className="font-bold text-[#303972] text-[16px] font-poppins">
                              {fullName}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-[#4D44B5] font-bold text-[16px] font-poppins">
                          {parent.username}
                        </td>
                        <td className="p-4 text-[#A098AE] text-[16px] font-normal font-poppins">
                          {parent.email}
                        </td>
                        <td className="p-4 text-[#303972] text-[16px] font-normal font-poppins">
                          {formatRegistrationDate(parent)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              parent.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {parent.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 bg-[#EBEBF9] hover:text-blue-600 rounded-full" title="Email parent">
                              <Mail className="w-4 h-4 text-[#A098AE]" />
                            </button>
                            <button
                              onClick={() => handleParentClick(parent)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="View details"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalParents > 0 && (
            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-white rounded-b-lg">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {endIndex} of {totalParents} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPreviousPage || loading}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNextPage || loading}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};
