import SideBar from "./components/SideBar"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend,
} from "recharts";
import DashboardHeader from "./components/DashboardHeader";

const scoreData = [
    { subject: "Math", value: 85 },
    { subject: "English", value: 65 },
    { subject: "Civic", value: 80 },
    { subject: "Biology", value: 70 },
    { subject: "Chemistry", value: 55 },
    { subject: "Physics", value: 90 },
    { subject: "Geography", value: 75 },
];

const percentageData = [
    { month: "Jan", value: 85 },
    { month: "Feb", value: 80 },
    { month: "Mar", value: 70 },
    { month: "Apr", value: 90 },
    { month: "May", value: 75 },
    { month: "Jun", value: 80 },
    { month: "Jul", value: 85 },
];

const getBarColor = value =>
    value >= 80 ? "#4ade80" : value >= 60 ? "#fde047" : "#f87171";

export default function Attendance() {
    return (
        <div className="flex min-h-screen gap-2 bg-[#f5f8fe]">
            {/* Sidebar */}
            <SideBar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Topbar */}
                <DashboardHeader holder="Search" text="Attendance" />
                {/* <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-[#f5f8fe]">
                    <div>
                        <p className="text-xs text-gray-500">Parent</p>
                        <h1 className="text-lg font-semibold text-gray-800">Performance Insight</h1>
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
                            alt="User" loading="lazy"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    </div>
                </header> */}

                {/* Filters & Download */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-2 md:px-8 mt-4">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">Attendance</span>
                        <button className="border border-gray-300 px-3 py-1 rounded text-xs bg-white">Filter</button>
                        <button className="border border-gray-300 px-3 py-1 rounded text-xs bg-white">Bar</button>
                    </div>
                    <button className="bg-blue-600 text-white cursor-pointer px-4 py-1 rounded text-xs font-semibold">Download</button>
                </div>

                {/* Main Dashboard */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-2 md:px-8 mt-4">
                    {/* Left: Charts */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Score Bar Chart */}
                        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
                            <div className="font-semibold text-gray-700 mb-2">Score</div>
                            <div className="flex-1 min-h-[220px]">
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={scoreData}>
                                        <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                                        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Bar dataKey="value">
                                            {scoreData.map((entry, idx) => (
                                                <Cell key={`cell-${idx}`} fill={getBarColor(entry.value)} />
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

                        {/* Percentage Bar Chart */}
                        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
                            <div className="font-semibold text-gray-700 mb-2">Percentage</div>
                            <div className="flex-1 min-h-[220px]">
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={percentageData}>
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Bar dataKey="value">
                                            {percentageData.map((entry, idx) => (
                                                <Cell key={`cell2-${idx}`} fill={getBarColor(entry.value)} />
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
                    </div>

                    {/* Right: Performance Alert */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
                            <div className="font-semibold text-gray-700 mb-4">Performance Alert</div>
                            <button className="bg-blue-700 cursor-pointer text-white font-semibold px-4 py-2 rounded mb-2 text-left">
                                Attendance Report Alert &rarr;
                            </button>
                            <button className="bg-blue-700 text-white font-semibold cursor-pointer px-4 py-2 rounded mb-2 text-left">
                                Download
                            </button>
                            <button className="bg-blue-700 cursor-pointer text-white font-semibold px-4 py-2 rounded mb-2 text-left">
                                Score Analysis Insight &rarr;
                            </button>
                            <button className="bg-blue-700 cursor-pointer text-white font-semibold px-4 py-2 rounded mb-2 text-left">
                                View Details
                            </button>
                            <button className="bg-blue-700 cursor-pointer text-white font-semibold px-4 py-2 rounded text-left">
                                More Analysis &rarr;
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}