import { useCallback, useEffect, useRef, useState } from "react";
import {
  createStudentSubmission,
  getStudentAssignments,
  getStudentSubmissions
} from "@/api/student";
import useApiCircuitBreaker from "@/hooks/useApiCircuitBreaker";
import useNotification from "@/hooks/useNotification";
import {
  getNotificationType,
  getUserFriendlyMessage,
  parseError
} from "@/lib/errorHandler";
import {
  getStudentListAcrossPages,
  unwrapStudentResponse
} from "./studentApiUtils";

const getSubmissionAssignmentId = (submission) => {
  const assignment = submission?.assignment;
  return typeof assignment === "string" ? assignment : assignment?.id;
};

export default function useStudentAssignments() {
  const notification = useNotification("info", 5000);
  const circuitBreaker = useApiCircuitBreaker({
    maxRetries: 3,
    retryDelay: 60000,
    autoReset: false
  });
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mutating, setMutating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { resetAllEndpoints, shouldCallEndpoint, markEndpointFailed } = circuitBreaker;

  const refreshData = useCallback(async (resetFailures = false) => {
    if (resetFailures) resetAllEndpoints();
    setLoading(true);
    setError(null);

    const requests = [
      {
        endpoint: "studentAssignments",
        load: () => getStudentListAcrossPages((page) => getStudentAssignments({ page })),
        update: setAssignments
      },
      {
        endpoint: "studentSubmissions",
        load: () => getStudentListAcrossPages((page) => getStudentSubmissions({ page })),
        update: setSubmissions
      }
    ].filter(({ endpoint }) => resetFailures || shouldCallEndpoint(endpoint));

    try {
      const results = await Promise.allSettled(requests.map(({ load }) => load()));
      const failures = [];

      results.forEach((result, index) => {
        const { endpoint, update } = requests[index];
        if (result.status === "fulfilled") {
          update(result.value);
          return;
        }

        const appError = parseError(result.reason, {
          action: `fetch_${endpoint}`
        });
        const message = getUserFriendlyMessage(appError);
        markEndpointFailed(endpoint, message);
        failures.push(message);
        console.warn(`Failed to fetch ${endpoint}:`, result.reason);
      });

      if (failures.length) {
        const appError = parseError(new Error(failures.join("; ")), {
          action: "fetch_student_assignments"
        });
        setError(appError);
        notification.notify(
          `Some assignment data is unavailable: ${failures.join("; ")}`,
          getNotificationType(appError)
        );
      }

      if (results.some((result) => result.status === "fulfilled")) {
        setLastUpdated(new Date());
      }
    } finally {
      setLoading(false);
    }
  }, [markEndpointFailed, notification, resetAllEndpoints, shouldCallEndpoint]);

  const submitAssignment = useCallback(async (assignmentId, content, file) => {
    if (!assignmentId || typeof content !== "string" || !content.trim() ||
      typeof Blob === "undefined" || !(file instanceof Blob)) {
      const validationError = new Error(
        "An assignment, response, and attached file are required to submit this assignment."
      );
      notification.notify(validationError.message, "error");
      throw validationError;
    }

    setMutating(true);
    try {
      const formData = new FormData();
      formData.append("assignment", assignmentId);
      formData.append("content", content);
      formData.append("submitted_file", file);
      const response = await createStudentSubmission(formData);
      notification.notify("Assignment submitted successfully", "success");
      await refreshData(true);
      return unwrapStudentResponse(response);
    } catch (requestError) {
      const appError = parseError(requestError, { action: "submit_student_assignment" });
      notification.notify(
        `Failed to submit assignment: ${getUserFriendlyMessage(appError)}`,
        getNotificationType(appError)
      );
      console.warn("Failed to submit student assignment:", requestError);
      throw appError;
    } finally {
      setMutating(false);
    }
  }, [notification, refreshData]);

  const refreshDataRef = useRef(refreshData);
  refreshDataRef.current = refreshData;

  useEffect(() => {
    refreshDataRef.current();
  }, []);

  const submittedAssignmentIds = new Set(
    submissions.map(getSubmissionAssignmentId).filter(Boolean)
  );
  const pendingAssignments = assignments.filter(
    (assignment) => !submittedAssignmentIds.has(assignment.id)
  );

  return {
    assignments,
    submissions,
    pendingAssignments,
    loading,
    error,
    mutating,
    lastUpdated,
    refreshData,
    submitAssignment,
    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,
    endpointRetries: circuitBreaker.endpointRetries,
    notification
  };
}
