import React, { useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";


// Dummy transcript data for 6 grades and 3 terms
const transcriptResults = {
  "Grade 1": [
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
      subject: "Physical Education",
      term1: "74% (B)",
      term2: "76% (B)",
      term3: "78% (B+)",
      final: "78% (B+)",
      remark: "Keep improving",
    },
  ],
  "Grade 2": [
    {
      sn: "01",
      subject: "Mathematics",
      term1: "80% (A)",
      term2: "85% (A)",
      term3: "87% (A)",
      final: "87% (A)",
      remark: "Great job",
    },
    {
      sn: "02",
      subject: "English Language",
      term1: "75% (B)",
      term2: "78% (B)",
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
  ],
  "Grade 3": [
    {
      sn: "01",
      subject: "Mathematics",
      term1: "82% (A)",
      term2: "85% (A)",
      term3: "88% (A)",
      final: "88% (A)",
      remark: "Excellent",
    },
    {
      sn: "02",
      subject: "English Language",
      term1: "70% (C)",
      term2: "75% (B)",
      term3: "78% (B+)",
      final: "78% (B+)",
      remark: "Improving",
    },
    {
      sn: "03",
      subject: "Chemistry",
      term1: "88% (A)",
      term2: "90% (A)",
      term3: "92% (A+)",
      final: "92% (A+)",
      remark: "Excellent",
    },
  ],
  "Grade 4": [
    {
      sn: "01",
      subject: "Mathematics",
      term1: "85% (A)",
      term2: "87% (A)",
      term3: "89% (A)",
      final: "89% (A)",
      remark: "Very good",
    },
    {
      sn: "02",
      subject: "English Language",
      term1: "80% (B+)",
      term2: "82% (A)",
      term3: "85% (A)",
      final: "85% (A)",
      remark: "Good",
    },
    {
      sn: "03",
      subject: "Biology",
      term1: "90% (A)",
      term2: "92% (A+)",
      term3: "94% (A+)",
      final: "94% (A+)",
      remark: "Outstanding",
    },
  ],
  "Grade 5": [
    {
      sn: "01",
      subject: "Mathematics",
      term1: "88% (A)",
      term2: "90% (A)",
      term3: "92% (A+)",
      final: "92% (A+)",
      remark: "Excellent",
    },
    {
      sn: "02",
      subject: "English Language",
      term1: "85% (A)",
      term2: "87% (A)",
      term3: "89% (A)",
      final: "89% (A)",
      remark: "Very good",
    },
    {
      sn: "03",
      subject: "Geography",
      term1: "80% (B+)",
      term2: "82% (A)",
      term3: "85% (A)",
      final: "85% (A)",
      remark: "Good",
    },
  ],
  "Grade 6": [
    {
      sn: "01",
      subject: "Mathematics",
      term1: "90% (A)",
      term2: "92% (A+)",
      term3: "94% (A+)",
      final: "94% (A+)",
      remark: "Outstanding",
    },
    {
      sn: "02",
      subject: "English Language",
      term1: "88% (A)",
      term2: "90% (A)",
      term3: "92% (A+)",
      final: "92% (A+)",
      remark: "Excellent",
    },
    {
      sn: "03",
      subject: "Economics",
      term1: "85% (A)",
      term2: "87% (A)",
      term3: "89% (A)",
      final: "89% (A)",
      remark: "Very good",
    },
  ],
};

const grades = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"];
// const terms = ["term1", "term2", "term3"];

export default function ParentTranscript() {
  const [selectedGrade, setSelectedGrade] = useState("Grade 1");
  const [selectedTerm, setSelectedTerm] = useState("term1");
  const [filteredResults, setFilteredResults] = useState(transcriptResults[selectedGrade]);

  // Update filteredResults when grade or term changes
  React.useEffect(() => {
    setFilteredResults(transcriptResults[selectedGrade]);
  }, [selectedGrade]);

  // Dummy: Download transcript as CSV for the selected grade and term
  const handleDownload = () => {
    const data = filteredResults;
    const csvRows = [
      ["SN", "Subject Name", "Term Result", "Final Grade", "Remark"],
      ...data.map(row => [
        row.sn,
        row.subject,
        row[selectedTerm],
        row.final,
        row.remark,
      ]),
    ];
    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedGrade}-Transcript-${selectedTerm}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- API integration point ---
  // You can fetch transcript data from your API here and update transcriptResults state

  // Filter handler (currently just resets to selected grade, but you can add more logic)
  const handleFilter = () => {
    // Example: You can add more advanced filtering here if needed
    setFilteredResults(transcriptResults[selectedGrade]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <SideMenu />
      <div className="flex-1 p-4 md:p-10">
        {/* Header */}
        <DashboardHeader holder="Transcripts" text="Transcript" />
        {/* Grade and Term Selectors */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 max-w-full mx-auto mt-20 md:mt-16">
          <div className="flex gap-2 mt-7">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Select Grade</label>
              <select
                className="border cursor-pointer focus:outline-none border-gray-300 rounded px-2 py-1"
                value={selectedGrade}
                onChange={e => setSelectedGrade(e.target.value)}
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Select Term</label>
              <select
                className="border  cursor-pointer focus:outline-none border-gray-300 rounded px-2 py-1"
                value={selectedTerm}
                onChange={e => setSelectedTerm(e.target.value)}
              >
                <option value="term1">Term 1</option>
                <option value="term2">Term 2</option>
                <option value="term3">Term 3</option>
              </select>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              className="flex  cursor-pointer focus:outline-none items-center gap-1 px-4 py-3 border border-gray-300 rounded-sm text-xs font-medium"
              onClick={handleFilter}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
              </svg>
              Filter
            </button>
            <button className="flex cursor-pointer items-center focus:outline-none gap-1 px-4 py-3 bg-blue-700 text-white rounded-sm text-xs font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Contact Teacher
            </button>
            <button
              className="flex cursor-pointer items-center focus:outline-none gap-1 px-4 py-3 bg-blue-700 text-white rounded-sm text-xs font-medium"
              onClick={handleDownload}
            >
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
                <th className="py-2 px-3 text-left">Term Result</th>
                <th className="py-2 px-3 text-left">Final Grade</th>
                <th className="py-2 px-3 text-left">Remark</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((row, idx) => (
                <tr key={row.sn} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="py-2 px-3">{row.sn}</td>
                  <td className="py-2 px-3">{row.subject}</td>
                  <td className="py-2 px-3">{row[selectedTerm]}</td>
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