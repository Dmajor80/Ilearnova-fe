import React, { useState } from "react";
import { Download, Loader2, FileSpreadsheet } from "lucide-react";
import useSchoolExport from "@/hooks/useSchoolExport";
import NotificationBar from "@/components/ui/NotificationBar";

const FORMAT_OPTIONS = ["csv", "xlsx", "pdf"];

export const ReportsContent = () => {
  const { exporting, exportSchoolData, notification } = useSchoolExport();
  const [format, setFormat] = useState("csv");

  const handleExport = async () => {
    try {
      await exportSchoolData({ format });
    } catch (err) {
      // Notification already surfaced by the hook
    }
  };

  return (
    <div className="min-h-screen p-6">
      {notification.show && (
        <NotificationBar
          message={notification.message}
          type={notification.type}
          onClose={notification.hide}
        />
      )}

      <div className="bg-white rounded-lg shadow-sm p-8 max-w-lg mx-auto text-center">
        <FileSpreadsheet className="w-12 h-12 text-[#4D44B5] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#303972] mb-2">Export School Data</h2>
        <p className="text-gray-500 mb-6">
          Download a snapshot of your school's records for reporting or backup.
        </p>

        <div className="flex items-center justify-center gap-3 mb-6">
          <label className="text-sm font-medium text-gray-700">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {FORMAT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="bg-[#4D44B5] hover:bg-[#3D34A5] text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto disabled:opacity-50"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {exporting ? "Preparing export..." : "Export Data"}
        </button>
      </div>
    </div>
  );
};

export default ReportsContent;
