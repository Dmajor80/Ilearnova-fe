import { useCallback, useEffect, useRef, useState } from "react";
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
  const initialDataRef = useRef(initialData);
  initialDataRef.current = initialData;
  const requestId = useRef(0);
  const [queryState, setQueryState] = useState(() => ({
    query,
    data: initialData,
    error: null,
    loading: enabled,
    lastUpdated: null
  }));

  const refreshData = useCallback(async () => {
    if (!enabled) return;

    const currentRequestId = ++requestId.current;
    setQueryState((current) => ({
      query,
      data: current.query === query ? current.data : initialDataRef.current,
      error: null,
      loading: true,
      lastUpdated: current.query === query ? current.lastUpdated : null
    }));

    try {
      const response = await query();
      if (currentRequestId !== requestId.current) return;
      setQueryState({
        query,
        data: select(response),
        error: null,
        loading: false,
        lastUpdated: new Date()
      });
    } catch (requestError) {
      if (currentRequestId !== requestId.current) return;
      const appError = parseError(requestError, { action });
      const message = getUserFriendlyMessage(appError);
      setQueryState((current) => ({
        query,
        data: current.query === query ? current.data : initialDataRef.current,
        error: appError,
        loading: false,
        lastUpdated: current.query === query ? current.lastUpdated : null
      }));
      notify(`${label} unavailable: ${message}`, getNotificationType(appError));
      console.warn(`Failed to ${action}:`, requestError);
    }
  }, [action, enabled, label, notify, query, select]);

  useEffect(() => {
    if (!enabled) {
      requestId.current += 1;
      setQueryState({
        query,
        data: initialDataRef.current,
        error: null,
        loading: false,
        lastUpdated: null
      });
    } else {
      refreshData();
    }

    return () => {
      requestId.current += 1;
    };
  }, [enabled, query, refreshData]);

  const stateMatchesQuery = queryState.query === query;
  const data = enabled && stateMatchesQuery ? queryState.data : initialDataRef.current;
  const loading = enabled && (!stateMatchesQuery || queryState.loading);
  const error = enabled && stateMatchesQuery ? queryState.error : null;
  const lastUpdated = enabled && stateMatchesQuery ? queryState.lastUpdated : null;

  return { data, loading, error, lastUpdated, refreshData, notification };
}
