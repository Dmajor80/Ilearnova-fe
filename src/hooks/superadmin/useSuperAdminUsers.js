import { useCallback, useEffect, useState } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import {
  getNotificationType,
  getUserFriendlyMessage,
  parseError
} from "@/lib/errorHandler";
import {
  getSuperAdminCollection,
  unwrapSuperAdminResponse
} from "./superAdminApiUtils";

export default function useSuperAdminUsers() {
  const { notify, ...notification } = useNotification("info", 5000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const payload = await http.get("/api/superadmin/users/", { auth: true, params });
      const { items, total } = getSuperAdminCollection(unwrapSuperAdminResponse(payload), "users");
      setUsers(items);
      setTotalUsers(total);
      setLastUpdated(new Date());
      return items;
    } catch (err) {
      const appError = parseError(err, { action: "fetch_super_admin_users" });
      setError(appError);
      setUsers([]);
      setTotalUsers(0);
      notify(`Users unavailable: ${getUserFriendlyMessage(appError)}`, getNotificationType(appError));
      console.warn("Failed to fetch super-admin users:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [notify]);

  const fetchUserDetails = useCallback(async (userId) => {
    try {
      const payload = await http.get(`/api/superadmin/users/${encodeURIComponent(userId)}/`, {
        auth: true
      });
      return unwrapSuperAdminResponse(payload);
    } catch (err) {
      const appError = parseError(err, { action: "fetch_super_admin_user_details" });
      notify(`User details unavailable: ${getUserFriendlyMessage(appError)}`, getNotificationType(appError));
      console.warn("Failed to fetch super-admin user details:", err);
      throw appError;
    }
  }, [notify]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    loading,
    error,
    lastUpdated,
    users,
    totalUsers,
    fetchUsers,
    refreshData: fetchUsers,
    fetchUserDetails,
    notification: { ...notification, notify }
  };
}
