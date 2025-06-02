/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";
import SideBar from "../components/SideBar";
import DashboardHeader from "../components/DashboardHeader";

const subjects = [
  "Mathematics", "English", "Biology", "Physics", "Yoruba", "Chemistry", "Further Mathematics", "Animal Husbandry", "Geography"
];

const initialChartData = subjects.map((subject, i) => ({
  name: subject,
  first: 80 + Math.round(Math.random() * 15),
  second: 85 + Math.round(Math.random() * 10),
  third: 80 + Math.round(Math.random() * 15),
}));

const subjectMarks = [
  {
    subject: "Mathematics",
    theory: "35/40",
    practical: "38/40",
    assignment: "7/10",
    attendance: "80%",
    total: "94/100",
  },
  {
    subject: "English Language",
    theory: "30/40",
    practical: "35/40",
    assignment: "8/10",
    attendance: "90%",
    total: "95/100",
  },
  {
    subject: "Biology",
    theory: "28/40",
    practical: "34/40",
    assignment: "7/10",
    attendance: "85%",
    total: "84/100",
  },
  {
    subject: "Physics",
    theory: "33/40",
    practical: "38/40",
    assignment: "8/10",
    attendance: "82%",
    total: "94/100",
  },
  {
    subject: "Yoruba",
    theory: "33/40",
    practical: "38/40",
    assignment: "8/10",
    attendance: "82%",
    total: "94/100",
  },
  {
    subject: "Chemistry",
    theory: "33/40",
    practical: "38/40",
    assignment: "8/10",
    attendance: "82%",
    total: "94/100",
  },
  {
    subject: "Further Mathematics",
    theory: "33/40",
    practical: "38/40",
    assignment: "8/10",
    attendance: "82%",
    total: "94/100",

  },
  {
    subject: "Animal Husbandry",
    theory: "33/40",
    practical: "38/40",
    assignment: "8/10",
    attendance: "82%",
    total: "94/100",
  },
  {
    subject: "Geography",
    theory: "33/40",
    practical: "38/40",
    assignment: "8/10",
    attendance: "82%",
    total: "94/100",
  },
];
const topMarks = [
  {
    subject: "Mathematics",
    theory: "35/40",
    practical: "38/40",
    assignment: "7/10",
    attendance: "80%",
    total: "94/100",
  },
  {
    subject: "English Language",
    theory: "30/40",
    practical: "35/40",
    assignment: "8/10",
    attendance: "90%",
    total: "95/100",
  },
  {
    subject: "Biology",
    theory: "28/40",
    practical: "34/40",
    assignment: "7/10",
    attendance: "85%",
    total: "84/100",
  },
  {
    subject: "Physics",
    theory: "33/40",
    practical: "38/40",
    assignment: "8/10",
    attendance: "82%",
    total: "94/100",
  },
];

