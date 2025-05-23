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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="text-sm text-gray-500">Page/Parent</div>
            <h2 className="text-2xl font-semibold text-gray-800">Timetable</h2>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <span className="material-icons absolute left-2 top-2 text-gray-400">search</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Priscilla</span>
              <img
                src="/profile.png"
                loading="lazy"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Grade Button */}
        <button className="mb-6 px-6 py-2 rounded-lg border border-gray-300 bg-white font-medium shadow-sm hover:bg-gray-100">
          Grade 2
        </button>

        {/* Timetable Grid */}
        <div className="overflow-x-auto">
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
            {days.map((day, dayIdx) => (
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