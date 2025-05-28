import React from "react";
import DashboardHeader from "./DashboardHeader";
import SideBar from "./Sidebar"



const transcriptData = [
  {
    sn: "01",
    subject: "Mathematics",
    term1: "85% (A)",
    term2: "88% (A)",
    term3: "90% (A)",
    final: "90% (A)",
    remark: "Excellent performance",
  },
  {
    sn: "02",
    subject: "English Language",
    term1: "78% (B)",
    term2: "82% (A)",
    term3: "80% (B+)",
    final: "80% (B+)",
    remark: "Good effort",
  },
  {
    sn: "03",
    subject: "Physics",
    term1: "90% (A)",
    term2: "88% (A)",
    term3: "85% (A)",
    final: "88% (A)",
    remark: "Outstanding",
  },
];

export default function Transcript() {
  return (
       <div className="flex min-h-screen gap-2 bg-[#f5f8fe]">
       <SideBar/>
    <div className="min-h-screen bg-[#f5f8fe] px-2 md:px-0 py-4">
      {/* Header */}
      {/* <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500">Page / Parent</p>
            <h1 className="text-2xl font-semibold text-gray-800">Transcripts</h1>
            <p className="text-blue-700 mt-2 font-medium">Transcripts</p>
            <p className="text-sm text-gray-500">View and download your academic history.</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="search announcement"
                className="border border-gray-300 rounded-full py-2 px-4 pl-10 w-36 md:w-56"
                aria-label="Search"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
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
              src="/profile.png"
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </div>
      </div> */}
      <DashboardHeader holder="Transcripts" text="Transcript" />

      {/* Banner & Profile */}
      {/* <div className="max-w-4xl mx-auto mt-4">
        <div className="relative">
          Banner
          <div className="w-full h-32 md:h-36 rounded-lg overflow-hidden bg-[#1736a4] flex items-center justify-center">
            <div className="absolute left-0 top-0 w-32 h-28 bg-[#ffd600] rounded-br-full"></div>
            <div className="absolute left-0 bottom-0 w-20 h-16 bg-[#2ecc71] rounded-tr-full"></div>
            <div className="absolute right-0 top-0 w-24 h-24 bg-[#ffd600] rounded-bl-full"></div>
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-white rounded-tl-full"></div>
            <div className="w-full h-full bg-[#1736a4]"></div>
          </div>
          Profile
          <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <img
              src="/profile.png"
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="mt-2 text-center">
              <div className="font-semibold text-[#1736a4] text-lg">Priscilla Daniel</div>
              <div className="text-xs text-gray-500">Ilearnova/Stu/001</div>
              <div className="text-xs text-gray-500">Grade 6</div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Summary */}
      <div className="max-w-4xl mx-auto mt-20 md:mt-16 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-700"></span>
            <span>Top Performing Subject: <span className="font-semibold">Physics - 90% (A)</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
            <span>Lowest Performing Subject: <span className="font-semibold">Physical Education - 74% (B)</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
            <span>Overall Average Grade: <span className="font-semibold">88% (A)</span></span>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex gap-2 mt-4 md:mt-0">
          <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-sm text-xs font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
            </svg>
            Filter
          </button>
          <button className="flex items-center gap-1 px-3 py-1 bg-blue-700 text-white rounded-sm text-xs font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Contact Teacher
          </button>
          <button className="flex items-center gap-1 px-3 py-1 bg-blue-700 text-white rounded-sm text-xs font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Download
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-4xl mx-auto mt-6 bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-xs md:text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-3 text-left">SN</th>
              <th className="py-2 px-3 text-left">Subject Name</th>
              <th className="py-2 px-3 text-left">Term 1</th>
              <th className="py-2 px-3 text-left">Term 2</th>
              <th className="py-2 px-3 text-left">Term 3</th>
              <th className="py-2 px-3 text-left">Final Grade</th>
              <th className="py-2 px-3 text-left">Remark</th>
            </tr>
          </thead>
          <tbody>
            {transcriptData.map((row, idx) => (
              <tr key={row.sn} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-2 px-3">{row.sn}</td>
                <td className="py-2 px-3">{row.subject}</td>
                <td className="py-2 px-3">{row.term1}</td>
                <td className="py-2 px-3">{row.term2}</td>
                <td className="py-2 px-3">{row.term3}</td>
                <td className="py-2 px-3 font-semibold text-green-600">{row.final}</td>
                <td className="py-2 px-3">{row.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}