export default function ParentResult() {
  const [chartData, setChartData] = useState(initialChartData);

  // Simulate real-time chart updates
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) =>
        prev.map((item) => ({
          ...item,
          first: Math.max(60, Math.min(100, item.first + (Math.random() - 0.5) * 2)),
          second: Math.max(60, Math.min(100, item.second + (Math.random() - 0.5) * 2)),
          third: Math.max(60, Math.min(100, item.third + (Math.random() - 0.5) * 2)),
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}

      <SideBar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10">
        {/* Header */}

        <DashboardHeader text='Performance Insight' holder="Search Results" />
        {/* Chart and Side Info */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chart Card */}
          <div className="bg-white rounded-2xl shadow p-4 flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <ReferenceLine y={50} stroke="#F87171" strokeWidth={2} />
                <Line
                  type="monotone"
                  dataKey="first"
                  name="1st Term Exam - Jan 2024"
                  stroke="#FBBF24"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="second"
                  name="2nd Term Exam - April 2024"
                  stroke="#22C55E"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="third"
                  name="3rd Term Exam - September 2024"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            {/* Score Cards on Chart */}
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
              <div className="bg-white rounded-xl shadow px-6 py-3 border border-gray-100 text-center">
                <div className="text-xs text-gray-500">Overall First Term Score</div>
                <div className="text-2xl font-bold text-yellow-500">90/100</div>
                <div className="text-blue-700 font-semibold">Pass</div>
              </div>
              <div className="bg-white rounded-xl shadow px-6 py-3 border border-gray-100 text-center">
                <div className="text-xs text-gray-500">Overall Second Term Score</div>
                <div className="text-2xl font-bold text-green-500">95/100</div>
                <div className="text-blue-700 font-semibold">Pass</div>
              </div>
              <div className="bg-white rounded-xl shadow px-6 py-3 border border-gray-100 text-center">
                <div className="text-xs text-gray-500">Overall Third Term Score</div>
                <div className="text-2xl font-bold text-blue-700">90/100</div>
                <div className="text-blue-700 font-semibold">Pass</div>
              </div>
            </div>
          </div>

          {/* Side Info */}
          <div className="flex flex-col gap-6 w-full lg:w-1/3">
            {/* Top 4 Marks */}
            <div className="bg-white rounded-2xl shadow p-4">
              <div className="font-semibold mb-2 text-gray-700">Top 4 Marks</div>
              <hr className="bg-gray-500 mt-2 mb-3 rounded " />
              {topMarks.map((s, i) => (
                <div key={s.subject} className="mb-2">
                  <div className="flex justify-between text-sm">
                    <span className={i === 2 ? "font-semibold text-green-700" : ""}>{s.subject}</span>
                    <span className="font-semibold">{s.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${i === 0 ? "bg-green-500" : i === 1 ? "bg-blue-500" : i === 2 ? "bg-yellow-400" : "bg-green-300"}`}
                      style={{ width: `${parseInt(s.total) || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            {/* Position in Session */}
            <div className="bg-white rounded-2xl shadow p-4">
              <div className="font-semibold mb-2 text-gray-700">Position in this session</div>
              <hr className="bg-gray-500 mt-2 mb-3 rounded " />
              <div className="text-sm mb-2">
                Merit Position - <span className="font-semibold">1st</span>
              </div>
              <ul className="text-xs text-gray-500 mb-4">
                <li>
                  <span className="material-icons text-base align-middle text-gray-500">check</span>
                  &nbsp;Theory - 450/500
                </li>
                <li>
                  <span className="material-icons text-base align-middle text-gray-500">check</span>
                  &nbsp;Practical - 380/500
                </li>
              </ul>
              <button className="w-full bg-blue-700 text-white rounded-sm py-2 font-semibold flex items-center justify-center gap-2">
                <span className="material-icons text-white">trending_up</span>
                Total Mark - 830/1000
              </button>
            </div>
          </div>
        </div>

        {/* All Subject Marks Table */}
        <div className="bg-white rounded-2xl shadow p-4 mt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <div className="font-semibold text-gray-700">All Subject Marks</div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-sm text-xs font-medium">
                <span className="material-icons text-base">import_contacts</span>
                Total Subject <span className="bg-gray-200 rounded px-2">{subjectMarks.length}</span>
              </button>
              <button className="flex items-center gap-1 px-3 py-1 bg-blue-700 text-white rounded-sm text-xs font-medium">
                <span className="material-icons text-base">download</span>
                View Transcript
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-2 px-3 text-left">SUBJECT NAME</th>
                  <th className="py-2 px-3 text-left">THEORY</th>
                  <th className="py-2 px-3 text-left">PRACTICAL</th>
                  <th className="py-2 px-3 text-left">ASSIGNMENT</th>
                  <th className="py-2 px-3 text-left">ATTENDANCE</th>
                  <th className="py-2 px-3 text-left">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {subjectMarks.map((s) => (
                  <tr key={s.subject} className="border-b border-gray-300 border-lg">
                    <td className="py-2 px-3">{s.subject}</td>
                    <td className="py-2 px-3">{s.theory}</td>
                    <td className="py-2 px-3">{s.practical}</td>
                    <td className="py-2 px-3">{s.assignment}</td>
                    <td className="py-2 px-3">{s.attendance}</td>
                    <td className="py-2 px-3">
                      <span className={`inline-block px-3 py-1 rounded-sm font-semibold text-white bg-blue-800`}>
                        {s.total}
                      </span>
                      {/* ${i === 0 ? "bg-blue-700" : "bg-blue-400"} */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}