import { useState } from "react";
import DashboardHeader from "../components/DashboardHeader";


// Timetable data for each grade
const timetableData = {
  "Grade 1": [
    {
      time: "08:30 am",
      subjects: [
        { name: "Mathematics", teacher: "Ms. Ada", class: "Grade 1" },
        { name: "English Language", teacher: "Mr. Bright", class: "Grade 1" },
        { name: "Basic Science", teacher: "Mrs. Edukans", class: "Grade 1" },
        { name: "Civic Education", teacher: "Mr. Okon", class: "Grade 1" },
        { name: "Art", teacher: "Ms. Precious", class: "Grade 1" },
      ],
    },
    {
      time: "10:00 am",
      subjects: [
        { name: "Reading", teacher: "Ms. Ada", class: "Grade 1" },
        { name: "Music", teacher: "Mr. Bright", class: "Grade 1" },
        { name: "Physical Education", teacher: "Coach Mike", class: "Grade 1" },
        { name: "French", teacher: "Mrs. Bello", class: "Grade 1" },
        { name: "ICT", teacher: "Mr. Jameson Opie", class: "Grade 1" },
      ],
    },
    {
      time: "12:00 pm",
      subjects: [
        { name: "Story Time", teacher: "Ms. Ada", class: "Grade 1" },
        { name: "Drawing", teacher: "Ms. Precious", class: "Grade 1" },
        { name: "Games", teacher: "Coach Mike", class: "Grade 1" },
        { name: "Handwriting", teacher: "Mr. Bright", class: "Grade 1" },
        { name: "Rest", teacher: "Mrs. Edukans", class: "Grade 1" },
      ],
    },
  ],
  "Grade 2": [
    {
      time: "08:30 am",
      subjects: [
        { name: "Mathematics", teacher: "Mr. Jameson Opie", class: "Grade 2" },
        { name: "Social Studies", teacher: "Mrs. Edukans", class: "Grade 2" },
        { name: "English Language", teacher: "Mr. Bright", class: "Grade 2" },
        { name: "Civic Education", teacher: "Mr. Bright", class: "Grade 2" },
        { name: "Economics", teacher: "Ms. Precious", class: "Grade 2" },
      ],
    },
    {
      time: "10:00 am",
      subjects: [
        { name: "Science", teacher: "Ms. Ada", class: "Grade 2" },
        { name: "History", teacher: "Mr. Okon", class: "Grade 2" },
        { name: "French", teacher: "Mrs. Bello", class: "Grade 2" },
        { name: "Art", teacher: "Ms. Precious", class: "Grade 2" },
        { name: "Music", teacher: "Mr. Bright", class: "Grade 2" },
      ],
    },
    {
      time: "12:00 pm",
      subjects: [
        { name: "Physical Education", teacher: "Coach Mike", class: "Grade 2" },
        { name: "ICT", teacher: "Mr. Jameson Opie", class: "Grade 2" },
        { name: "Home Economics", teacher: "Mrs. Edukans", class: "Grade 2" },
        { name: "Agriculture", teacher: "Mr. Bright", class: "Grade 2" },
        { name: "Literature", teacher: "Ms. Precious", class: "Grade 2" },
      ],
    },
  ],
  "Grade 3": [
    {
      time: "08:30 am",
      subjects: [
        { name: "Mathematics", teacher: "Mr. Jameson Opie", class: "Grade 3" },
        { name: "English Language", teacher: "Mr. Bright", class: "Grade 3" },
        { name: "Science", teacher: "Ms. Ada", class: "Grade 3" },
        { name: "Social Studies", teacher: "Mrs. Edukans", class: "Grade 3" },
        { name: "French", teacher: "Mrs. Bello", class: "Grade 3" },
      ],
    },
    {
      time: "10:00 am",
      subjects: [
        { name: "History", teacher: "Mr. Okon", class: "Grade 3" },
        { name: "Art", teacher: "Ms. Precious", class: "Grade 3" },
        { name: "Music", teacher: "Mr. Bright", class: "Grade 3" },
        { name: "ICT", teacher: "Mr. Jameson Opie", class: "Grade 3" },
        { name: "Physical Education", teacher: "Coach Mike", class: "Grade 3" },
      ],
    },
    {
      time: "12:00 pm",
      subjects: [
        { name: "Agriculture", teacher: "Mr. Bright", class: "Grade 3" },
        { name: "Home Economics", teacher: "Mrs. Edukans", class: "Grade 3" },
        { name: "Literature", teacher: "Ms. Precious", class: "Grade 3" },
        { name: "Civic Education", teacher: "Mr. Okon", class: "Grade 3" },
        { name: "Handwriting", teacher: "Mr. Bright", class: "Grade 3" },
      ],
    },
  ],
  "Grade 4": [
    {
      time: "08:30 am",
      subjects: [
        { name: "Mathematics", teacher: "Mr. Jameson Opie", class: "Grade 4" },
        { name: "English Language", teacher: "Mr. Bright", class: "Grade 4" },
        { name: "Science", teacher: "Ms. Ada", class: "Grade 4" },
        { name: "Social Studies", teacher: "Mrs. Edukans", class: "Grade 4" },
        { name: "French", teacher: "Mrs. Bello", class: "Grade 4" },
      ],
    },
    {
      time: "10:00 am",
      subjects: [
        { name: "History", teacher: "Mr. Okon", class: "Grade 4" },
        { name: "Art", teacher: "Ms. Precious", class: "Grade 4" },
        { name: "Music", teacher: "Mr. Bright", class: "Grade 4" },
        { name: "ICT", teacher: "Mr. Jameson Opie", class: "Grade 4" },
        { name: "Physical Education", teacher: "Coach Mike", class: "Grade 4" },
      ],
    },
    {
      time: "12:00 pm",
      subjects: [
        { name: "Agriculture", teacher: "Mr. Bright", class: "Grade 4" },
        { name: "Home Economics", teacher: "Mrs. Edukans", class: "Grade 4" },
        { name: "Literature", teacher: "Ms. Precious", class: "Grade 4" },
        { name: "Civic Education", teacher: "Mr. Okon", class: "Grade 4" },
        { name: "Handwriting", teacher: "Mr. Bright", class: "Grade 4" },
      ],
    },
  ],
  "Grade 5": [
    {
      time: "08:30 am",
      subjects: [
        { name: "Mathematics", teacher: "Mr. Jameson Opie", class: "Grade 5" },
        { name: "English Language", teacher: "Mr. Bright", class: "Grade 5" },
        { name: "Science", teacher: "Ms. Ada", class: "Grade 5" },
        { name: "Social Studies", teacher: "Mrs. Edukans", class: "Grade 5" },
        { name: "French", teacher: "Mrs. Bello", class: "Grade 5" },
      ],
    },
    {
      time: "10:00 am",
      subjects: [
        { name: "History", teacher: "Mr. Okon", class: "Grade 5" },
        { name: "Art", teacher: "Ms. Precious", class: "Grade 5" },
        { name: "Music", teacher: "Mr. Bright", class: "Grade 5" },
        { name: "ICT", teacher: "Mr. Jameson Opie", class: "Grade 5" },
        { name: "Physical Education", teacher: "Coach Mike", class: "Grade 5" },
      ],
    },
    {
      time: "12:00 pm",
      subjects: [
        { name: "Agriculture", teacher: "Mr. Bright", class: "Grade 5" },
        { name: "Home Economics", teacher: "Mrs. Edukans", class: "Grade 5" },
        { name: "Literature", teacher: "Ms. Precious", class: "Grade 5" },
        { name: "Civic Education", teacher: "Mr. Okon", class: "Grade 5" },
        { name: "Handwriting", teacher: "Mr. Bright", class: "Grade 5" },
      ],
    },
  ],
  "Grade 6": [
    {
      time: "08:30 am",
      subjects: [
        { name: "Mathematics", teacher: "Mr. Jameson Opie", class: "Grade 6" },
        { name: "English Language", teacher: "Mr. Bright", class: "Grade 6" },
        { name: "Science", teacher: "Ms. Ada", class: "Grade 6" },
        { name: "Social Studies", teacher: "Mrs. Edukans", class: "Grade 6" },
        { name: "French", teacher: "Mrs. Bello", class: "Grade 6" },
      ],
    },
    {
      time: "10:00 am",
      subjects: [
        { name: "History", teacher: "Mr. Okon", class: "Grade 6" },
        { name: "Art", teacher: "Ms. Precious", class: "Grade 6" },
        { name: "Music", teacher: "Mr. Bright", class: "Grade 6" },
        { name: "ICT", teacher: "Mr. Jameson Opie", class: "Grade 6" },
        { name: "Physical Education", teacher: "Coach Mike", class: "Grade 6" },
      ],
    },
    {
      time: "12:00 pm",
      subjects: [
        { name: "Agriculture", teacher: "Mr. Bright", class: "Grade 6" },
        { name: "Home Economics", teacher: "Mrs. Edukans", class: "Grade 6" },
        { name: "Literature", teacher: "Ms. Precious", class: "Grade 6" },
        { name: "Civic Education", teacher: "Mr. Okon", class: "Grade 6" },
        { name: "Handwriting", teacher: "Mr. Bright", class: "Grade 6" },
      ],
    },
  ],
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const grades = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"];


function Timetable() {
   const [selectedGrade, setSelectedGrade] = useState("Grade 2");
  const timetable = timetableData[selectedGrade];


  return (
    <div className="min-h-screen bg-gray-50">
       {/* Main Content */}

      <main className="p-4 md:p-10">
        {/* Header */}
        <DashboardHeader text="Timetable" />

      
        {/* Grade Selector as Select Dropdown */}
        <div className="mb-6 mt-[80px] max-w-xs">
          <label className="block text-sm focus:outline-none font-medium text-gray-700 mb-1" htmlFor="grade-select">
            Select Grade
          </label>
          <select
            id="grade-select"
            className="w-full px-4 py-2 rounded-lg border-1 border-gray-300 focus:outline-none bg-white"
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
          >
            {grades.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>


        {/* Timetable Grid */}
        <div className="overflow-x-auto mt-6">
          <div className="min-w-[700px] grid grid-cols-6 gap-4">
            {/* Time Column (Static) */}
            <div className="flex flex-col gap-4 sticky left-0 bg-gray-50 z-10">
              <div className="h-12"></div>
              {timetable.map((slot, i) => (
                <div
                  key={i}
                  className="h-20 flex items-center justify-center text-gray-500 font-medium bg-gray-100 rounded"
                >
                  {slot.time}
                </div>
              ))}
            </div>
            {/* Days Columns */}
            {days.map((day, dayIdx) => (
              <div
                key={day}
                className="flex flex-col gap-4 overflow-y-auto max-h-[320px] scrollbar-thin"
                style={{ minWidth: 140 }}
              >
                <div className="h-12 flex items-center justify-center font-semibold bg-gray-100 rounded">
                  {day}
                </div>
                {timetable.map((slot, slotIdx) => (
                  <div
                    key={slotIdx}
                    className="bg-white rounded-lg shadow p-3 flex flex-col text-xs md:text-sm min-h-[70px]"
                  >
                    <span className="font-semibold text-gray-800">
                      {slot.subjects[dayIdx % slot.subjects.length].name}
                    </span>
                    <span className="text-gray-500">
                      {slot.subjects[dayIdx % slot.subjects.length].teacher}
                    </span>
                    <span className="text-gray-400">
                      {selectedGrade}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Timetable;