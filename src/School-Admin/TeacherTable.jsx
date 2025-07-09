import React, { useState } from "react";

const TeacherTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("qualification");
  const [sortDirection, setSortDirection] = useState("asc");

  const teacherData = [
    {
      name: "James",
      subject: "History",
      qualification: "B.Com",
      fees: "$21.70",
      performance: "Bad",
    },
    {
      name: "James Brown",
      subject: "History",
      qualification: "B.Com",
      fees: "$15.70",
      performance: "Bad",
    },
    {
      name: "Hardy",
      subject: "Basic Algorithm",
      qualification: "B.E",
      fees: "$17.70",
      performance: "Good",
    },
    {
      name: "Hanu",
      subject: "Programming",
      qualification: "B.Tech",
      fees: "$217.70",
      performance: "Good",
    },
    {
      name: "Harry",
      subject: "English",
      qualification: "B.Tech",
      fees: "$219.70",
      performance: "Good",
    },
    {
      name: "Harry John",
      subject: "History",
      qualification: "B.Tech",
      fees: "$18.70",
      performance: "Good",
    },
    {
      name: "Jack Xarma",
      subject: "Programming",
      qualification: "B.Tech",
      fees: "$192.70",
      performance: "Good",
    },
    {
      name: "Janny",
      subject: "Basic Algorithm",
      qualification: "B.Tech",
      fees: "$21.70",
      performance: "Good",
    },
  ];

  const itemsPerPage = 8;
  const totalPages = Math.ceil(teacherData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...teacherData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "fees") {
      aValue = parseFloat(aValue.replace("$", ""));
      bValue = parseFloat(bValue.replace("$", ""));
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSortIcon = (field) => {
    if (sortField !== field) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const getPerformanceBadge = (performance) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    if (performance === "Good") {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else {
      return `${baseClasses} bg-red-100 text-red-800`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-[950px]">
      <div className="p-0">
        <div className="overflow-x-auto">
          <p className="p-[1rem] text-[#303972] font-bold"> Teacher Deatails</p>
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr className="bg-[#ebebf5]">
                <th
                  className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Name {getSortIcon("name")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("subject")}
                >
                  <div className="flex items-center gap-1">
                    Subject {getSortIcon("subject")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("qualification")}
                >
                  <div className="flex items-center gap-1">
                    Qualification {getSortIcon("qualification")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("fees")}
                >
                  <div className="flex items-center gap-1">
                    Fees {getSortIcon("fees")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("performance")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Performance {getSortIcon("performance")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((teacher, index) => (
                <tr
                  key={index}
                  // className={`${
                  //   index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  // } hover:bg-blue-50 transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {teacher.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.qualification}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.fees}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={getPerformanceBadge(teacher.performance)}>
                      {teacher.performance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination and Info */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, teacherData.length)}
                </span>{" "}
                of <span className="font-medium">{teacherData.length}</span>{" "}
                entries
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherTable;
