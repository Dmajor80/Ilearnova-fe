import React, { useState } from "react";
import {
  ArrowLeft,
  MoreHorizontal,
  Search,
  User,
  Mail,
  ChevronLeft,
  ChevronRight,
  LocationEditIcon,
  Phone,
  RefreshCw,
  Loader2,
  AlertCircle,
  Users,
  Trash2,
  CheckCircle,
  XCircle,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import useTeacherData from "@/hooks/useTeacherData";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import NotificationBar from "@/components/ui/NotificationBar";
import Avatar from "@/components/ui/Avatar";
import { formatRegistrationDate, formatCurrency } from "@/lib/formatters";

// Teacher Details Component (uses the real TeacherDetail payload)
const TeacherDetails = ({ teacher, onBack, onToggleActive, onDelete, mutating }) => {
  const fullName =
    teacher.full_name ||
    `${teacher.first_name || ""} ${teacher.last_name || ""}`.trim() ||
    teacher.username;

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
            {/* Teacher Profile Card */}
            <div className="bg-gradient-to-r bg-[#3d3690] rounded-xl p-6   overflow-hidden h-[200px]">
              <div className=""></div>
              <div className=""></div>

              <div className="absolute mt-[2rem]  flex flex-col items-center space-x-6">
                <div className="w-40 h-40 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <Avatar
                    src={teacher.profile_pic}
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
                    {teacher.subjects || "Teacher"}
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                        teacher.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {teacher.is_active ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {teacher.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Employment Information */}
            <div className="p-8 bg-[white] grid grid-col-1 lg:grid-cols-2 gap-6 mb-2 pt-[8rem]  relative">
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <Mail size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Email:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {teacher.email}
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
                    {teacher.phone_number || "—"}
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
                    {teacher.address || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <Briefcase size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Employee ID:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {teacher.employee_id || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <GraduationCap size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Classes:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {teacher.classes || "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <User size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Performance:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {teacher.performance || "—"}
                  </p>
                </div>
              </div>
              {teacher.salary && (
                <div className="flex items-center gap-3">
                  <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                    <User size={30} className="text-[white]" />
                  </div>
                  <div>
                    <h1 className="text-[#A098AE]">Salary:</h1>
                    <p className="text-[#303972] font-poppins font-semibold">
                      {formatCurrency(teacher.salary)}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <User size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Member Since:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {formatRegistrationDate(teacher)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-8 pb-6 flex gap-3">
              <button
                onClick={() => onToggleActive(teacher)}
                disabled={mutating}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
                  teacher.is_active
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {teacher.is_active ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => onDelete(teacher)}
                disabled={mutating}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove Teacher
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TeacherListContent = () => {
  const {
    loading,
    error,
    teachers,
    totalTeachers,
    selectedTeacher,
    mutating,
    currentPage,
    totalPages,
    teachersPerPage,
    hasNextPage,
    hasPreviousPage,
    searchQuery,
    ordering,
    refreshData,
    fetchTeacherDetails,
    updateTeacher,
    deleteTeacher,
    handleSearch,
    handleOrderingChange,
    handlePageChange,
    handleTeacherSelect,
    clearTeacherSelection,
    notification
  } = useTeacherData();

  const [searchInput, setSearchInput] = useState("");
  const [cardStates, setCardStates] = useState({});

  const startIndex = (currentPage - 1) * teachersPerPage;
  const endIndex = Math.min(startIndex + teachersPerPage, totalTeachers);
  const currentTeachers = teachers;

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleHarmbugerClick = (cardId) => {
    setCardStates((prevStates) => ({
      ...prevStates,
      [cardId]: !prevStates[cardId],
    }));
  };

  const handleTeacherClick = async (teacher) => {
    // The list payload already has enough fields to show a profile view;
    // pull the richer TeacherDetail record in behind it for the extra fields.
    handleTeacherSelect(teacher);
    const details = await fetchTeacherDetails(teacher.id);
    if (details) {
      handleTeacherSelect({ ...teacher, ...details });
    }
  };

  const handleBackToList = () => {
    clearTeacherSelection();
  };

  const handleToggleActive = async (teacher) => {
    try {
      await updateTeacher(teacher.id, { is_active: !teacher.is_active });
      clearTeacherSelection();
    } catch (err) {
      // Notification already surfaced by the hook
    }
  };

  const handleDeleteTeacher = async (teacher) => {
    const name = teacher.full_name || teacher.email;
    if (!window.confirm(`Remove ${name} from teachers? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteTeacher(teacher.id);
      clearTeacherSelection();
    } catch (err) {
      // Notification already surfaced by the hook
    }
  };

  if (selectedTeacher) {
    return (
      <TeacherDetails
        teacher={selectedTeacher}
        onBack={handleBackToList}
        onToggleActive={handleToggleActive}
        onDelete={handleDeleteTeacher}
        mutating={mutating}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="mb-[6rem] p-6">
        {/* Notification */}
        {notification.show && (
          <NotificationBar
            message={notification.message}
            type={notification.type}
            onClose={notification.hide}
          />
        )}

        {/* teachlist header */}
        <div className="flex justify-between items-center p-6 bg-[white] mb-10 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search teachers..."
                value={searchInput}
                onChange={handleSearchInputChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={ordering}
              onChange={(e) => handleOrderingChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppin text-[#000000] text-[15px]"
              disabled={loading}
            >
              <option value="-created_at" className="text-[12px] text-[#4D44B5] font-poppins">
                Newest
              </option>
              <option value="created_at" className="text-[12px] text-[#4D44B5] font-poppins">
                Oldest
              </option>
              <option value="full_name" className="text-[12px] text-[#4D44B5] font-poppins">
                Name
              </option>
            </select>
            <button
              onClick={() => refreshData(true)}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

          </div>
        </div>
        {/* end of teachlist header */}

        {/* teacher fetch */}
        {loading ? (
          <div className="flex items-center justify-center space-x-2 p-16">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="text-gray-500">Loading teachers...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center space-y-2 p-16">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <span className="text-gray-500">Failed to load teachers</span>
            <button
              onClick={() => refreshData(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : currentTeachers.length === 0 ? (
          <div className="flex flex-col items-center space-y-3 p-16">
            <Users className="w-12 h-12 text-gray-400" />
            {searchQuery ? (
              <>
                <span className="text-gray-600 font-medium">No teachers match your search</span>
                <div className="text-sm text-gray-500">Search: "{searchQuery}"</div>
                <button
                  onClick={() => {
                    setSearchInput("");
                    handleSearch("");
                  }}
                  className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-600 font-medium">No teachers registered yet</span>
                <span className="text-sm text-gray-500">
                  Teachers will appear here once they are registered in the system
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
        ) : (
          <div className="tec mb-[5rem] grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            {currentTeachers.map((teach, index) => {
              const fullName = teach.full_name || teach.email;
              return (
                <div key={teach.id || index}>
                  {/* card container */}
                  <div className="bg-[white] max-w-[300px] w-[280px] mx-auto relative rounded-2xl min-h-[300px] shadow-[#b0a2a2] hover:shadow-lg pb-4">
                    <div className="flex justify-center mb-[2rem] pt-[1rem]">
                      <Avatar
                        src={teach.profile_pic}
                        name={fullName}
                        size="w-[110px] h-[110px]"
                        textSize="text-3xl"
                      />
                      <div
                        className=" absolute right-[20px] top-[12px] flex    items-center justify-center w-fit p-[5px] cursor-pointer h-[0px] "
                        onClick={() => handleHarmbugerClick(teach.id || index)}
                      >
                        <MoreHorizontal className="text-[#303972]" />
                      </div>
                      {cardStates[teach.id || index] && (
                        <div
                          className="absolute top-8 right-8
                        bg-[white]
                        shadow-lg p-5 rounded-lg z-10
                        "
                        >
                          <p
                            className="text-16px text-center font-poppins text-[#A098AE] font-normal cursor-pointer mb-2"
                            onClick={() => handleTeacherClick(teach)}
                          >
                            View
                          </p>
                          <p
                            className="text-16px text-center font-poppins text-red-500 font-normal cursor-pointer"
                            onClick={() => handleDeleteTeacher(teach)}
                          >
                            Delete
                          </p>
                        </div>
                      )}
                    </div>
                    <h1 className="text-center text-[#303972] font-poppins text-[18px]  font-bold mb-2.5 ">
                      {fullName}
                    </h1>
                    <p className="text-[16px] font-poppins text-[#A098AE] text-center mb-[1rem]">
                      {teach.employee_id || "Teacher"}
                    </p>
                    {/* subject / qualification / status */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-[2rem] px-4">
                      {teach.subject && (
                        <p className="text-[12px] font-poppins text-[#1EBA62] bg-[#DDFAEA] px-2 py-[2px] rounded-[10px] shadow-lg">
                          {teach.subject}
                        </p>
                      )}
                      {teach.qualification && (
                        <p className="text-[12px] font-poppins text-[#FB7D5B] bg-[#FFF3F0] px-2 py-[2px] rounded-[10px] shadow-lg">
                          {teach.qualification}
                        </p>
                      )}
                      <p
                        className={`text-[12px] font-poppins px-2 py-[2px] rounded-[10px] shadow-lg ${
                          teach.is_active
                            ? "text-green-700 bg-green-100"
                            : "text-gray-600 bg-gray-100"
                        }`}
                      >
                        {teach.is_active ? "Active" : "Inactive"}
                      </p>
                    </div>
                    {/* contarol */}
                    <div className="flex items-center justify-center  gap-5">
                      <button
                        className="bg-[#3D3690] text-[12px] flex items-center justify-center text-[#FFFFFF] font-semibold p-[5px] rounded-[5px] w-[80px] gap-1"
                        onClick={() => handleTeacherClick(teach)}
                      >
                        {" "}
                        <User
                          size={14}
                          className="text-[#FFFFFF] font-normal font-poppins"
                        />{" "}
                        Profile
                      </button>
                      <button className="flex items-center justify-center text-[12px] text-[#303972] font-poppins font-semibold p-[5px] rounded-[5px] w-[80px] bg-[#EBEBF9] gap-1">
                        {" "}
                        <Mail size={14} /> Chat
                      </button>
                    </div>
                    {/* contarol */}
                  </div>
                  {/* end of  card container */}
                </div>
              );
            })}
          </div>
        )}
        {/* end of teacher fetch */}

        {!loading && totalTeachers > 0 && (
          <div className="flex justify-between items-center p-6 border-t border-gray-200">
            <div className="text-[16px] text-[#A098AE] font-poppins ">
              Showing {startIndex + 1} to {endIndex} of {totalTeachers} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPreviousPage || loading}
                className="p-2 border-2 border-[#A098AE] rounded-[5px] text-gray-400  disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer  hover:bg-[#4D44B5] hover:text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    disabled={loading}
                    className={`px-3 py-1 rounded text-[20px] font-medium font-poppins transition-colors cursor-pointer ${
                      currentPage === page
                        ? "bg-[#4D44B5] text-white"
                        : "text-[#303972] bg-[#ffffff] hover:bg-[#4D44B5] hover:text-white border-2 border-[#303972] "
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage || loading}
                className="p-2 border-2 border-[#A098AE] rounded-[5px] text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer  hover:bg-[#4D44B5] hover:text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
