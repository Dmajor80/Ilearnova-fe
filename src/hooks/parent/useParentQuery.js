import { useCallback, useEffect, useState } from "react";
import useNotification from "@/hooks/useNotification";
import {
  getNotificationType,
  getUserFriendlyMessage,
  parseError
} from "@/lib/errorHandler";
import { unwrapParentResponse } from "./parentApiUtils";

export default function useParentQuery({
  action,
  enabled = true,
  initialData = null,
  label,
  query,
  select = unwrapParentResponse
}) {
  const notification = useNotification("info", 5000);
  const { notify } = notification;
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const refreshData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);
    try {
      const response = await query();
      setData(select(response));
      setLastUpdated(new Date());
    } catch (requestError) {
      const appError = parseError(requestError, { action });
      const message = getUserFriendlyMessage(appError);
      setError(appError);
      notify(`${label} unavailable: ${message}`, getNotificationType(appError));
      console.warn(`Failed to ${action}:`, requestError);
    } finally {
      setLoading(false);
    }
  }, [action, enabled, label, notify, query, select]);

  useEffect(() => {
    if (enabled) refreshData();
  }, [enabled, refreshData]);

  return { data, loading, error, lastUpdated, refreshData, notification };
}
