import React, { useState } from "react";
import {
  Search,
  Plus,
  Phone,
  Mail,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  User,
  MapPin,
  Users,
  ArrowLeft,
  Timer,
  LocationEdit,
  LocationEditIcon,
} from "lucide-react";
import ss from "@/assets/9.jpg";
export const PaymentHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // const [sortBy, setSortBy] = useState("newest");
  // const [showModal, setShowModal] = useState(false);
  // const [selectedStudent, setSelectedStudent] = useState(null);
  // const [formData, setFormData] = useState({
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   phone: "",
  //   dateOfBirth: "",
  //   address: "",
  //   parentName: "",
  //   parentPhone: "",
  //   grade: "",
  //   city: "",
  // });

  // Sample student data based on your images
  const students = [
    {
      paymentNumber: "#123456789",
      name: "Dakota Farral",
      date: "March 25, 2021",
      Amount: "$50,000",
      avatar: ss,
      status: "complete",
    },
    {
      paymentNumber: "#123456789",
      name: "Dakota Farral",
      date: "March 25, 2021",
      Amount: "$50,000",
      avatar: ss,
      status: "complete",
    },
    {
      paymentNumber: "#123456789",
      name: "Dakota Farral",
      date: "March 25, 2021",
      Amount: "$50,000",
      avatar: ss,
      status: "complete",
    },
    {
      paymentNumber: "#123456789",
      name: "Dakota Farral",
      date: "March 25, 2021",
      Amount: "$50,000",
      avatar: ss,
      status: "complete",
    },
    {
      paymentNumber: "#123456789",
      name: "Dakota Farral",
      date: "March 25, 2021",
      Amount: "$50,000",
      avatar: ss,
      status: "complete",
    },
    {
      paymentNumber: "#123456789",
      name: "Dakota Farral",
      date: "March 25, 2021",
      Amount: "$50,000",
      avatar: ss,
      status: "complete",
    },
    {
      paymentNumber: "#123456789",
      name: "Dakota Farral",
      date: "March 25, 2021",
      Amount: "$50,000",
      avatar: ss,
      status: "complete",
    },
    {
      paymentNumber: "#123456789",
      name: "Dakota Farral",
      date: "March 25, 2021",
      Amount: "$50,000",
      avatar: ss,
      status: "complete",
    },
    {
      paymentNumber: "#123456789",
      name: "Dakota Farral",
      date: "March 25, 2021",
      Amount: "$50,000",
      avatar: ss,
      status: "complete",
    },
    {
      paymentNumber: "#123456789",
      name: "Dakota Farral",
      date: "March 25, 2021",
      Amount: "$50,000",
      avatar: ss,
      status: "complete",
    },
    {
      paymentNumber: "#123456789",
      name: "Dakota Farral",
      date: "March 25, 2021",
      Amount: "$50,000",
      avatar: ss,
      status: "complete",
    },
    {
      paymentNumber: "#123456789",
      name: "Dakota Farral",
      date: "March 25, 2021",
      Amount: "$50,000",
      avatar: ss,
      status: "complete",
    },
    {
      paymentNumber: "#123456789",
      name: "Dakota Farral",
      date: "March 25, 2021",
      Amount: "$50,000",
      avatar: ss,
      status: "complete",
    },
    {
      paymentNumber: "#123456789",
      name: "Dakota Farral",
      date: "March 25, 2021",
      Amount: "$50,000",
      avatar: ss,
      status: "complete",
    },
    {
      paymentNumber: "#123456789",
      name: "Dakota Farral",
      date: "March 25, 2021",
      Amount: "$50,000",
      avatar: ss,
      status: "complete",
    },
  ];

  const studentsPerPage = 5;
  const totalPages = Math.ceil(students.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = students.slice(
    startIndex,
    startIndex + studentsPerPage
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Show student details if a student is selected

  return (
    <div className=" min-h-screen p-6 mb-15">
      {/* Header */}

      <div className="">
        {/* Table */}
        <div className="overflow-x-auto bg-[white]">
          <table className="w-full">
            <thead className="">
              <tr className="bg-[#f3f1f8]">
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  Payment Number
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  Date & Time
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  Amount
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-[white] rounded-[5px]">
              {currentStudents.map((student, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8   flex items-center justify-center text-sm">
                        <img
                          src={student.avatar}
                          alt=""
                          className="rounded-full"
                        />
                      </div>
                      <span className="font-bold text-[#303972] text-[16px] font-poppins">
                        {student.paymentNumber}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-[#4D44B5] font-bold text-[16px] font-poppins">
                    {student.date}
                  </td>
                  <td className="p-4 text-[#A098AE] text-[16px] font-normal font-poppins">
                    {student.Amount}
                  </td>
                  <td className="p-4 text-[#303972] text-[16px] font-normal font-poppins">
                    {student.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + studentsPerPage, students.length)} of{" "}
              {students.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
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
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
    </div>
  );
};
