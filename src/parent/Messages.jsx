import "@splidejs/react-splide/css";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import SideBar from "./components/SideBar";

// Dummy data for announcements
const announcements = [
  {
    title: "Annual Sports Day Scheduled!",
    date: "2nd December 2024",
    desc: "Get ready for the annual sports day. All students are required to participate.",
    btn: "Register now!",
    color: "bg-blue-700",
  },
  {
    title: "Midterm Report Card Distribution",
    date: "Monday, 18th Nov 2024",
    desc: "Midterm report cards will be distributed to all students in their respective classes.",
    btn: "View Details",
    color: "bg-blue-700",
  },
  {
    title: "Fee Submission Deadline Extended",
    date: "Finance - Urgent",
    desc: "The deadline for fee submission has been extended to 30th November 2024.",
    btn: "Pay now!",
    color: "bg-blue-700",
  },
  {
    title: "Parent-Teacher Meeting: Save the Date",
    date: "PTA Event",
    desc: "Parent-Teacher meeting scheduled for 25th November 2024. Please mark your calendars.",
    btn: "Add to calendar",
    color: "bg-blue-700",
  },
];

const chatMessages = [
  { from: "teacher", text: "Good day, Mrs Daniel", time: "2:00PM" },
  { from: "parent", text: "Good day, Teacher XYZ!", time: "2:00PM" },
  { from: "teacher", text: "Please ensure your ward submits the math assignment tomorrow.", time: "2:01PM" },
  { from: "parent", text: "Thank you! I will remind her.", time: "2:02PM" },
];

const upcomingClasses = [
  { date: "25th October 2024", title: "Parent-Teacher Meeting", time: "10:00AM - 11:00AM" },
  { date: "28th October 2024", title: "Parent-Teacher Meeting", time: "10:00AM - 11:00AM" },
  { date: "30th October 2024", title: "Parent-Teacher Meeting", time: "10:00AM - 11:00AM" },
];


function Messages() {
  return (
       <div className="min-h-screen bg-[#f5f8fe] flex flex-col md:flex-row">
      {/* Sidebar */}
      <SideBar/>
      {/* <aside className="bg-white w-full md:w-1/5 p-6 border-r">
        <h1 className="font-bold text-xl mb-8 text-blue-900">ILEARNOVA</h1>
        <nav className="space-y-4 text-gray-700">
          <a href="#" className="flex items-center gap-2 text-blue-700 font-semibold">
            <span className="material-icons">dashboard</span> Dashboard
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-700">
            <span className="material-icons">message</span> Messages
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-700">
            <span className="material-icons">payment</span> Payments
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-700">
            <span className="material-icons">assessment</span> Reports
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-700">
            <span className="material-icons">check_circle</span> Attendance
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-700">
            <span className="material-icons">calendar_today</span> Timetable
          </a>
        </nav>
      </aside> */}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500">Page / Parent</p>
            <h2 className="text-2xl font-semibold text-gray-800">PTA Hub</h2>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="search announcement"
                className="border border-gray-300 rounded-full py-2 px-4 pl-10 w-36 md:w-56"
                aria-label="Search"
              />
              <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
            </div>
            <img
              src="/profile.png"
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Announcement Cards Slider */}
        <div className="mb-6">
          <Splide
            options={{
              type: "loop",
              perPage: 2,
              gap: "1rem",
              breakpoints: {
                1024: { perPage: 2 },
                768: { perPage: 1 },
              },
              arrows: true,
              pagination: false,
            }}
            aria-label="School Announcements"
          >
            {announcements.map((a, idx) => (
              <SplideSlide key={idx}>
                <div className="bg-white rounded-lg shadow p-4 min-w-[260px] flex flex-col h-full">
                  <div className="text-xs text-gray-500 mb-1">{a.date}</div>
                  <div className="font-semibold text-blue-900 mb-1">{a.title}</div>
                  <div className="text-sm text-gray-600 flex-1">{a.desc}</div>
                  <button className={`mt-4 px-4 py-2 rounded-lg text-white font-semibold ${a.color} hover:bg-blue-800 transition`}>
                    {a.btn}
                  </button>
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 flex flex-col h-[420px]">
            <div className="flex items-center justify-between border-b pb-2 mb-2">
              <div>
                <div className="font-semibold text-blue-900">Teacher XYZ</div>
                <div className="text-xs text-gray-500">Class A</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons text-gray-400 cursor-pointer">call</span>
                <span className="material-icons text-gray-400 cursor-pointer">videocam</span>
                <span className="material-icons text-gray-400 cursor-pointer">more_vert</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "parent" ? "justify-end" : "justify-start"} mb-2`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.from === "parent" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-700"}`}>
                    <div className="text-sm">{msg.text}</div>
                    <div className="text-xs text-gray-400 text-right mt-1">{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center mt-2 gap-2">
              <input
                type="text"
                placeholder="Type your message"
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm"
              />
              <button className="bg-blue-700 text-white rounded-full p-2 hover:bg-blue-800 transition">
                <span className="material-icons">send</span>
              </button>
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col h-[420px]">
            <div className="font-semibold text-blue-900 mb-2">Upcoming Classes</div>
            {/* Calendar */}
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 rounded-lg p-2 w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">October 2024</span>
                  <div className="flex gap-1">
                    <button className="material-icons text-gray-400 text-base">chevron_left</button>
                    <button className="material-icons text-gray-400 text-base">chevron_right</button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs text-center text-gray-500">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                  {[...Array(31)].map((_, i) => (
                    <span
                      key={i}
                      className={`py-1 rounded-full ${i === 23 ? "bg-blue-700 text-white font-bold" : ""}`}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/* Upcoming Events */}
            <div className="flex-1 overflow-y-auto">
              {upcomingClasses.map((uc, i) => (
                <div key={i} className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                    <span className="material-icons text-yellow-600">event</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-blue-900">{uc.title}</div>
                    <div className="text-xs text-gray-500">{uc.date} | {uc.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Messages;