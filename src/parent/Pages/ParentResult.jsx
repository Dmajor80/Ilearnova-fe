/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";
import DashboardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";


const subjects = [
  "Mathematics", "English", "Biology", "Physics", "Yoruba", "Chemistry", "Further Mathematics", "Animal Husbandry", "Geography"
];

const initialChartData = subjects.map((subject, i) => ({
  name: subject,
  first: 80 + Math.round(Math.random() * 15),
  second: 85 + Math.round(Math.random() * 10),
  third: 80 + Math.round(Math.random() * 15),
}));

// Children data (from dashboard)
const children = [
  {
    id: 1,
    name: "Priscilla Daniel",
    age: 10,
    classLevel: "Primary 5",
    institution: "Primary",
    school: "Sunshine Primary School"
  },
  {
    id: 2,
    name: "John Doe",
    age: 15,
    classLevel: "SS2",
    institution: "Secondary",
    school: "Bright Future Secondary School"
  },
  {
    id: 3,
    name: "Mary Johnson",
    age: 19,
    classLevel: "ND2",
    institution: "Polytechnic",
    school: "Federal Polytechnic, Lagos"
  },
  {
    id: 4,
    name: "Samuel Lee",
    age: 22,
    classLevel: "300 Level",
    institution: "University",
    school: "University of Ibadan"
  }
];

