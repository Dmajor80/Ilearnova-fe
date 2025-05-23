import { useState } from "react";

const subjectMarks = [
  {
    name: "Mathematics",
    theory: 35,
    practical: 38,
    assignment: 7,
    attendance: "80%",
    score: 94,
  },
  {
    name: "English Language",
    theory: 30,
    practical: 34,
    assignment: 8,
    attendance: "80%",
    score: 89,
  },
  {
    name: "Biology",
    theory: 32,
    practical: 34,
    assignment: 7,
    attendance: "75%",
    score: 84,
  },
  {
    name: "Civic Education",
    theory: 32,
    practical: 32,
    assignment: 6,
    attendance: "82%",
    score: 82,
  },
];

export default function ResultDashboard() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-blue-900">Exam result</h2>
          <p className="text-gray-500 text-sm">Result</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-gray-300 rounded-full py-2 px-4 pl-10 w-48 md:w-64"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <img
            src="/api/placeholder/32/32"
            alt="User"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart and summary */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h3 className="font-semibold text-lg text-blue-900">Exam Performance</h3>
            </div>
            {/* Placeholder for chart */}
            <div className="h-56 w-full flex items-center justify-center">
              {/* Replace with chart library */}
              <img
                src="https://placehold.co/600x220?text=Chart"
                alt="Chart"
                className="w-full h-full object-contain rounded"
              />
            </div>
            {/* Score highlights */}
            <div className="flex flex-col md:flex-row gap-4 mt-4 justify-center">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 px-4 py-2 rounded flex-1 text-center">
                <div className="text-yellow-500 font-bold text-xl">90/100</div>
                <div className="text-gray-700 text-sm">Overall First Term Score</div>
                <div className="text-green-600 text-xs">Pass</div>
              </div>
              <div className="bg-green-50 border-l-4 border-green-400 px-4 py-2 rounded flex-1 text-center">
                <div className="text-green-500 font-bold text-xl">95/100</div>
                <div className="text-gray-700 text-sm">Overall Second Term Score</div>
                <div className="text-green-600 text-xs">Pass</div>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-400 px-4 py-2 rounded flex-1 text-center">
                <div className="text-blue-500 font-bold text-xl">90/100</div>
                <div className="text-gray-700 text-sm">Overall Third Term Score</div>
                <div className="text-green-600 text-xs">Pass</div>
              </div>
            </div>
          </div>

          {/* All Subject Marks */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
              <h3 className="font-semibold text-lg text-blue-900">All Subject Marks</h3>
              <div className="flex gap-2">
                <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
                  Total Subject <span className="font-bold">10</span>
                </button>
                <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm">
                  View Transcript
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-600">
                    <th className="py-2 px-3 text-left">SUBJECT NAME</th>
                    <th className="py-2 px-3 text-left">THEORY</th>
                    <th className="py-2 px-3 text-left">PRACTICAL</th>
                    <th className="py-2 px-3 text-left">ASSIGNMENT</th>
                    <th className="py-2 px-3 text-left">ATTENDANCE</th>
                    <th className="py-2 px-3 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {subjectMarks.map((subject, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2 px-3">{subject.name}</td>
                      <td className="py-2 px-3">{subject.theory}/40</td>
                      <td className="py-2 px-3">{subject.practical}/40</td>
                      <td className="py-2 px-3">{subject.assignment}/10</td>
                      <td className="py-2 px-3">{subject.attendance}</td>
                      <td className="py-2 px-3">
                        <span className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded">
                          {subject.score}/100
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-6">
          {/* Top 4 Marks */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg text-blue-900 mb-4">Top 4 Marks</h3>
            {subjectMarks.slice(0, 4).map((subject, idx) => (
              <div key={idx} className="mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">{subject.name}</span>
                  <span className="text-gray-600 text-sm">{subject.score}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full ${
                      idx === 0
                        ? "bg-green-500"
                        : idx === 1
                        ? "bg-blue-500"
                        : idx === 2
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                    style={{ width: `${subject.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Position in session */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg text-blue-900 mb-2">Position in this session</h3>
            <div className="mb-2">
              <span className="font-bold text-green-600">Merit Position - 1st</span>
            </div>
            <ul className="text-gray-700 text-sm mb-4">
              <li>✓ Theory - 450/500</li>
              <li>✓ Practical - 380/500</li>
            </ul>
            <button className="w-full bg-blue-50 text-blue-700 font-bold py-2 rounded mb-2">
              Total Mark - 830/1000
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}