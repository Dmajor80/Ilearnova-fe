import React from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { User, CheckCircle, Download, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Result = () => {
  const Navigate = useNavigate();
  // Sample data for the performance chart
  const performanceData = [
    { month: "Mathematics", overall: 95, second: 88, third: 92 },
    { month: "English", overall: 92, second: 90, third: 89 },
    { month: "Biology", overall: 96, second: 85, third: 91 },
    { month: "Physics", overall: 90, second: 92, third: 88 },
    { month: "Civic Education", overall: 94, second: 89, third: 90 },
    { month: "Chemistry", overall: 91, second: 87, third: 93 },
    { month: "Yoruba", overall: 93, second: 91, third: 89 },
    { month: "Agric", overall: 89, second: 88, third: 91 },
    { month: "Crs", overall: 92, second: 90, third: 87 },
    { month: "F-Math", overall: 88, second: 85, third: 89 },
    { month: "Animal-husb", overall: 90, second: 87, third: 91 },
    { month: "Dec", overall: 91, second: 89, third: 88 },
  ];

  const subjectData = [
    {
      subject: "Mathematics",
      theory: "38/40",
      practical: "38/40",
      assignment: "7/10",
      attendance: "80%",
      total: "94/100",
    },
    {
      subject: "English Language",
      theory: "36/40",
      practical: "36/40",
      assignment: "9/10",
      attendance: "80%",
      total: "90/100",
    },
    {
      subject: "Biology",
      theory: "36/40",
      practical: "40/40",
      assignment: "7/10",
      attendance: "75%",
      total: "88/100",
    },
    {
      subject: "Physics",
      theory: "33/40",
      practical: "38/40",
      assignment: "8/10",
      attendance: "82%",
      total: "84/100",
    },
    {
      subject: "Chemistry",
      theory: "35/40",
      practical: "37/40",
      assignment: "8/10",
      attendance: "85%",
      total: "86/100",
    },
    {
      subject: "Civic Education",
      theory: "32/40",
      practical: "35/40",
      assignment: "9/10",
      attendance: "78%",
      total: "82/100",
    },
    {
      subject: "Yoruba",
      theory: "34/40",
      practical: "36/40",
      assignment: "8/10",
      attendance: "83%",
      total: "85/100",
    },
    {
      subject: "Agriculture",
      theory: "31/40",
      practical: "39/40",
      assignment: "7/10",
      attendance: "79%",
      total: "81/100",
    },
    {
      subject: "CRS",
      theory: "37/40",
      practical: "35/40",
      assignment: "9/10",
      attendance: "87%",
      total: "89/100",
    },
    {
      subject: "Further Math",
      theory: "29/40",
      practical: "33/40",
      assignment: "6/10",
      attendance: "76%",
      total: "78/100",
    },
    {
      subject: "Animal Husbandry",
      theory: "33/40",
      practical: "38/40",
      assignment: "8/10",
      attendance: "81%",
      total: "83/100",
    },
    {
      subject: "Home Economics",
      theory: "35/40",
      practical: "37/40",
      assignment: "9/10",
      attendance: "84%",
      total: "87/100",
    },
  ];

  const topMarks = [
    { subject: "Mathematics", score: "94/100" },
    { subject: "English Language", score: "90/100" },
    { subject: "Biology", score: "88/100" },
    { subject: "Civic Education", score: "89/100" },
  ];

  const handleBackToTranscript = () => {
    Navigate("/student-dashboard/transcript");
    // console.log("Navigate to transcript");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Result
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Performance Chart Section */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Chart Container */}
            <div className="bg-white rounded-lg border p-3 sm:p-4 lg:p-6">
              <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#6B7280" }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                    />
                    <YAxis
                      domain={[80, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#6B7280" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="overall"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="second"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="third"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Legend - Responsive */}
              <div className="flex flex-col lg:flex-row justify-center gap-2 lg:gap-6 xl:gap-8 mt-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Overall First Term</span>
                  <span className="font-bold text-green-600">95/100</span>
                  <span className="text-green-600">Pass</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Overall Second Term</span>
                  <span className="font-bold text-green-600">95/100</span>
                  <span className="text-green-600">Pass</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">Overall Third Term</span>
                  <span className="font-bold text-green-600">90/100</span>
                  <span className="text-green-600">Pass</span>
                </div>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl border border-blue-200 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 border-b gap-3 sm:gap-0">
                <h2 className="text-base sm:text-lg font-medium">
                  All Subject Marks
                </h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select className="border rounded px-2 sm:px-3 py-1 text-xs sm:text-sm">
                    <option>Total Subject - 12</option>
                  </select>
                  <button
                    className="flex items-center justify-center gap-1 sm:gap-2 bg-blue-800 text-white px-3 sm:px-4 py-2 rounded text-xs sm:text-sm font-medium hover:bg-blue-900 transition-colors"
                    onClick={handleBackToTranscript}
                  >
                    <Download size={14} />
                    <span className="hidden sm:inline">View Transcript</span>
                    <span className="sm:hidden">Transcript</span>
                  </button>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="block lg:hidden">
                <div className="divide-y divide-gray-200">
                  {subjectData.map((subject, index) => (
                    <div key={index} className="p-4 bg-blue-50">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-sm text-gray-900">
                          {subject.subject}
                        </h3>
                        <span className="bg-blue-800 text-white px-2 py-1 rounded text-xs font-medium">
                          {subject.total}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-gray-500">Theory:</span>
                          <span className="ml-1 text-gray-700">
                            {subject.theory}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Practical:</span>
                          <span className="ml-1 text-gray-700">
                            {subject.practical}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Assignment:</span>
                          <span className="ml-1 text-gray-700">
                            {subject.assignment}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Attendance:</span>
                          <span className="ml-1 text-gray-700">
                            {subject.attendance}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-medium text-sm">
                        SUBJECT NAME
                      </th>
                      <th className="text-left p-3 font-medium text-sm">
                        THEORY
                      </th>
                      <th className="text-left p-3 font-medium text-sm">
                        PRACTICAL
                      </th>
                      <th className="text-left p-3 font-medium text-sm">
                        ASSIGNMENT
                      </th>
                      <th className="text-left p-3 font-medium text-sm">
                        ATTENDANCE
                      </th>
                      <th className="text-left p-3 font-medium text-sm">
                        TOTAL
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectData.map((subject, index) => (
                      <tr key={index} className="hover:bg-blue-25">
                        <td className="p-3 font-medium text-sm bg-blue-50 text-gray-800">
                          {subject.subject}
                        </td>
                        <td className="p-3 text-sm bg-blue-50 text-gray-600">
                          {subject.theory}
                        </td>
                        <td className="p-3 text-sm bg-blue-50 text-gray-600">
                          {subject.practical}
                        </td>
                        <td className="p-3 text-sm bg-blue-50 text-gray-600">
                          {subject.assignment}
                        </td>
                        <td className="p-3 text-sm bg-blue-50 text-gray-600">
                          {subject.attendance}
                        </td>
                        <td className="p-3 text-sm bg-blue-50">
                          <span className="bg-blue-800 text-white px-3 py-1 rounded text-sm font-medium">
                            {subject.total}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Top 4 Marks */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-medium text-base sm:text-lg mb-4 pb-2 border-b border-gray-300">
                Top 4 Marks
              </h3>
              <div className="space-y-3">
                {topMarks.map((mark, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {mark.subject}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {mark.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Position */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-medium text-base sm:text-lg mb-4 pb-2 border-b border-gray-300">
                Position in this session
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Merit Position - 1st
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-500">
                    Theory - 340/1000
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-500">
                    Practical - 340/500
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4">
                <div className="bg-blue-800 text-white text-center py-3 rounded shadow-md">
                  <span className="text-sm sm:text-base font-medium">
                    Total Mark - 830/1000
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Stats Card for larger screens */}
            <div className="hidden xl:block bg-white rounded-lg shadow-md p-4">
              <h3 className="font-medium text-lg mb-4 pb-2 border-b border-gray-300">
                Performance Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Score:</span>
                  <span className="text-sm font-medium text-blue-800">
                    85.8%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Subjects Passed:
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    12/12
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Grade:</span>
                  <span className="text-sm font-medium text-blue-800">A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Class Rank:</span>
                  <span className="text-sm font-medium text-orange-600">
                    1st
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
