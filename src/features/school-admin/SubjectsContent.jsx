import React from "react";
import { RefreshCw, Loader2, AlertCircle, BookOpen } from "lucide-react";
import useSubjectsData from "@/hooks/useSubjectsData";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import NotificationBar from "@/components/ui/NotificationBar";

export const SubjectsContent = () => {
  const { loading, error, subjects, refreshData, notification } = useSubjectsData();

  return (
    <ErrorBoundary>
      <div className="min-h-screen p-6">
        {notification.show && (
          <NotificationBar
            message={notification.message}
            type={notification.type}
            onClose={notification.hide}
          />
        )}

        <div className="flex justify-between items-center p-6 bg-white mb-10 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-[#303972]">Subjects</h2>
          <button
            onClick={() => refreshData(true)}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f3f1f8]">
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Subject</th>
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Code</th>
                <th className="font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      <span className="text-gray-500">Loading subjects...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                      <span className="text-gray-500">Failed to load subjects</span>
                      <button
                        onClick={() => refreshData(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : subjects.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                      <span className="text-gray-600 font-medium">No subjects configured yet</span>
                    </div>
                  </td>
                </tr>
              ) : (
                subjects.map((subject, index) => (
                  <tr key={subject.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-bold text-[#303972] text-[16px] font-poppins">
                      {subject.name || subject.title}
                    </td>
                    <td className="p-4 text-[#4D44B5] font-medium text-[15px] font-poppins">
                      {subject.code || "—"}
                    </td>
                    <td className="p-4 text-[#A098AE] text-[15px] font-poppins">
                      {subject.description || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SubjectsContent;
