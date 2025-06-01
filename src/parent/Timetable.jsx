import DashboardHeader from "./components/DashboardHeader";
import SideBar from "./components/SideBar"

const timetable = [
  {
    time: "08:30 am",
    subjects: [
      { name: "Mathematics", teacher: "Mr. Jameson Opie", class: "Grade 2", },
      { name: "Social Studies", teacher: "Mrs. Edukans", class: "Grade 2", },
      { name: "English Language", teacher: "Mr. Bright", class: "Grade 2", },
      { name: "Civic Education", teacher: "Mr. Bright", class: "Grade 2", },
      { name: "Economics", teacher: "Ms. Precious", class: "Grade 2", },
    ],
  },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function Timetable() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10">
       {/* Header */}
      <DashboardHeader text="Timetable" />

        {/* Grade Button */}
        <button className="mb-6 px-6 py-2 mt-[80px] rounded-lg border border-gray-300 bg-white font-medium shadow-sm hover:bg-gray-100">
          Grade 2
        </button>

        {/* Timetable Grid */}
        <div className="overflow-x-auto mt-6">
          <div className="min-w-[700px] grid grid-cols-6 gap-4">
            {/* Time Column */}
            <div className="flex flex-col gap-4">
              <div className="h-12"></div>
              {Array(5).fill().map((_, i) => (
                <div key={i} className="h-20 flex items-center justify-center text-gray-500 font-medium">
                  08:30 am
                </div>
              ))}
            </div>
            {/* Days Columns */}
            {days.map((day) => (
              <div key={day} className="flex flex-col gap-4">
                <div className="h-12 flex items-center justify-center font-semibold bg-gray-100 rounded">{day}</div>
                {timetable[0].subjects.map((subject, subIdx) => (
                  <div key={subIdx} className="bg-white rounded-lg shadow p-3 flex flex-col text-xs md:text-sm">
                    <span className="font-semibold text-gray-800">{subject.name}</span>
                    <span className="text-gray-500">{subject.teacher}</span>
                    <span className="text-gray-400">{subject.class}</span>
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