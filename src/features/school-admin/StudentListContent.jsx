import React, { useState } from "react";
import {
  Search,
  Phone,
  Mail,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  User,
  Users,
  RefreshCw,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Trash2,
  CheckCircle,
  XCircle,
  LocationEditIcon,
} from "lucide-react";
import { PaymentHistory } from "./PaymentHistory";
import useStudentData from "@/hooks/useStudentData";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import NotificationBar from "@/components/ui/NotificationBar";
import Avatar from "@/components/ui/Avatar";
import { formatRegistrationDate, formatStudentId } from "@/lib/formatters";

// Student Details Component (uses the real StudentDetail payload)
const StudentDetails = ({ student, onBack, onToggleActive, onDelete, mutating }) => {
  const fullName = student.full_name || student.name || student.username;

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className=" ">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Main Content */}
        <div className="flex flex-col w-full">
          <div className="  flex-1 p-6 relative ">
            {/* Student Profile Card */}
            <div className="bg-gradient-to-r bg-[#3d3690] rounded-xl p-6   overflow-hidden h-[200px]">
              <div className=""></div>
              <div className=""></div>

              <div className="absolute mt-[2rem]  flex flex-col items-center space-x-6">
                <div className="w-40 h-40 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <Avatar
                    src={student.profile_pic || student.avatar}
                    name={fullName}
                    size="w-36 h-36"
                    textSize="text-4xl"
                    className="border-4 border-white"
                  />
                </div>
                <div className="absolute flex justify-center right-[-35rem] z-0 mt-[0.6rem]">
                  <div
                    className="w-[250px] h-[150px] absolute mt-[2rem] z-[-10] ml-[-15rem] rounded-2xl"
                    style={{ background: "rgb(252, 196, 62" }}
                  ></div>
                  <div className="bg-[#FB7D5B] w-[250px] h-[150px] rounded-2xl  mb-[10.5]"></div>
                </div>
                <div className="mt-[1rem] z-40 ">
                  <h2 className="text-3xl font-bold mb-1 text-[#303972] font-poppins">
                    {fullName}
                  </h2>
                  <p className="text-[#4D44B5] mb-1 font-poppins text-[16px] font-semibold text-center">
                    {student.class_name || "Student"}
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                        student.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {student.is_active ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {student.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Academic Information */}
            <div className="p-3.5 bg-[white] grid grid-col-1 lg:grid-cols-2 gap-6 mb-2 pt-[8rem]  relative ">
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <User size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Student ID:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {student.student_id || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <Mail size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Email:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {student.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <Phone size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Phone:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {student.phone_number || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <LocationEditIcon size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Address:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {student.address || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <Users size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Class:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {student.class_name || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <User size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Fees:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {student.fees || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <User size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Enrolled:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {student.enrollment_date || formatRegistrationDate(student)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-3.5 pb-6 flex gap-3">
              <button
                onClick={() => onToggleActive(student)}
                disabled={mutating}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
                  student.is_active
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {student.is_active ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => onDelete(student)}
                disabled={mutating}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove Student
              </button>
            </div>
          </div>
          <div>
            <PaymentHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export const StudentListContent = () => {
  // Use the student data hook
  const {
    loading,
    error,
    students,
    totalStudents,
    selectedStudent,
    mutating,
    availableGrades,
    gradesLoading,
    gradesError,
    currentPage,
    totalPages,
    studentsPerPage,
    hasNextPage,
    hasPreviousPage,
    searchQuery,
    selectedGrade,
    refreshData,
    updateStudent,
    deleteStudent,
    handleSearch,
    handleGradeFilter,
    handlePageChange,
    handleStudentSelect,
    clearStudentSelection,
    notification
  } = useStudentData();

  // Local state for UI components
  const [searchInput, setSearchInput] = useState("");

  // Calculate display values
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = Math.min(startIndex + studentsPerPage, totalStudents);
  const currentStudents = students;

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    // Debounce search to avoid too many API calls
    setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleStudentClick = (student) => {
    handleStudentSelect(student);
  };

  const handleBackToList = () => {
    clearStudentSelection();
  };

  const handleToggleActive = async (student) => {
    try {
      await updateStudent(student.id, { is_active: !student.is_active });
      clearStudentSelection();
    } catch (err) {
      // Notification already surfaced by the hook
    }
  };

  const handleDeleteStudent = async (student) => {
    const name = student.full_name || student.email;
    if (!window.confirm(`Remove ${name} from students? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteStudent(student.id);
      clearStudentSelection();
    } catch (err) {
      // Notification already surfaced by the hook
    }
  };

  const getStatusColor = (status) => {
    const value = (status || "").toLowerCase();
    if (value === "active" || value === "enrolled") return "bg-green-100 text-green-800";
    if (value === "paid") return "bg-green-100 text-green-800";
    if (value === "unpaid" || value === "overdue") return "bg-red-100 text-red-700";
    return "bg-blue-100 text-blue-800";
  };

  // Show student details if a student is selected
  if (selectedStudent) {
    return (
      <StudentDetails
        student={selectedStudent}
        onBack={handleBackToList}
        onToggleActive={handleToggleActive}
        onDelete={handleDeleteStudent}
        mutating={mutating}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen p-6">
        {/* Notification */}
        {notification.show && (
          <NotificationBar
            message={notification.message}
            type={notification.type}
            onClose={notification.hide}
          />
        )}

        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white mb-10 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchInput}
                onChange={handleSearchInputChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <select
              value={selectedGrade}
              onChange={(e) => handleGradeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading || gradesLoading}
              title={gradesError ? `Error loading grades: ${gradesError}` : "Filter by class"}
            >
              <option value="">
                {gradesLoading
                  ? "Loading classes..."
                  : gradesError
                    ? "Error loading classes"
                    : availableGrades.length === 0
                      ? "No classes available"
                      : "All Classes"
                }
              </option>
              {!gradesLoading && !gradesError && availableGrades.length > 0 &&
                availableGrades.map((grade) => (
                  <option key={grade.id || grade.name} value={grade.id || grade.name}>
                    {grade.label || grade.name || grade.id}
                  </option>
                ))
              }
              {gradesError && (
                <option disabled>Failed to load classes</option>
              )}
              {!gradesLoading && !gradesError && availableGrades.length === 0 && (
                <option disabled>No classes configured</option>
              )}
            </select>
            <button
              onClick={() => refreshData(true)}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        <div className="">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="">
              <tr className="bg-[#f3f1f8]">
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                  Name
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                  ID
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                  Registered
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                  Class
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                  Status
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                  Fees
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                  Contact
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white rounded-[5px]">
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      <span className="text-gray-500">Loading students...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                      <span className="text-gray-500">Failed to load students</span>
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
                  <td colSpan="9" className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <Users className="w-12 h-12 text-gray-400" />
                      {searchQuery || selectedGrade ? (
                        <>
                          <span className="text-gray-600 font-medium">No students match your criteria</span>
                          <div className="text-sm text-gray-500 space-y-1">
                            {searchQuery && (
                              <div>Search: "{searchQuery}"</div>
                            )}
                            {selectedGrade && (
                              <div>Class: {selectedGrade}</div>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              handleSearch("");
                              handleGradeFilter("");
                            }}
                            className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            Clear filters
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-gray-600 font-medium">No students registered yet</span>
                          <span className="text-sm text-gray-500">
                            Students will appear here once they are registered in the system
                          </span>
                          <button
                            onClick={() => refreshData(true)}
                            className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            Refresh
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentStudents.map((student, index) => (
                  <tr
                    key={student.id || index}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleStudentClick(student)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={student.profile_pic || student.avatar}
                          name={student.full_name}
                          size="w-8 h-8"
                          textSize="text-sm"
                        />
                        <span className="font-bold text-[#303972] text-[16px] font-poppins">
                          {student.full_name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleStudentClick(student)}
                        className="text-[#4D44B5] font-bold text-[16px] font-poppins hover:text-[#3D34A5] hover:underline transition-colors cursor-pointer"
                        title={`View profile for ${student.full_name} (Full ID: ${student.id || student.student_id})`}
                      >
                        {formatStudentId(student)}
                      </button>
                    </td>
                    <td className="p-4 text-[#A098AE] text-[16px] font-normal font-poppins">
                      <span title="Registration date">
                        {formatRegistrationDate(student)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {student.class_name || "—"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                        {student.status || "—"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.fees_status)}`}>
                        {student.fees_status || "—"}
                      </span>
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex space-x-2">
                        <button
                          className="p-2 bg-[#EBEBF9] hover:text-blue-600 rounded-full"
                          title="Email student"
                        >
                          <Mail className="w-5 h-5 text-[#A098AE]" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleStudentClick(student)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="View details"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalStudents > 0 && (
          <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {endIndex} of {totalStudents} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPreviousPage || loading}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Show page numbers with ellipsis for large page counts */}
              {totalPages <= 7 ? (
                [...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })
              ) : (
                <>
                  {/* First page */}
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={loading}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    1
                  </button>

                  {currentPage > 3 && <span className="px-2 text-gray-400">...</span>}

                  {/* Current page and neighbors */}
                  {[currentPage - 1, currentPage, currentPage + 1]
                    .filter(page => page > 1 && page < totalPages)
                    .map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={loading}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                  {currentPage < totalPages - 2 && <span className="px-2 text-gray-400">...</span>}

                  {/* Last page */}
                  {totalPages > 1 && (
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={loading}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        currentPage === totalPages
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {totalPages}
                    </button>
                  )}
                </>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage || loading}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </ErrorBoundary>
  );
};
