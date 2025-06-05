import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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
  CartesianGrid,
  Legend
} from "recharts";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   Legend,
// } from 'recharts';
import SideMenu from "../components/SideMenu";

const data = [
  { day: 'Mon', minutes: 50 },
  { day: 'Tue', minutes: 60 },
  { day: 'Wed', minutes: 40 },
  { day: 'Thur', minutes: 50 },
  { day: 'Frid', minutes: 60 },
  { day: 'Sat', minutes: 40 },
];

// const barData = [
//   { label: "Math", value: 90 },
//   { label: "Eng", value: 85 },
//   { label: "Bio", value: 90 },
//   { label: "Civic", value: 70 },
//   { label: "Chem", value: 50 },
//   { label: "Phy", value: 95 },
//   { label: "Geo", value: 80 },
//   { label: "Yoruba", value: 45 },
//   { label: "Furth-Math", value: 50 },
//   { label: "Ani-Hus", value: 90 },
// ];

// const barData = [
//   { subject: 'Maths', score: 85 },
//   { subject: 'Eng', score: 90 },
//   { subject: 'Bio', score: 65 },
//   { subject: 'Phy', score: 70 },
//   { subject: 'Chem', score: 88 },
//   { subject: 'Civic', score: 68 },
//   { subject: 'Yor', score: 45 },
//   { subject: 'Agric', score: 48 },
//   { subject: 'Art', score: 95 },
//   { subject: 'Geo', score: 78 },
// ];

// const barColors = barData.map((d) =>
//   d.value >= 80 ? "#4ade80" : d.value >= 60 ? "#fde047" : "#f87171"
// );


// const getBarColor = (score) => {
//   if (score < 50) return '#ef4444'; // red
//   if (score < 80) return '#facc15'; // yellow
//   return '#22c55e'; // green
// };
const events = [
  { date: 22, title: "Parent-Teacher Meeting", color: "bg-yellow-100", time: "10:00 am" },
  { date: 22, title: "Parent-Teacher Meeting", color: "bg-yellow-100", time: "10:00 am" },
  { date: 26, title: "Parent-Teacher Meeting", color: "bg-yellow-100", time: "10:00 am" },
];

// const Calendar = () => {
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  const eventDates = [22, 25, 26];

function ParentDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <div className="flex min-h-screen gap-2 bg-[#f5f8fe]">
      {/* Sidebar */}
      <SideMenu />

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-2">
        {/* Topbar */}
        <DashboardHeader holder="Search" text="Dashboard" />

        {/* Main Dashboard Widgets */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-20 px-2 md:px-0">
          {/* Score Chart */}
          <div className="w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Scores</h2>
<BarGraph/>
            {/* <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value} / 100`} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={40}>
                    {data.map((entry, index) => (
                      <cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#facc15] rounded-full"></span>
                <span>Between 60% - 80%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#22c55e] rounded-full"></span>
                <span>Above 80%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#ef4444] rounded-full"></span>
                <span>Below 50%</span>
              </div>
            </div> */}
          </div>

          {/* Upcoming Classes */}
          <div className="bg-white rounded-xl shadow p-6 min-h-[320px] flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Upcoming Classes</h3>
      <div className="text-sm text-gray-600 mb-2">October 2024</div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {days.map((day) => (
          <div key={day} className="font-medium text-gray-500">{day}</div>
        ))}
        {Array.from({ length: 1 }, (_, i) => <div key={`spacer-${i}`} />)}
        {dates.map((date) => (
          <div
            key={date}
            className={`p-1 rounded-full ${
              eventDates.includes(date) ? 'bg-blue-600 text-white font-bold' : 'text-gray-800'
            }`}
          >
            {date}
          </div>
        ))}
      </div>
            {/* Events */}
            <div className="flex flex-col gap-2">
              {events.map((event, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-3`}>
                  <img src="/icon.png" className='h-10 w-10' alt="icons" />
                  <div className='flex-row text-left'>
                    <span className="text-md md:text-lg text-blue-700">{event.title}</span>
                    <div className="flex items-center mt-2 ">
                      <li className="ml-auto text-xs text-gray-500">{`December ${event.date}`}</li>
                      <li className="ml-auto text-xs text-gray-500">{event.time}</li>
                    </div>
                  </div>

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
            <div className="w-full max-w-2xl mx-auto p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">Your weekly learning goal</h2>

              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis hide domain={[0, 70]} />
                    <Tooltip formatter={(value) => `${value} mins`} />
                    <Bar dataKey="minutes" fill="#4ade80" radius={[6, 6, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex justify-between items-center text-sm">
                <span className="text-black font-medium text-lg">100/<span className="text-gray-500">300mins</span></span>
                <span className="text-red-600 font-medium">-40% from previous week</span>
              </div>
            </div>
          </div>

          {/* Student Attendance Calendar with react-calendar */}

          <div className="bg-white rounded-xl border-none shadow p-6 flex flex-col">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col">
              <div className="font-semibold text-gray-700 mb-2">
                Student Attendance
              </div>
              <div className="text-xs text-gray-500 mb-4">
                {selectedDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
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
          </div>
        </section>
      </main>
    </div>
  );
}


export default ParentDashboard;