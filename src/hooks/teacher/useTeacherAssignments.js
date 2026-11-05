import { useCallback, useEffect, useRef, useState } from "react";
import {
  createTeacherAssignment,
  deleteTeacherAssignment,
  getTeacherAssignment,
  getTeacherAssignmentSubmissions,
  getTeacherAssignments,
  patchTeacherAssignment,
  updateTeacherAssignment
} from "@/api/teacher";
import useTeacherApi, { getTeacherList } from "./teacherApiUtils";

export default function useTeacherAssignments() {
  const { request, circuitBreaker, loading, mutating, error, lastUpdated, notification } = useTeacherApi();
  const { resetAllEndpoints } = circuitBreaker;
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const refreshData = useCallback(async (params = {}, resetFailures = false) => {
    if (resetFailures) resetAllEndpoints();
    try {
      const result = await request(
        "teacherAssignments",
        "fetch_teacher_assignments",
        () => getTeacherAssignments(params),
        { failureMessage: "Assignments unavailable" }
      );
      if (result !== null) setAssignments(getTeacherList(result, ["assignments"]));
      return result;
    } catch {
      setAssignments([]);
      return null;
    }
  }, [request, resetAllEndpoints]);

  const fetchSubmissions = useCallback(async (assignmentId, params = {}) => {
    const result = await request(
      `teacherAssignmentSubmissions:${assignmentId}`,
      "fetch_teacher_assignment_submissions",
      () => getTeacherAssignmentSubmissions(assignmentId, params),
      { failureMessage: "Assignment submissions unavailable" }
    );
    if (result !== null) setSubmissions(getTeacherList(result, ["submissions"]));
    return result;
  }, [request]);

  const fetchAssignment = useCallback((assignmentId) => request(
    `teacherAssignment:${assignmentId}`,
    "fetch_teacher_assignment",
    () => getTeacherAssignment(assignmentId),
    { failureMessage: "Assignment unavailable" }
  ), [request]);

  const saveAssignment = useCallback(async (assignmentData, assignmentId) => {
    const update = Boolean(assignmentId);
    const result = await request(
      update ? `teacherAssignment:${assignmentId}` : "teacherAssignments",
      update ? "update_teacher_assignment" : "create_teacher_assignment",
      () => update
        ? patchTeacherAssignment(assignmentId, assignmentData)
        : createTeacherAssignment(assignmentData),
      {
        mutation: true,
        successMessage: update ? "Assignment updated successfully" : "Assignment created successfully",
        failureMessage: update ? "Failed to update assignment" : "Failed to create assignment"
      }
    );
    await refreshData();
    return result;
  }, [request, refreshData]);

  const replaceAssignment = useCallback(async (assignmentId, assignmentData) => {
    const result = await request(
      `teacherAssignment:${assignmentId}`,
      "replace_teacher_assignment",
      () => updateTeacherAssignment(assignmentId, assignmentData),
      {
        mutation: true,
        successMessage: "Assignment updated successfully",
        failureMessage: "Failed to update assignment"
      }
    );
    await refreshData();
    return result;
  }, [request, refreshData]);

  const removeAssignment = useCallback(async (assignmentId) => {
    const result = await request(
      `teacherAssignment:${assignmentId}`,
      "delete_teacher_assignment",
      () => deleteTeacherAssignment(assignmentId),
      { mutation: true, successMessage: "Assignment deleted successfully", failureMessage: "Failed to delete assignment" }
    );
    await refreshData();
    return result;
  }, [request, refreshData]);

  const refreshRef = useRef(refreshData);
  refreshRef.current = refreshData;
  useEffect(() => {
    refreshRef.current();
  }, []);

  return {
    assignments,
    submissions,
    loading,
    mutating,
    error,
    lastUpdated,
    refreshData,
    fetchAssignment,
    fetchSubmissions,
    saveAssignment,
    replaceAssignment,
    removeAssignment,
    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,
    endpointRetries: circuitBreaker.endpointRetries,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    notification
  };
}
