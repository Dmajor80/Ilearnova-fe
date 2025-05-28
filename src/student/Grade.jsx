import { useState } from "react";
import { Filter, Download } from "lucide-react";

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
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 lg:mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl lg:text-3xl text-blue-600 font-semibold mb-1 sm:mb-2">
            Transcript
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">
            View your academic performance across terms.
          </p>
        </div>
      </div>

      {/* Banner Section */}
      <div className="relative w-full">
        {/* Banner Image */}
        <div className="w-full h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
          <div className="text-white text-lg sm:text-xl lg:text-2xl font-semibold">
            Academic Banner
          </div>
        </div>

        {/* Profile Section - Overlapping the banner */}
        <div className="absolute inset-x-0 top-8 sm:top-12 md:top-16 lg:top-20 xl:top-24">
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mx-4 sm:mx-6 w-full max-w-6xl">
              {/* Profile Content */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                {/* Profile Picture and Info */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 lg:flex-col lg:space-x-0 lg:space-y-4">
                  {/* Profile Picture */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full bg-gradient-to-r from-blue-300 to-blue-400 flex items-center justify-center text-white font-bold text-lg sm:text-xl lg:text-2xl border-4 border-white shadow-md flex-shrink-0">
                    {studentData.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </div>

                  {/* Student Info */}
                  <div className="text-center sm:text-left lg:text-center flex-shrink-0">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-blue-800 mb-1">
                      {studentData.name}
                    </h2>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-1">
                      {studentData.role}
                    </p>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                      {studentData.grade}
                    </p>
                  </div>
                </div>

                {/* Certifications and Actions */}
                <div className="flex-1 mt-6 lg:mt-0">
                  <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start space-y-6 xl:space-y-0 xl:space-x-8">
                    {/* Certifications */}
                    <div className="flex-1">
                      <h3 className="text-sm sm:text-base font-medium text-gray-800 mb-3">
                        Academic Highlights
                      </h3>
                      <div className="space-y-2">
                        {studentData.certifications.map((cert, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                              {cert.id}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-0 lg:space-y-2 xl:space-y-0 xl:space-x-3 flex-shrink-0">
                      <button className="px-3 py-2 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium border border-gray-300 hover:bg-gray-50 flex items-center justify-center space-x-2 transition-colors">
                        <Filter size={14} />
                        <span>Filter</span>
                      </button>
                      <button className="px-3 py-2 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                        Contact Student
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium flex items-center justify-center space-x-2 transition-colors">
                        <Download size={14} />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to account for overlapping profile section */}
      <div className="h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64"></div>

      {/* Content Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Mobile Cards View (xs to md) */}
            <div className="block lg:hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="text-sm sm:text-base font-medium text-gray-800">
                  Academic Performance
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {studentData.courses.map((course) => (
                  <div key={course.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-sm sm:text-base font-medium text-gray-900">
                          {course.subject}
                        </h4>
                        <p className="text-xs text-gray-500">SN: {course.id}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm sm:text-base font-bold text-green-600">
                          {course.final}
                        </div>
                        <div className="text-xs text-gray-500">Final Grade</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Term 1</div>
                        <div className="text-sm font-medium text-green-600">
                          {course.term1}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Term 2</div>
                        <div className="text-sm font-medium text-green-600">
                          {course.term2}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Term 3</div>
                        <div className="text-sm font-medium text-green-600">
                          {course.term3}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded px-3 py-2">
                      <div className="text-xs text-gray-500 mb-1">
                        Evaluation
                      </div>
                      <div className="text-xs sm:text-sm text-gray-700">
                        {course.evaluation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table View (lg and up) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-16">
                      SN
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Term 1
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Term 2
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Term 3
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Final Grade
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Evaluation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {studentData.courses.map((course) => (
                    <tr
                      key={course.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {course.subject}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {course.term1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {course.term2}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {course.term3}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                        {course.final}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.evaluation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
