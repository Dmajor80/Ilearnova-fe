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

export default function useSuperAdminEmails() {
  const { notify, ...notification } = useNotification("info", 5000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [emails, setEmails] = useState([]);
  const [totalEmails, setTotalEmails] = useState(0);
  const [mutating, setMutating] = useState(false);
  const queryParams = useRef({});

  const fetchEmails = useCallback(async (params) => {
    const requestParams = params ?? queryParams.current;
    queryParams.current = requestParams;
    setLoading(true);
    setError(null);
    try {
      const payload = await http.get("/api/superadmin/emails/", {
        auth: true,
        params: requestParams
      });
      const { items, total } = getSuperAdminCollection(unwrapSuperAdminResponse(payload), "emails");
      setEmails(items);
      setTotalEmails(total);
      setLastUpdated(new Date());
      return items;
    } catch (err) {
      const appError = parseError(err, { action: "fetch_super_admin_emails" });
      setError(appError);
      setEmails([]);
      setTotalEmails(0);
      notify(`Email logs unavailable: ${getUserFriendlyMessage(appError)}`, getNotificationType(appError));
      console.warn("Failed to fetch super-admin email logs:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [notify]);

  const fetchEmailDetails = useCallback(async (emailId) => {
    try {
      const payload = await http.get(`/api/superadmin/emails/${encodeURIComponent(emailId)}/`, {
        auth: true
      });
      return unwrapSuperAdminResponse(payload);
    } catch (err) {
      const appError = parseError(err, { action: "fetch_super_admin_email_details" });
      notify(`Email details unavailable: ${getUserFriendlyMessage(appError)}`, getNotificationType(appError));
      console.warn("Failed to fetch super-admin email details:", err);
      throw appError;
    }
  }, [notify]);

  const resendEmail = useCallback(async (emailId) => {
    setMutating(true);
    try {
      const payload = await http.post(
        `/api/superadmin/emails/${encodeURIComponent(emailId)}/resend/`,
        { auth: true }
      );
      const data = unwrapSuperAdminResponse(payload);
      notify("Email resend queued successfully", "success");
      await fetchEmails();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "resend_super_admin_email" });
      notify(`Failed to resend email: ${getUserFriendlyMessage(appError)}`, getNotificationType(appError));
      console.warn("Failed to resend super-admin email:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [fetchEmails, notify]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  return {
    loading,
    error,
    lastUpdated,
    emails,
    totalEmails,
    mutating,
    fetchEmails,
    refreshData: fetchEmails,
    fetchEmailDetails,
    resendEmail,
    notification: { ...notification, notify }
  };
}
