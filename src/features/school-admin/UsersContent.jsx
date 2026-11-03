import React, { useState, useMemo } from "react";
import { Search, RefreshCw, Loader2, AlertCircle, Users as UsersIcon } from "lucide-react";
import useAdminUsersData from "@/hooks/useAdminUsersData";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import NotificationBar from "@/components/ui/NotificationBar";
import Avatar from "@/components/ui/Avatar";

const ROLE_STYLES = {
  admin: "bg-purple-100 text-purple-800",
  teacher: "bg-blue-100 text-blue-800",
  parent: "bg-orange-100 text-orange-800",
  student: "bg-green-100 text-green-800",
};

export const UsersContent = () => {
  // NOTE: /api/admin/users/ has no documented query params (search, ordering,
  // etc. aren't in the spec), so filtering here is done client-side over
  // whatever page of data the endpoint returns.
  const { loading, error, users, refreshData, notification } = useAdminUsersData();
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const roles = useMemo(() => {
    const set = new Set(users.map((u) => u.role).filter(Boolean));
    return Array.from(set);
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const name = `${u.first_name || ""} ${u.last_name || ""} ${u.username || ""} ${u.email || ""}`.toLowerCase();
      const matchesSearch = !searchInput || name.includes(searchInput.toLowerCase());
      const matchesRole = !roleFilter || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchInput, roleFilter]);

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

        <div className="flex justify-between items-center p-6 bg-white mb-10 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            {roles.length > 0 && (
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            )}
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

        <div className="overflow-x-auto bg-white rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f3f1f8]">
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Name</th>
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Username</th>
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Email</th>
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Role</th>
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      <span className="text-gray-500">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                      <span className="text-gray-500">Failed to load users</span>
                      <button
                        onClick={() => refreshData(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <UsersIcon className="w-12 h-12 text-gray-400" />
                      <span className="text-gray-600 font-medium">No users found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => {
                  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username;
                  return (
                    <tr key={user.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar name={fullName} size="w-8 h-8" textSize="text-sm" />
                          <span className="font-bold text-[#303972] text-[16px] font-poppins">{fullName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[#4D44B5] font-medium text-[15px] font-poppins">{user.username}</td>
                      <td className="p-4 text-[#A098AE] text-[15px] font-poppins">{user.email}</td>
                      <td className="p-4">
                        {user.role ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${ROLE_STYLES[user.role] || "bg-gray-100 text-gray-600"}`}>
                            {user.role}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default UsersContent;
