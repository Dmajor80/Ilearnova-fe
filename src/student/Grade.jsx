import { useState } from "react";
import gade from "../assets/Frame 40.png";
import { Filter } from "lucide-react";
import { Download } from "lucide-react";
export default function Grade() {
  const [activeTab, setActiveTab] = useState("Subjects");

  const studentData = {
    name: "Priscilla Daniel",
    role: "Ilearnova/Stu/001",
    grade: "Grade 6",
    courses: [
      {
        id: "01",
        subject: "Mathematics",
        term1: "100/100",
        term2: "98/100",
        term3: "100/100",
        final: "99/100",
        evaluation: "Excellent performance",
      },
      {
        id: "02",
        subject: "English Lang arts",
        term1: "95/100",
        term2: "97/100",
        term3: "98/100",
        final: "97/100",
        evaluation: "Good work",
      },
      {
        id: "03",
        subject: "Physics",
        term1: "94/100",
        term2: "95/100",
        term3: "96/100",
        final: "95/100",
        evaluation: "Outstanding",
      },
      {
        id: "04",
        subject: "Chemistry",
        term1: "92/100",
        term2: "93/100",
        term3: "94/100",
        final: "93/100",
        evaluation: "Excellent work",
      },
      {
        id: "05",
        subject: "Biology",
        term1: "93/100",
        term2: "91/100",
        term3: "95/100",
        final: "93/100",
        evaluation: "Needs improvement",
      },
      {
        id: "06",
        subject: "History",
        term1: "89/100",
        term2: "90/100",
        term3: "92/100",
        final: "90/100",
        evaluation: "Excellent performance",
      },
      {
        id: "07",
        subject: "Geography",
        term1: "91/100",
        term2: "89/100",
        term3: "93/100",
        final: "91/100",
        evaluation: "Well done",
      },
      {
        id: "08",
        subject: "Computer Science",
        term1: "96/100",
        term2: "97/100",
        term3: "98/100",
        final: "97/100",
        evaluation: "Outstanding",
      },
      {
        id: "09",
        subject: "Physical Education",
        term1: "95/100",
        term2: "94/100",
        term3: "96/100",
        final: "95/100",
        evaluation: "Excellent",
      },
    ],
    certifications: [
      { id: "Top Performing Subject: Physics - 90% (A)" },
      { id: "Lowest Performing Subject: Physical Education - 74% (B)" },
      { id: "Overall Average Grade: 85% (A)" },
    ],
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-50"
      style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
    >
      {/* Header */}
      <div className="container mx-auto px-4 mb-[2rem]">
        <h1 className="text-[25px] text-[blue] font-semibold">Grade</h1>
        <p className="text-[14px] text-[black]">
          View your academic performance across terms.
        </p>
      </div>
      <header className=" text-white py-2 relative overflow-hidden mb-[10rem] h-[167px]">
        <img src={gade} alt="" className="h-[167px] object-contain " />
      </header>

      {/* Profile Section */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <div className="absolute left-[50%] mt-[-18rem]">
              <div className="flex-col">
                <div className="w-[211px] h-[200px]  rounded-full bg-gray-200 overflow-hidden border-2 border-white">
                  {/* Placeholder for profile image */}
                  <div className="w-full h-full bg-gradient-to-r from-blue-300 to-blue-400 flex items-center justify-center text-white font-bold text-xl">
                    {studentData.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </div>
                </div>
              </div>
              <div className="  lg:flex-row ">
                <h2
                  className="text-[27px] text-center font-normal"
                  style={{ color: "rgba(18, 40, 164, 1)" }}
                >
                  {studentData.name}
                </h2>
                <p
                  className="text-[14px] text-center font-medium"
                  style={{ color: "rgba(51, 51, 51, 1)" }}
                >
                  {studentData.role}
                </p>
                <p
                  className="text-[14px]  text-center"
                  style={{ color: "rgba(51, 51, 51, 1)" }}
                >
                  {studentData.grade}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-[3rem]">
            <div className="mt-3">
              {studentData.certifications.map((cert, index) => (
                <div key={index} className="flex items-center text-xs mb-1">
                  <div className="w-5 h-5 rounded-full bg-blue-800 flex items-center justify-center mr-2">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">{cert.id}</span>
                </div>
              ))}
            </div>
            <div className=" flex ml-auto space-x-2">
              <button className="  px-3 py-1 rounded text-[14px] font-medium border border-gray-300 flex items-center">
                <Filter size={16} /> Filter
              </button>
              <button className=" text-gray-800 px-3 py-1 rounded text-[14px] border border-gray-300">
                Contact Student
              </button>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs flex items-center text-[14px] gap-3">
                <Download size={16} /> Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        {/* <div className="container mx-auto px-4">
          <div className="flex space-x-6">
            {["Subjects", "Term 1", "Term 2", "Term 3", "Final Result"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`py-2 px-1 text-sm ${
                    activeTab === tab
                      ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </div> */}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white shadow rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-[18px] font-medium text-gray-500 uppercase tracking-wider w-12">
                  SN
                </th>
                <th className="px-4 py-2 text-left text-[18px] font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-4 py-2 text-left text-[18px] font-medium text-gray-500 uppercase tracking-wider">
                  Term 1
                </th>
                <th className="px-4 py-2 text-left text-[18px] font-medium text-gray-500 uppercase tracking-wider">
                  Term 2
                </th>
                <th className="px-4 py-2 text-left text-[18px] font-medium text-gray-500 uppercase tracking-wider">
                  Term 3
                </th>
                <th className="px-4 py-2 text-left text-[18px] font-medium text-gray-500 uppercase tracking-wider">
                  Final Grade
                </th>
                <th className="px-4 py-2 text-left text-[18px] font-medium text-gray-500 uppercase tracking-wider">
                  Evaluation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studentData.courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                    {course.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowraptext-[18px] font-medium text-gray-900">
                    {course.subject}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-green-600 font-medium">
                    {course.term1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-green-600 font-medium">
                    {course.term2}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-green-600 font-medium">
                    {course.term3}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-green-600 font-bold">
                    {course.final}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                    {course.evaluation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
