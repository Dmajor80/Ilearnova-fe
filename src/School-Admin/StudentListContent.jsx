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
import ss from "../assets/9.jpg";
import { PaymentHistory } from "./PaymentHistory";

// Student Details Component
const StudentDetails = ({ student, onBack }) => {
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
                <div className="w-40 h-40  rounded-full flex items-center justify-center text-4xl  ">
                  <img
                    src={student.avatar}
                    alt=""
                    className="border-10 border-b-white border-t-white border-l-white border-r-white  rounded-full z-1 p-0"
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
                    {student.name}
                  </h2>
                  <p className="text-[#4D44B5] mb-1 font-poppins text-[16px] font-semibold">
                    Student
                  </p>
                  <div className="flex items-center space-x-4">
                    {/* <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    {student.id}
                  </span> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-3.5 bg-[white] grid grid-col-1 lg:grid-cols-2 gap-6 mb-2 pt-[8rem]  relative ">
              {/* parent information */}
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[5px]">
                  <User size={40} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Parents:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {" "}
                    {student.parent}
                  </p>
                </div>
              </div>
              {/* end of parent information */}
              {/* add information */}
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <LocationEditIcon size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#22094f]">Address:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {" "}
                    {student.city}
                  </p>
                </div>
              </div>
              {/* end of add information */}
              {/* Phone information */}
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <Phone size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Phone:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {student.Phone}
                  </p>
                </div>
              </div>
              {/* end of phone information */}
              {/* Email information */}
              <div className="flex items-center gap-3">
                <div className="bg-[#FB7D5B] w-fit rounded-full p-[10px]">
                  <User size={30} className="text-[white]" />
                </div>
                <div>
                  <h1 className="text-[#A098AE]">Email:</h1>
                  <p className="text-[#303972] font-poppins font-semibold">
                    {" "}
                    {student.email}
                  </p>
                </div>
              </div>
              {/* end of parent information */}
            </div>
          </div>
          <div>
            <PaymentHistory />
          </div>
        </div>
        {/* Schedule Sidebar */}
        <div className="w-120   p-6">
          <div className="space-y-4">
            <div className="border-l-8 rounded-[10px] border-[#4D44B5] pl-4 py-3 bg-[white]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Basic Algorithm</h4>
                <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-500 mb-2">Algorithm</p>
              <div className="flex flex-col space-x-4 text-sm text-gray-500">
                <span className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 mr-1 text-red-600" />
                  March 20, 2022
                </span>

                <span className="flex items-center mb-2">
                  <Timer className="w-5 h-5 mr-1 text-amber-300" />
                  09:00 - 10:00 AM
                </span>
              </div>
            </div>
            <div className="border-l-8 rounded-[10px] border-[#4D44B5] pl-4 py-3 bg-[white]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Basic Algorithm</h4>
                <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-500 mb-2">Algorithm</p>
              <div className="flex flex-col space-x-4 text-sm text-gray-500">
                <span className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 mr-1 text-red-600" />
                  March 20, 2022
                </span>

                <span className="flex items-center mb-2">
                  <Timer className="w-5 h-5 mr-1 text-amber-300" />
                  09:00 - 10:00 AM
                </span>
              </div>
            </div>
            <div className="border-l-8 rounded-[10px] border-[#4D44B5] pl-4 py-3 bg-[white]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Basic Algorithm</h4>
                <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-500 mb-2">Algorithm</p>
              <div className="flex flex-col space-x-4 text-sm text-gray-500">
                <span className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 mr-1 text-red-600" />
                  March 20, 2022
                </span>

                <span className="flex items-center mb-2">
                  <Timer className="w-5 h-5 mr-1 text-amber-300" />
                  09:00 - 10:00 AM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StudentListContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    parentName: "",
    parentPhone: "",
    grade: "",
    city: "",
  });

  // Sample student data based on your images
  const students = [
    {
      id: "ID 123456789",
      name: "Dakota Farral",
      date: "March 25, 2021",
      parent: "Miranda Adila",
      city: "Jakarta",
      grade: "VII A",
      avatar: ss,
      Phone: "+123456780",
      email: "karen123@gmail",
    },
    {
      id: "ID 123456790",
      name: "Dimitres Viga",
      date: "March 25, 2021",
      parent: "Salvadore Morbeau",
      city: "Jakarta",
      grade: "VII A",
      avatar: ss,
      Phone: "+123456780",
      email: "karen123@gmail",
    },
    {
      id: "ID 123456791",
      name: "Indiana Barker",
      date: "March 25, 2021",
      parent: "Maria Historia",
      city: "Jakarta",
      grade: "VII A",
      avatar: ss,
      Phone: "+123456780",
      email: "karen123@gmail",
    },
    {
      id: "ID 123456792",
      name: "Johnny Ahmad",
      date: "March 25, 2021",
      parent: "Danny Ahmad",
      city: "Jakarta",
      grade: "VII A",
      avatar: ss,
      Phone: "+123456780",
      email: "karen123@gmail",
    },
    {
      id: "ID 123456793",
      name: "Jordan Nico",
      date: "March 25, 2021",
      parent: "Amanda Nico",
      city: "Jakarta",
      grade: "VII A",
      avatar: ss,
      Phone: "+123456780",
      email: "karen123@gmail",
    },
    {
      id: "ID 123456794",
      name: "Karen Hope",
      date: "March 25, 2021",
      parent: "Justin Hope",
      city: "Jakarta",
      grade: "VII A",
      avatar: ss,
      Phone: "+123456780",
      email: "karen123@gmail",
    },
  ];

  const studentsPerPage = 10;
  const totalPages = Math.ceil(students.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = students.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    setShowModal(false);
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      parentName: "",
      parentPhone: "",
      grade: "",
      city: "",
    });
  };

  const getGradeColor = (grade) => {
    if (grade === "VII A") return "bg-orange-100 text-orange-800";
    return "bg-blue-100 text-blue-800";
  };

  // Show student details if a student is selected
  if (selectedStudent) {
    return (
      <StudentDetails student={selectedStudent} onBack={handleBackToList} />
    );
  }

  return (
    <div className=" min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-[white] mb-10">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search here..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name">Name</option>
          </select>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#4D44B5] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4 font-semibold" />
          <span className="text-[13px] font-semibold">New Student</span>
        </button>
      </div>
      <div className="">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="">
              <tr className="bg-[#f3f1f8]">
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  Name ↕
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  ID ↕
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  Date ↕
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  Parent Name ↕
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  City ↕
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  Contact ↕
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  Grade ↕
                </th>
                <th className=" font-poppins px-6 py-3 text-left text-xs font-semibold text-[#4D44B5] uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  Action ↕
                </th>
              </tr>
            </thead>
            <tbody className="bg-[white] rounded-[5px]">
              {currentStudents.map((student, index) => (
                <tr
                  key={index}
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
                      <div className="w-8 h-8   flex items-center justify-center text-sm">
                        <img
                          src={student.avatar}
                          alt=""
                          className="rounded-full"
                        />
                      </div>
                      <span className="font-bold text-[#303972] text-[16px] font-poppins">
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-[#4D44B5] font-bold text-[16px] font-poppins">
                    {student.id}
                  </td>
                  <td className="p-4 text-[#A098AE] text-[16px] font-normal font-poppins">
                    {student.date}
                  </td>
                  <td className="p-4 text-[#303972] text-[16px] font-normal font-poppins">
                    {student.parent}
                  </td>
                  <td className="p-4 text-[#303972] text-[16px] font-normal font-poppins">
                    {student.city}
                  </td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex space-x-2">
                      <button className="p-2  bg-[#EBEBF9] hover:text-blue-600 rounded-full">
                        <Phone className="w-5 h-5 text-[#A098AE]" />
                      </button>
                      <button className="p-2  hover:text-blue-600 bg-[#EBEBF9] rounded-full">
                        <Mail className="w-5 h-5 text-[#A098AE]" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(
                        student.grade
                      )}`}
                    >
                      {student.grade}
                    </span>
                  </td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                Add New Student
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Section */}
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <User className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Personal Information
                    </h3>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter parent phone number"
                    required
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
