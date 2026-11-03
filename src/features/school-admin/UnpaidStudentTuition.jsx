import React from "react";
import {
  User,
  MoreHorizontal,
  Printer,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
// import useUnpaidTuitionData from "@/hooks/useUnpaidTuitionData";
import NotificationBar from "@/components/ui/NotificationBar";
import Avatar from "@/components/ui/Avatar";
import useUnpaidTuitionData from "@/hooks/useUnpaidTuitionData";

const UnpaidStudentTuition = () => {
  const {
    loading,
    error,
    students,
    totalStudents,
    currentPage,
    studentsPerPage,
    refreshData,
    handlePageChange,
    notification
  } = useUnpaidTuitionData();

  const totalPages = Math.ceil(totalStudents / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = Math.min(startIndex + studentsPerPage, totalStudents);
  const currentStudents = students.slice(startIndex, startIndex + studentsPerPage);

  const getClassColor = () => "bg-orange-100 text-orange-600";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-15">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#303972]">
          Unpaid Student Tuition
        </h2>
        <button
          onClick={() => refreshData(true)}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          title="Refresh"
        >
          <Loader2 className={`w-4 h-4 ${loading ? "animate-spin" : "hidden"}`} />
        </button>
      </div>

      {notification.show && (
        <div className="px-6 pt-4">
          <NotificationBar
            message={notification.message}
            type={notification.type}
            onClose={notification.hide}
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#ebebf5]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                Fees Owed
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                Enrolled
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    <span className="text-gray-500">Loading unpaid tuition...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="p-8 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                    <span className="text-gray-500">Failed to load unpaid tuition data</span>
                    <button
                      onClick={() => refreshData(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </td>
              </tr>
            ) : currentStudents.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                    <span className="text-gray-600 font-medium">
                      No outstanding tuition balances
                    </span>
                    <span className="text-sm text-gray-500">Every student is paid up.</span>
                  </div>
                </td>
              </tr>
            ) : (
              currentStudents.map((student, index) => (
                <tr key={student.id || `${student.student_id}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <Avatar
                          src={student.profile_pic || student.avatar}
                          name={student.full_name || student.name}
                          size="w-8 h-8"
                          textSize="text-xs"
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-[16px] font-bold text-[#303972]">
                          {student.full_name || student.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-[16px] font-bold text-[#4D44B5]">
                      {student.student_id || student.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-[#A098AE]">Class</div>
                        <div className="text-[16px] font-bold text-[#303972]">
                          {student.class_name || student.class}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-[16px] font-bold text-[#303972]">
                      {typeof student.fees === "number"
                        ? `$ ${student.fees.toLocaleString()}`
                        : student.fees}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#A098AE]">
                      {student.enrollment_date || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Printer className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      {!loading && totalStudents > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {endIndex} of {totalStudents} entries
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnpaidStudentTuition;
