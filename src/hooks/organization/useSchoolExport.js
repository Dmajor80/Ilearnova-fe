import { useState, useCallback } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";

/**
 * Hook that triggers a school data export.
 *
 * NOTE: /api/admin/school/export/ is documented only as "Export school data in
 * various formats" with NO query parameters, request, or response schema at
 * all. It's a GET, so it likely either streams a file (csv/xlsx/pdf) directly
 * or returns a download URL/job id - both are common for "various formats"
 * export endpoints. This hook handles the common case (a direct file
 * response) and falls back to opening a returned URL if the response looks
 * like JSON with a url/file_url field instead. Confirm the actual response
 * shape (and whether a `format=` query param is expected) against the backend
 * view before relying on this.
 */
export default function useSchoolExport() {
  const notification = useNotification("info", 5000);
  const [exporting, setExporting] = useState(false);

  const exportSchoolData = useCallback(async (params = {}) => {
    setExporting(true);
    try {
      const payload = await http.get("/api/admin/school/export/", {
        auth: true,
        params,
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
      link.download = `school-export-${new Date().toISOString().slice(0, 10)}`;
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
