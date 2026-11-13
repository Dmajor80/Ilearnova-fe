import { useState, useCallback } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";

/**
 * Hook that triggers a school data export.
 *
 * The API supports the default export endpoint and an export-type path.
 */
export default function useSchoolExport() {
  const notification = useNotification("info", 5000);
  const [exporting, setExporting] = useState(false);

  const exportSchoolData = useCallback(async ({ format } = {}) => {
    setExporting(true);
    try {
      const endpoint = format
        ? `/api/admin/school/export/${encodeURIComponent(format)}/`
        : "/api/admin/school/export/";
      const payload = await http.get(endpoint, {
        auth: true,
        responseType: "blob"
      });

      const data = payload?.data ?? payload;

      // If the backend actually returns JSON with a download link instead of
      // a file blob, open that link rather than trying to save JSON as a file.
      if (data && typeof data === "object" && !(data instanceof Blob) && (data.url || data.file_url)) {
        window.open(data.url || data.file_url, "_blank", "noopener,noreferrer");
        notification.notify("Export ready", "success");
        return data;
      }

      const blob = data instanceof Blob ? data : new Blob([data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `school-export-${new Date().toISOString().slice(0, 10)}${format ? `.${format}` : ""}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      notification.notify("Export downloaded", "success");
      return data;
    } catch (err) {
      const appError = parseError(err, { action: "export_school_data" });
      const userMessage = getUserFriendlyMessage(appError);
      const notificationType = getNotificationType(appError);

      notification.notify(`Export failed: ${userMessage}`, notificationType);
      console.warn("Failed to export school data:", err);
      throw appError;
    } finally {
      setExporting(false);
    }
  }, [notification]);

  return {
    exporting,
    exportSchoolData,
    notification
  };
}