// Dummy results for each child and term
const childrenResults = {
  1: {
    "First Term": [
      { subject: "Mathematics", theory: "35/40", practical: "38/40", assignment: "7/10", attendance: "80%", total: "94/100" },
      { subject: "English", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
      { subject: "Basic Science", theory: "28/40", practical: "34/40", assignment: "7/10", attendance: "85%", total: "84/100" },
      { subject: "Basic Technology", theory: "28/40", practical: "34/40", assignment: "7/10", attendance: "85%", total: "84/100" },
      { subject: "Yoruba", theory: "28/40", practical: "34/40", assignment: "7/10", attendance: "85%", total: "84/100" },
      { subject: "Home Economics", theory: "28/40", practical: "34/40", assignment: "7/10", attendance: "85%", total: "84/100" },
      { subject: "Social Studies", theory: "28/40", practical: "34/40", assignment: "7/10", attendance: "85%", total: "84/100" },
      { subject: "Physical & Health Education", theory: "28/40", practical: "34/40", assignment: "7/10", attendance: "85%", total: "84/100" },
      { subject: "Christian Religous Studies", theory: "28/40", practical: "34/40", assignment: "7/10", attendance: "85%", total: "84/100" },
    ],
    "Second Term": [
      { subject: "Mathematics", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
      { subject: "English", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
      { subject: "Christian Religous Studies", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
      { subject: "Home Economics", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
      { subject: "Physical & Health Education", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
      { subject: "Yoruba", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
      { subject: "Social Studies", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
      { subject: "Basic Technology", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
      { subject: "Basic Science", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
    ],
    "Third Term": [
      { subject: "Mathematics", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
      { subject: "English", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
      { subject: "Christian Religous Studies", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
      { subject: "Home Economics", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
      { subject: "Physical & Health Education", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
      { subject: "Yoruba", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
      { subject: "Social Studies", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
      { subject: "Basic Technology", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
      { subject: "Basic Science", theory: "30/40", practical: "35/40", assignment: "8/10", attendance: "90%", total: "95/100" },
    ]
  },
  2: {
    "First Term": [
      { subject: "Mathematics", theory: "20/40", practical: "25/40", assignment: "5/10", attendance: "70%", total: "60/100" },
      { subject: "English", theory: "25/40", practical: "28/40", assignment: "6/10", attendance: "75%", total: "70/100" },
      { subject: "Biology", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Physics", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Yoruba", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },

      { subject: "Chemistry", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Further Mathematics", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Animal Husbandry", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Geography", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
    ],
    "Second Term": [
      { subject: "Mathematics", theory: "20/40", practical: "25/40", assignment: "5/10", attendance: "70%", total: "60/100" },
      { subject: "English", theory: "25/40", practical: "28/40", assignment: "6/10", attendance: "75%", total: "70/100" },
      { subject: "Biology", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Physics", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Yoruba", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },

      { subject: "Chemistry", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Further Mathematics", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Animal Husbandry", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Geography", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
    ],
    "Third Term": [
      { subject: "Mathematics", theory: "20/40", practical: "25/40", assignment: "5/10", attendance: "70%", total: "60/100" },
      { subject: "English", theory: "25/40", practical: "28/40", assignment: "6/10", attendance: "75%", total: "70/100" },
      { subject: "Biology", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Physics", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Yoruba", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },

      { subject: "Chemistry", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Further Mathematics", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Animal Husbandry", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Geography", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
    ]
  },
  3: {
    "First Term": [
      { subject: "Mathematics", theory: "20/40", practical: "25/40", assignment: "5/10", attendance: "70%", total: "60/100" },
      { subject: "English", theory: "25/40", practical: "28/40", assignment: "6/10", attendance: "75%", total: "70/100" },
      { subject: "Medical Imaging Technology", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Electronics", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "GNS 200", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },

      { subject: "Entrepreneurship", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Real Analysis", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Electron Engineering", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Food Safety", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
    ],
    "Second Term": [
     { subject: "Mathematics", theory: "20/40", practical: "25/40", assignment: "5/10", attendance: "70%", total: "60/100" },
      { subject: "English", theory: "25/40", practical: "28/40", assignment: "6/10", attendance: "75%", total: "70/100" },
      { subject: "Medical Imaging Technology", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Electronics", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "GNS 200", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },

      { subject: "Entrepreneurship", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Real Analysis", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Electron Engineering", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Food Safety", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
    ],
    "Third Term": [
     { subject: "Mathematics", theory: "20/40", practical: "25/40", assignment: "5/10", attendance: "70%", total: "60/100" },
      { subject: "English", theory: "25/40", practical: "28/40", assignment: "6/10", attendance: "75%", total: "70/100" },
      { subject: "Medical Imaging Technology", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Electronics", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "GNS 200", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },

      { subject: "Entrepreneurship", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Real Analysis", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Electron Engineering", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
      { subject: "Food Safety", theory: "22/40", practical: "27/40", assignment: "5/10", attendance: "72%", total: "65/100" },
    ]
  },
  4: {
    "First Term": [
      { subject: "300 Level", theory: "35/40", practical: "36/40", assignment: "8/10", attendance: "85%", total: "87/100" },
      { subject: "200 Level", theory: "36/40", practical: "37/40", assignment: "9/10", attendance: "88%", total: "90/100" },
    ],
    "Second Term": [
      { subject: "300 Level", theory: "36/40", practical: "37/40", assignment: "9/10", attendance: "87%", total: "89/100" },
      { subject: "200 Level", theory: "37/40", practical: "38/40", assignment: "10/10", attendance: "90%", total: "92/100" },
    ],
    "Third Term": [
      { subject: "300 Level", theory: "37/40", practical: "38/40", assignment: "10/10", attendance: "89%", total: "91/100" },
      { subject: "200 Level", theory: "38/40", practical: "39/40", assignment: "10/10", attendance: "91%", total: "93/100" },
    ]
  }
};

function downloadCSV(data, childName, term) {
  const header = Object.keys(data[0]).join(",");
  const rows = data.map(row => Object.values(row).join(","));
  const csvContent = [header, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${childName.replace(/\s/g, "_")}_${term.replace(/\s/g, "_")}_result.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Helper to get top 4 marks for side info
function getTopMarks(subjectMarks) {
  return [...subjectMarks]
    .sort((a, b) => parseInt(b.total) - parseInt(a.total))
    .slice(0, 4);
}

function ParentResult() {
  const [selectedChildId, setSelectedChildId] = useState(children[0].id);
  const [selectedTerm, setSelectedTerm] = useState("First Term");
  const child = children.find(c => c.id === selectedChildId);
  const terms = Object.keys(childrenResults[selectedChildId]);
  const subjectMarks = childrenResults[selectedChildId][selectedTerm];
  const [chartData, setChartData] = useState(initialChartData);
  const topMarks = getTopMarks(subjectMarks);

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

      <SideMenu />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10">
        {/* Header */}

        <DashboardHeader text='Performance Insight' holder="Search Results" />
        {/* Child and Term Selectors */}
        <div className="flex flex-wrap gap-4 mb-6 mt-25">
          <div>
            <label className="block text-xs font-semibold mb-1">Select Child:</label>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={selectedChildId}
              onChange={e => {
                setSelectedChildId(Number(e.target.value));
                setSelectedTerm("First Term");
              }}
            >
              {children.map(child => (
                <option key={child.id} value={child.id}>{child.name} ({child.classLevel})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Select Term:</label>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={selectedTerm}
              onChange={e => setSelectedTerm(e.target.value)}
            >
              {terms.map(term => (
                <option key={term} value={term}>{term}</option>
              ))}
            </select>
          </div>
          <button
            className="bg-blue-700 text-white rounded px-4 py-2 text-sm font-semibold mt-6"
            onClick={() => downloadCSV(subjectMarks, child.name, selectedTerm)}
          >
            Download Result (CSV)
          </button>
        </div>
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
            {/* in Session */}
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
                <a href="/parent-transcript">View Transcript</a>
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

export default ParentResult;
