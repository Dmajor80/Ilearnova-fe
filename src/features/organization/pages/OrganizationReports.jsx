import React, { useState } from "react";
import useOrganizationReports from "@/hooks/organization/useSchoolExport";
import { Download, FileText } from "lucide-react";

const OrganizationReports = () => {
  const reports = useOrganizationReports();
  const [format, setFormat] = useState("csv");

  const downloadExport = async () => {
    try {
      await reports.exportSchoolData({ format });
    } catch (error) {
      console.warn("Unable to download organization export:", error);
    }
  };

  return (
    <div className="space-y-5 rounded-xl bg-white p-4 shadow-sm md:p-6">
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold">Reports & Documents</h3>
        <p className="mt-1 text-sm text-gray-600">Download the school data export provided by the admin API.</p>
      </div>
      <div className="flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-blue-50 p-3 text-blue-700"><FileText className="h-6 w-6" /></span>
          <div>
            <h4 className="font-medium">School data export</h4>
            <p className="text-sm text-gray-600">Exports data using the configured school admin endpoint.</p>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          Format
          <select
            value={format}
            onChange={(event) => setFormat(event.target.value)}
            className="min-h-[40px] rounded-lg border px-3"
          >
            <option value="csv">CSV</option>
            <option value="xlsx">Excel</option>
            <option value="pdf">PDF</option>
          </select>
        </label>
        <button
          onClick={downloadExport}
          disabled={reports.exporting}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {reports.exporting ? "Preparing export…" : "Download export"}
        </button>
      </div>
      {reports.notification.show && (
        <p role="status" className={`rounded-lg p-3 text-sm ${reports.notification.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {reports.notification.message}
        </p>
      )}
    </div>
  );
};

export default OrganizationReports;
