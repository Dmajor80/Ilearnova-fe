import { useState, useEffect, useCallback, useMemo } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";

/**
 * Hook that manages school calendar event fetching, caching, and state management.
 * Follows the same patterns as useStudentData / useParentData for consistency.
 *
 * The API uses EventCreateUpdate for writes and EventList for list responses.
 */
export default function useCalendarEvents() {
  const notification = useNotification("info", 5000);

  const circuitBreaker = useApiCircuitBreaker({
    maxRetries: 3,
    retryDelay: 60000,
    autoReset: false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [mutating, setMutating] = useState(false);

  const fetchEvents = useCallback(async (params = {}) => {
    const endpointName = "calendarEvents";

    if (!circuitBreaker.shouldCallEndpoint(endpointName)) {
      console.log("Skipping calendar events call - endpoint marked as failed");
      return;
    }

    try {
      const queryParams = {
        page: currentPage,
        page_size: eventsPerPage,
        search: searchQuery,
        ...params
      };

      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === "" || queryParams[key] === null || queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });

      const payload = await http.get("/api/admin/school/calendar/events/", {
        auth: true,
        params: queryParams
      });

      const data = payload?.data ?? payload;
      console.log("Calendar events API response:", data);

      if (data.results) {
        setEvents(data.results || []);
        setTotalEvents(data.pagination?.total ?? data.count ?? data.results.length);
      } else if (Array.isArray(data.events)) {
        setEvents(data.events || []);
        setTotalEvents(data.pagination?.total ?? data.events.length);
      } else if (Array.isArray(data)) {
        setEvents(data || []);
        setTotalEvents(data?.length || 0);
      } else {
        setEvents([]);
        setTotalEvents(0);
      }

      setError(null);
    } catch (err) {
      const appError = parseError(err, { action: "fetch_calendar_events" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      setError(appError);
      circuitBreaker.markEndpointFailed(endpointName, userMessage);
      notification.notify(`Calendar events unavailable: ${userMessage}`, notificationType);

      console.warn("Failed to fetch calendar events:", err);
      setEvents([]);
      setTotalEvents(0);
    }
  }, [currentPage, eventsPerPage, searchQuery, circuitBreaker, notification]);

  const createEvent = useCallback(async (eventData) => {
    setMutating(true);
    try {
      const payload = await http.post("/api/admin/school/calendar/events/", eventData, {
        auth: true
      });
      const data = payload?.data ?? payload;

      notification.notify("Event created successfully", "success");
      await fetchEvents();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "create_calendar_event" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to create event: ${userMessage}`, notificationType);
      console.warn("Failed to create calendar event:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchEvents]);

  const updateEvent = useCallback(async (eventId, eventData) => {
    setMutating(true);
    try {
      const payload = await http.patch(`/api/admin/school/calendar/events/${eventId}/`, eventData, {
        auth: true
      });
      const data = payload?.data ?? payload;

      notification.notify("Event updated successfully", "success");
      await fetchEvents();
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "update_calendar_event" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to update event: ${userMessage}`, notificationType);
      console.warn("Failed to update calendar event:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchEvents]);

  const deleteEvent = useCallback(async (eventId) => {
    setMutating(true);
    try {
      await http.del(`/api/admin/school/calendar/events/${eventId}/`, {
        auth: true
      });

      notification.notify("Event removed successfully", "success");
      await fetchEvents();
    } catch (err) {
      const appError = parseError(err, { action: "delete_calendar_event" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Failed to remove event: ${userMessage}`, notificationType);
      console.warn("Failed to delete calendar event:", err);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, fetchEvents]);

  const refreshData = useCallback(async (resetFailures = false) => {
    if (resetFailures) {
      circuitBreaker.resetAllEndpoints();
    }

    setLoading(true);
    setError(null);

    try {
      await fetchEvents();
      setLastUpdated(new Date());
    } catch (err) {
      const appError = parseError(err, { action: "refresh_calendar_events" });
      setError(appError);
      console.warn("Failed to refresh calendar events:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchEvents, circuitBreaker]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleEventSelect = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const clearEventSelection = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchEvents();
    }
  }, [currentPage, searchQuery]);

  /**
   * Group events by date (yyyy-mm-dd) for quick lookup from the calendar grid.
   * Reads several possible date field names defensively since the real
   * serializer shape isn't confirmed yet.
   */
  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((event) => {
      const raw = event.start_datetime || event.start_time || event.start_date || event.date || event.event_date;
      if (!raw) return;
      const key = String(raw).slice(0, 10); // yyyy-mm-dd
      if (!map[key]) map[key] = [];
      map[key].push(event);
    });
    return map;
  }, [events]);

  const totalPages = useMemo(() => {
    return Math.ceil(totalEvents / eventsPerPage);
  }, [totalEvents, eventsPerPage]);

  return {
    loading,
    error,
    lastUpdated,
    events,
    eventsByDate,
    totalEvents,
    selectedEvent,
    mutating,

    currentPage,
    totalPages,
    eventsPerPage,
    searchQuery,

    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,

    refreshData,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    createEvent,
    updateEvent,
    deleteEvent,
    handleSearch,
    handlePageChange,
    handleEventSelect,
    clearEventSelection,

    notification
  };
}
