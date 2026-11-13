import { useCallback, useEffect, useRef, useState } from "react";
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

export default function useSuperAdminOrganizations() {
  const { notify, ...notification } = useNotification("info", 5000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [totalOrganizations, setTotalOrganizations] = useState(0);
  const [mutating, setMutating] = useState(false);
  const queryParams = useRef({});

  const fetchOrganizations = useCallback(async (params) => {
    const requestParams = params ?? queryParams.current;
    queryParams.current = requestParams;
    setLoading(true);
    setError(null);
    try {
      const payload = await http.get("/api/superadmin/organizations/", {
        auth: true,
        params: requestParams
      });
      const { items, total } = getSuperAdminCollection(
        unwrapSuperAdminResponse(payload),
        "organizations"
      );
      setOrganizations(items);
      setTotalOrganizations(total);
      setLastUpdated(new Date());
      return items;
    } catch (err) {
      const appError = parseError(err, { action: "fetch_super_admin_organizations" });
      setError(appError);
      setOrganizations([]);
      setTotalOrganizations(0);
      notify(
        `Organizations unavailable: ${getUserFriendlyMessage(appError)}`,
        getNotificationType(appError)
      );
      console.warn("Failed to fetch super-admin organizations:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [notify]);

  const fetchOrganizationDetails = useCallback(async (organizationId) => {
    try {
      const payload = await http.get(
        `/api/superadmin/organizations/${encodeURIComponent(organizationId)}/`,
        { auth: true }
      );
      return unwrapSuperAdminResponse(payload);
    } catch (err) {
      const appError = parseError(err, { action: "fetch_super_admin_organization_details" });
      notify(
        `Organization details unavailable: ${getUserFriendlyMessage(appError)}`,
        getNotificationType(appError)
      );
      console.warn("Failed to fetch super-admin organization details:", err);
      throw appError;
    }
  }, [notify]);

  const createOrganization = useCallback(async (organizationData) => {
    setMutating(true);
    try {
      const payload = await http.post("/api/superadmin/organizations/", organizationData, {
        auth: true
      });
      const data = unwrapSuperAdminResponse(payload);
      notify("Organization created successfully", "success");
      await fetchOrganizations();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "create_super_admin_organization" });
      notify(
        `Failed to create organization: ${getUserFriendlyMessage(appError)}`,
        getNotificationType(appError)
      );
      console.warn("Failed to create super-admin organization:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [fetchOrganizations, notify]);

  const updateOrganization = useCallback(async (organizationId, organizationData) => {
    setMutating(true);
    try {
      const payload = await http.patch(
        `/api/superadmin/organizations/${encodeURIComponent(organizationId)}/`,
        organizationData,
        { auth: true }
      );
      const data = unwrapSuperAdminResponse(payload);
      notify("Organization updated successfully", "success");
      await fetchOrganizations();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "update_super_admin_organization" });
      notify(
        `Failed to update organization: ${getUserFriendlyMessage(appError)}`,
        getNotificationType(appError)
      );
      console.warn("Failed to update super-admin organization:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [fetchOrganizations, notify]);

  const deactivateOrganization = useCallback(async (organizationId) => {
    setMutating(true);
    try {
      await http.del(
        `/api/superadmin/organizations/${encodeURIComponent(organizationId)}/`,
        { auth: true }
      );
      notify("Organization deactivated successfully", "success");
      await fetchOrganizations();
    } catch (err) {
      const appError = parseError(err, { action: "deactivate_super_admin_organization" });
      notify(
        `Failed to deactivate organization: ${getUserFriendlyMessage(appError)}`,
        getNotificationType(appError)
      );
      console.warn("Failed to deactivate super-admin organization:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [fetchOrganizations, notify]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return {
    loading,
    error,
    lastUpdated,
    organizations,
    totalOrganizations,
    mutating,
    fetchOrganizations,
    refreshData: fetchOrganizations,
    fetchOrganizationDetails,
    createOrganization,
    updateOrganization,
    deactivateOrganization,
    notification: { ...notification, notify }
  };
}
