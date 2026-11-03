import { useCallback, useRef, useState } from "react";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";
import useNotification from "@/hooks/useNotification";
import {
  getNotificationType,
  getUserFriendlyMessage,
  parseError
} from "@/lib/errorHandler";

export const unwrapTeacherResponse = (response) => response?.data ?? response;

export const getTeacherList = (response, keys = []) => {
  const data = unwrapTeacherResponse(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (data && typeof data === "object" && data.id) return [data];

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  return [];
};

export default function useTeacherApi() {
  const notification = useNotification("info", 5000);
  const circuitBreaker = useApiCircuitBreaker({
    maxRetries: 3,
    retryDelay: 60000,
    autoReset: false
  });
  const { markEndpointFailed, shouldCallEndpoint } = circuitBreaker;
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const activeRequests = useRef(0);
  const activeMutations = useRef(0);

  const request = useCallback(async (
    endpoint,
    action,
    operation,
    { mutation = false, successMessage, failureMessage = "Request failed" } = {}
  ) => {
    if (!shouldCallEndpoint(endpoint)) return null;

    const counter = mutation ? activeMutations : activeRequests;
    const setActive = mutation ? setMutating : setLoading;
    counter.current += 1;
    setActive(true);
    setError(null);

    try {
      const data = unwrapTeacherResponse(await operation());
      setLastUpdated(new Date());
      if (successMessage) notification.notify(successMessage, "success");
      return data;
    } catch (requestError) {
      const appError = parseError(requestError, { action });
      const message = getUserFriendlyMessage(appError);
      markEndpointFailed(endpoint, message);
      setError(appError);
      notification.notify(`${failureMessage}: ${message}`, getNotificationType(appError));
      console.warn(`Teacher API request failed (${endpoint}):`, requestError);
      throw appError;
    } finally {
      counter.current -= 1;
      setActive(counter.current > 0);
    }
  }, [markEndpointFailed, notification, shouldCallEndpoint]);

  return {
    request,
    loading,
    mutating,
    error,
    setError,
    lastUpdated,
    notification,
    circuitBreaker
  };
}
