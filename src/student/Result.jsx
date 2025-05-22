import React from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { User, CheckCircle } from "lucide-react";

const Result = () => {
  // Sample data for the performance chart
  const performanceData = [
    { month: "Jan", overall: 95, second: 88, third: 92 },
    { month: "Feb", overall: 92, second: 90, third: 89 },
    { month: "Mar", overall: 96, second: 85, third: 91 },
    { month: "Apr", overall: 90, second: 92, third: 88 },
    { month: "May", overall: 94, second: 89, third: 90 },
    { month: "Jun", overall: 91, second: 87, third: 93 },
    { month: "Jul", overall: 93, second: 91, third: 89 },
    { month: "Aug", overall: 89, second: 88, third: 91 },
    { month: "Sep", overall: 92, second: 90, third: 87 },
    { month: "Oct", overall: 88, second: 85, third: 89 },
    { month: "Nov", overall: 90, second: 87, third: 91 },
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
  ];

  const topMarks = [
    { subject: "Mathematics", score: "90/100" },
    { subject: "English Language", score: "88/100" },
    { subject: "Biology", score: "84/100" },
    { subject: "Civic Education", score: "80/100" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Result</h1>
          <div className="flex items-center gap-2">
            <User className="w-8 h-8 bg-orange-400 text-white rounded-full p-1" />
            <span className="text-sm text-gray-600">Priscilla</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Chart Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-6 mb-6">
              <div className="h-64">
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

            {/* Total Score */}
            <div className="bg-blue-600 text-white text-center py-4 rounded-lg mb-6">
              <div className="text-3xl font-bold">694 x 557</div>
            </div>

            {/* Subject Marks Table */}
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">All Subject Marks</h2>
                <div className="flex gap-2">
                  <select className="border rounded px-3 py-1 text-sm">
                    <option>Total Subject - 10</option>
                  </select>
                  <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm">
                    View Transcript
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-medium text-gray-600">
                        SUBJECT NAME
                      </th>
                      <th className="text-left p-3 font-medium text-gray-600">
                        THEORY
                      </th>
                      <th className="text-left p-3 font-medium text-gray-600">
                        PRACTICAL
                      </th>
                      <th className="text-left p-3 font-medium text-gray-600">
                        ASSIGNMENT
                      </th>
                      <th className="text-left p-3 font-medium text-gray-600">
                        ATTENDANCE
                      </th>
                      <th className="text-left p-3 font-medium text-gray-600">
                        TOTAL
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectData.map((subject, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3 font-medium">{subject.subject}</td>
                        <td className="p-3">{subject.theory}</td>
                        <td className="p-3">{subject.practical}</td>
                        <td className="p-3">{subject.assignment}</td>
                        <td className="p-3">{subject.attendance}</td>
                        <td className="p-3">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
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
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-4">Top 4 Marks</h3>
              <div className="space-y-3">
                {topMarks.map((mark, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-600">
                      {mark.subject}
                    </span>
                    <span className="font-medium">{mark.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Position */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-4">Position in this session</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Merit Position - 1st
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Theory - 340/1000</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Practical - 340/500</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="bg-blue-600 text-white text-center py-2 rounded">
                  <span className="font-bold">Total Mark - 830/1000</span>
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
