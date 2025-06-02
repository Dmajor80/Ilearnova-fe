import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import SideBar from "../components/SideBar";
import { PieGraph, BarGraph } from "../components/Charts"
import DashboardHeader from "../components/DashboardHeader";
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
    <div className="flex min-h-screen gap-2 bg-[#f5f8fe]">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-2">
        {/* Topbar */}
        <DashboardHeader holder="Search" text="Dashboard"/>

      

        {/* Main Dashboard Widgets */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-20 px-2 md:px-0">
          {/* Score Chart */}
          <div className="bg-white rounded-xl shadow p-6 min-h-[320px] flex flex-col">
            <div className="text-xs text-gray-500 mb-2">Score</div>
            {/* Recharts Bar Chart */}
            <div className="flex-1 flex items-end justify-center h-56">
              {/* <BarGraph /> */}
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
                    className={`py-1 rounded-full cursor-pointer ${isActive
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
              <PieGraph />
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
              calendarType="hebrew"
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