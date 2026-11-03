import { useCallback, useState } from "react";
import { createTeacherAnnouncement } from "@/api/teacher";
import useTeacherApi from "./teacherApiUtils";

export default function useTeacherAnnouncements() {
  const { request, circuitBreaker, loading, mutating, error, lastUpdated, notification } = useTeacherApi();
  const [announcement, setAnnouncement] = useState(null);

  const publishAnnouncement = useCallback(async (announcementData) => {
    const result = await request(
      "teacherAnnouncements",
      "create_teacher_announcement",
      () => createTeacherAnnouncement(announcementData),
      {
        mutation: true,
        successMessage: "Announcement published successfully",
        failureMessage: "Failed to publish announcement"
      }
    );
    if (result !== null) setAnnouncement(result);
    return result;
  }, [request]);

  return {
    announcement,
    loading,
    mutating,
    error,
    lastUpdated,
    publishAnnouncement,
    failedEndpoints: circuitBreaker.failedEndpoints,
    endpointErrors: circuitBreaker.endpointErrors,
    endpointRetries: circuitBreaker.endpointRetries,
    resetFailedEndpoints: circuitBreaker.resetAllEndpoints,
    notification
  };
}
