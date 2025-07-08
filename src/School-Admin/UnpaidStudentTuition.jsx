import React, { useState } from "react";
import {
  User,
  MoreHorizontal,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const UnpaidStudentTuition = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sample data - expanded to show pagination
  const studentsData = [
    {
      id: "ID 1234567811",
      name: "Jordan Nico",
      avatar: "/api/placeholder/32/32",
      class: "VII B",
      fees: 52036,
      rank: "First",
    },
    {
      id: "ID 1234567811",
      name: "Jordan Nico",
      avatar: "/api/placeholder/32/32",
      class: "VII B",
      fees: 52036,
      rank: "First",
    },
    {
      id: "ID 1234567812",
      name: "Karen Hope",
      avatar: "/api/placeholder/32/32",
      class: "VII A",
      fees: 53036,
      rank: "First",
    },
    {
      id: "ID 1234567812",
      name: "Karen Hope",
      avatar: "/api/placeholder/32/32",
      class: "VII A",
      fees: 53036,
      rank: "First",
    },
    {
      id: "ID 1234567813",
      name: "Nadila Adja",
      avatar: "/api/placeholder/32/32",
      class: "VII B",
      fees: 54036,
      rank: "First",
    },
    {
      id: "ID 1234567814",
      name: "Michael Chen",
      avatar: "/api/placeholder/32/32",
      class: "VII C",
      fees: 51036,
      rank: "First",
    },
    {
      id: "ID 1234567815",
      name: "Sarah Wilson",
      avatar: "/api/placeholder/32/32",
      class: "VII A",
      fees: 55036,
      rank: "First",
    },
    {
      id: "ID 1234567816",
      name: "David Brown",
      avatar: "/api/placeholder/32/32",
      class: "VII B",
      fees: 52536,
      rank: "First",
    },
    {
      id: "ID 1234567817",
      name: "Emma Davis",
      avatar: "/api/placeholder/32/32",
      class: "VII C",
      fees: 53536,
      rank: "First",
    },
    {
      id: "ID 1234567818",
      name: "Alex Johnson",
      avatar: "/api/placeholder/32/32",
      class: "VII A",
      fees: 54536,
      rank: "First",
    },
  ];

  const totalPages = Math.ceil(studentsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = studentsData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getClassColor = (className) => {
    const colors = {
      "VII A": "bg-orange-100 text-orange-600",
      "VII B": "bg-orange-100 text-orange-600",
      "VII C": "bg-orange-100 text-orange-600",
    };
    return colors[className] || "bg-orange-100 text-orange-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-15">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-[#303972]">
          Unpaid Student Intuition
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#ebebf5]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Fees
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentStudents.map((student, index) => (
              <tr key={`${student.id}-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-[16px] font-bold text-[#303972]">
                        {student.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-[16px] font-bold text-[#4D44B5]">
                    {student.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#A098AE]">
                        Class
                      </div>
                      <div className="text-[16px] font-bold text-[#303972]">
                        {student.class}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-[16px] font-bold text-[#303972]">
                    $ {student.fees.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#A098AE]">{student.rank}</div>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1} to {Math.min(endIndex, studentsData.length)}{" "}
          of {studentsData.length} entries
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
    </div>
  );
};

export default UnpaidStudentTuition;
