import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Label,
} from "recharts";

const barData = [
  { label: "Math", value: 90 },
  { label: "Eng", value: 70 },
  { label: "Bio", value: 90 },
  { label: "Civic", value: 70 },
  { label: "Chem", value: 50 },
  { label: "Phy", value: 95 },
  { label: "Geo", value: 80 },
];

const barColors = barData.map((d) =>
  d.value >= 80 ? "#4ade80" : d.value >= 60 ? "#fde047" : "#f87171"
);

const events = [
  { date: 22, title: "Parent-Teacher Meeting", color: "bg-yellow-100", icon: "📝" },
  { date: 26, title: "Parent-Teacher Meeting", color: "bg-yellow-100", icon: "📝" },
  { date: 28, title: "Parent-Teacher Meeting", color: "bg-yellow-100", icon: "📝" },
];

export default function ParentDashboard() {
    const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <div className="flex min-h-screen bg-[#f5f8fe]">
      {/* Sidebar */}
   

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-[#f5f8fe]">
          <div>
            <p className="text-xs text-gray-500">Parent</p>
            <h1 className="text-lg font-semibold text-gray-800">Parent Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Priscilla"
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
            // /api/placeholder/32/32
              src="/profile.png"
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </header>

        {/* Welcome & Banner */}
        <section className="relative flex flex-col items-center mt-2 mb-8 px-2 md:px-0">
          <div className="flex w-full justify-between items-center mb-2">
            <div>
              <p className="text-lg text-gray-600">Welcome,</p>
              <h2 className="text-2xl font-semibold text-[#1a237e]">Mrs Daniel</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Notification</span>
              <span className="relative">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </span>
            </div>
          </div>
          {/* Banner */}
          <div className="relative w-full rounded-lg overflow-hidden h-28 md:h-32 flex items-center justify-center bg-[#1736a4]">
            <div className="absolute left-0 top-0 w-32 h-28 bg-[#ffd600] rounded-br-full"></div>
            <div className="absolute left-0 bottom-0 w-20 h-16 bg-[#2ecc71] rounded-tr-full"></div>
            <div className="absolute right-0 top-0 w-24 h-24 bg-[#ffd600] rounded-bl-full"></div>
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-white rounded-tl-full"></div>
            <div className="w-full h-full bg-[#1736a4]"></div>
          </div>
          {/* Profile */}
          <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <img
            // /api/placeholder/100/100
              src="/profile.png"
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="mt-2 text-center">
              <div className="font-semibold text-[#1736a4]">Priscilla Daniel</div>
              <div className="text-xs text-gray-500">Ilearnova/Stu/001</div>
              <div className="text-xs text-gray-500">Grade 6</div>
            </div>
          </div>
        </section>

        {/* Main Dashboard Widgets */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-20 px-2 md:px-0">
          {/* Score Chart */}
          <div className="bg-white rounded-xl shadow p-6 min-h-[320px] flex flex-col">
            <div className="text-xs text-gray-500 mb-2">Score</div>
            {/* Recharts Bar Chart */}
            <div className="flex-1 flex items-end justify-center h-56">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value">
                    {barData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={barColors[idx]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex gap-4 justify-center mt-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 bg-green-400 rounded"></span> 80-100
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 bg-yellow-400 rounded"></span> 60-79
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 bg-red-400 rounded"></span> Below 60
              </div>
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="bg-white rounded-xl shadow p-6 min-h-[320px] flex flex-col">
            <div className="font-semibold text-gray-700 mb-2">Upcoming Classes</div>
            <div className="text-xs text-gray-500 mb-2">October 2024</div>
            {/* Calendar */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
              <div>Mo</div>
              <div>Tu</div>
              <div>We</div>
              <div>Th</div>
              <div>Fr</div>
              <div>Sa</div>
              <div>Su</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm mb-4">
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const isActive = [22, 26, 28].includes(day);
                return (
                  <div
                    key={day}
                    className={`py-1 rounded-full cursor-pointer ${
                      isActive
                        ? "bg-blue-700 text-white font-bold"
                        : "hover:bg-blue-100"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            {/* Events */}
            <div className="flex flex-col gap-2">
              {events.map((event, idx) => (
                <div key={idx} className={`flex items-center gap-2 p-2 rounded ${event.color}`}>
                  <span className="text-lg">{event.icon}</span>
                  <span className="text-xs text-gray-700">{event.title}</span>
                  <span className="ml-auto text-xs text-gray-500">{`Oct ${event.date}`}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lower Widgets */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 px-2 md:px-0 mb-8">
          {/* Weekly Learning Goal */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="flex flex-col items-center justify-center w-full md:w-1/2">
              {/* Recharts Pie Chart as Circular Progress */}
              <ResponsiveContainer width={96} height={96}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Completed", value: 9 },
                      { name: "Remaining", value: 2 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={48}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    <Cell fill="#1e40af" />
                    <Cell fill="#e5e7eb" />
                    <Label
                      value="9/11"
                      position="center"
                      fontSize="20"
                      fill="#1e40af"
                      fontWeight="bold"
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="text-xs text-gray-500 mt-2">Courses</div>
            </div>
            <div className="flex-1 w-full">
              <div className="font-semibold text-gray-700 mb-2">Your weekly learning goal</div>
              <div className="flex items-end gap-4 h-24">
                {[100, 90, 80, 70, 60].map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className="bg-green-400 w-6 rounded-t-md"
                      style={{ height: `${val / 2}%` }}
                    ></div>
                    <span className="text-xs mt-1 text-gray-500">
                      {["Mon", "Tue", "Wed", "Thu", "Fri"][idx]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold text-[#1a237e]">100</span>
                <span className="text-xs text-gray-500">/ Score</span>
                <span className="ml-auto text-xs text-red-500">-25% from previous week</span>
              </div>
            </div>
          </div>

         {/* Student Attendance Calendar with react-calendar */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col">
            <div className="font-semibold text-gray-700 mb-2">Student Attendance</div>
            <div className="text-xs text-gray-500 mb-4">
              {selectedDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </div>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              calendarType="US"
              className="border-none w-full [&_.react-calendar__tile--active]:bg-blue-700 [&_.react-calendar__tile--active]:text-white [&_.react-calendar__tile--now]:bg-blue-100"
              tileClassName={({ date, view }) => {
                // Example: mark 22nd and 23rd as absent
                if (
                  view === "month" &&
                  [22, 23].includes(date.getDate()) &&
                  date.getMonth() === selectedDate.getMonth()
                ) {
                  return "bg-red-500 text-white font-bold rounded-full";
                }
                return "rounded-full";
              }}
            />
          </div>
        </section>
      </main>
    </div>
  );
}