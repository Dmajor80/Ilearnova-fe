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
      subject: "Physics",
      theory: "33/40",
      practical: "38/40",
      assignment: "8/10",
      attendance: "82%",
      total: "84/100",
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
      subject: "Physics",
      theory: "33/40",
      practical: "38/40",
      assignment: "8/10",
      attendance: "82%",
      total: "84/100",
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
      subject: "Physics",
      theory: "33/40",
      practical: "38/40",
      assignment: "8/10",
      attendance: "82%",
      total: "84/100",
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
      subject: "Physics",
      theory: "33/40",
      practical: "38/40",
      assignment: "8/10",
      attendance: "82%",
      total: "84/100",
    },
    {
      subject: "Physics",
      theory: "33/40",
      practical: "38/40",
      assignment: "8/10",
      attendance: "82%",
      total: "84/100",
    },
  ];

  const topMarks = [
    { subject: "Mathematics", score: "90/100" },
    { subject: "English Language", score: "88/100" },
    { subject: "Biology", score: "84/100" },
    { subject: "Civic Education", score: "80/100" },
  ];
  const handleBackToTranscript = () => {
    Navigate("/student-dashboard/transcript");
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Result</h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Chart Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-6 mb-6">
              <div className="w-[604px] h-[557px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                    />
                    <YAxis
                      domain={[80, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="overall"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="second"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="third"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-8 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Overall First Term Score
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    95/100
                  </span>
                  <span className="text-sm text-green-600">Pass</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Overall Second Term Score
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    95/100
                  </span>
                  <span className="text-sm text-green-600">Pass</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Overall Third Term Score
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    90/100
                  </span>
                  <span className="text-sm text-green-600">Pass</span>
                </div>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div
              className="bg-white rounded-[20px] border overflow-hidden w-[1000px]"
              style={{ border: "1px solid rgba(163, 174, 208, 1)" }}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-medium">All Subject Marks</h2>
                <div className="flex gap-2">
                  <select className="border rounded px-3 py-1 text-sm">
                    <option> Total Subject - 10</option>
                  </select>
                  <button
                    className=" flex items-center w-[138px] h-[40px]  text-white px-7 py-1 rounded text-sm"
                    style={{ backgroundColor: "rgba(18, 40, 164, 1)" }}
                    onClick={handleBackToTranscript}
                  >
                    <Download size={16} />
                    View Transcript
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-medium text-[14px]">
                        SUBJECT NAME
                      </th>
                      <th className="text-left p-3 font-medium text-[14px]">
                        THEORY
                      </th>
                      <th className="text-left p-3 font-medium text-[14px]">
                        PRACTICAL
                      </th>
                      <th className="text-left p-3 font-medium text-[14px]">
                        ASSIGNMENT
                      </th>
                      <th className="text-left p-3 font-medium text-[14px]">
                        ATTENDANCE
                      </th>
                      <th className="text-left p-3 font-medium text-[14px]">
                        TOTAL
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectData.map((subject, index) => (
                      <tr key={index} className="">
                        <td
                          className="p-3 font-medium text-[14px]"
                          style={{ backgroundColor: "rgba(245, 248, 254, 1)" }}
                        >
                          {subject.subject}
                        </td>
                        <td
                          className="p-3 text-[14px]"
                          style={{
                            backgroundColor: "rgba(245, 248, 254, 1)",
                            color: "rgba(51, 51, 51, 1)",
                          }}
                        >
                          {subject.theory}
                        </td>
                        <td
                          className="p-3 text-[14px]"
                          style={{
                            backgroundColor: "rgba(245, 248, 254, 1)",
                            color: "rgba(51, 51, 51, 1)",
                          }}
                        >
                          {subject.practical}
                        </td>
                        <td
                          className="p-3 text-[14px]"
                          style={{
                            backgroundColor: "rgba(245, 248, 254, 1)",
                            color: "rgba(51, 51, 51, 1)",
                          }}
                        >
                          {subject.assignment}
                        </td>
                        <td
                          className="p-3 text-[14px]"
                          style={{
                            backgroundColor: "rgba(245, 248, 254, 1)",
                            color: "rgba(51, 51, 51, 1)",
                          }}
                        >
                          {subject.attendance}
                        </td>
                        <td
                          className="p-3 text-[14px] w-[64px] h-[40px]"
                          style={{
                            backgroundColor: "rgba(245, 248, 254, 1)",
                            color: "rgba(51, 51, 51, 1)",
                          }}
                        >
                          <span
                            className=" text-white px-3 py-1 rounded text-sm font-medium "
                            style={{ backgroundColor: "rgba(18, 40, 164, 1)" }}
                          >
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
          <div className="space-y-6">
            {/* Top 4 Marks */}
            <div
              className=" rounded-lg  p-4 shadow-md w-[306px] h-[200px]"
              style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
            >
              <h3
                className="font-medium text-[18px] mb-4 "
                style={{ borderBottom: "1px solid rgba(174, 174, 174, 1)" }}
              >
                Top 4 Marks
              </h3>
              <div className="space-y-3">
                {topMarks.map((mark, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: "rgba(51, 51, 51, 1)" }}
                    >
                      {mark.subject}
                    </span>
                    <span
                      className="text-[12px]"
                      style={{ color: "rgba(105, 105, 105, 1)" }}
                    >
                      {mark.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Position */}
            <div
              className=" rounded-lg  p-4 shadow-md w-[306px] h-[200px]"
              style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
            >
              <h3
                className="font-medium text-[18px] mb-4 "
                style={{ borderBottom: "1px solid rgba(174, 174, 174, 1)" }}
              >
                Position in this session
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Merit Position - 1st
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span
                    className="text-sm"
                    style={{ color: "rgba(105, 105, 105, 1)" }}
                  >
                    Theory - 340/1000
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span
                    className="text-sm"
                    style={{ color: "rgba(105, 105, 105, 1)" }}
                  >
                    Practical - 340/500
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 ">
                <div
                  className=" text-white text-center py-2 rounded shadow-md"
                  style={{ backgroundColor: "rgba(18, 40, 164, 1)" }}
                >
                  <span
                    className="text-[18px]"
                    style={{ color: "rgba(255, 255, 255, 1)" }}
                  >
                    Total Mark - 830/1000
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
