import SideBar from "../components/SideBar"
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
import DashboardHeader from "../components/DashboardHeader";

const scoreData = [
    { subject: "Math", value: 90 },
    { subject: "English", value: 85 },
    { subject: "Biology", value: 90 },
    { subject: "Physics", value: 95 },
    { subject: "Chemistry", value: 50 },
    { subject: "Civic", value: 70 },
    { subject: "Yoruba", value: 45 },
    { subject: "Further Mathematics", value: 50 },
    { subject: "Animal Husbandry", value: 90 },
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

                {/* Filters & Download */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-2 md:px-8 mt-10">
                    <span className="font-semibold text-gray-700">Attendance</span>
                    <div className="flex items-center gap-2">
                        <button className="border border-gray-300 flex items-center gap-2 px-3 py-1 rounded text-xs bg-white"><span class="material-icons">
                            filter_alt
                        </span>Filter</button>
                        <button className="border border-gray-300 px-3 py-1 flex items-center gap-2 rounded text-xs bg-white"><span class="material-icons">
                            calendar_month
                        </span>Date</button>
                        <button className="bg-blue-600 text-white flex items-center gap-2 cursor-pointer px-4 py-1 rounded text-xs font-semibold">Download</button>
                    </div>

                </div>

                {/* Main Dashboard */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-2 md:px-8 mt-4">
                    {/* Left: Charts */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Score Bar Chart */}
                        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
                            <div className="font-semibold text-gray-700 mb-2">Score</div>
                            <div className="flex-1 min-h-[220px]">
                                <ResponsiveContainer width="100%" height={250}>
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
                                <h3 className="text-center font-medium">Subject</h3>
                            </div>
                            {/* Legend */}
                            <div className="flex gap-4 justify-center mt-4 text-xs">

                                <div className="flex items-center gap-1">
                                    <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full"></span> Between 50%-80%
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>Above 80%
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="inline-block w-3 h-3 bg-red-400 rounded-full"></span> Below 50%
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
                                <h3 className="text-center font-medium">Months</h3>
                            </div>
                            {/* Legend */}
                            <div className="flex gap-4 justify-center mt-4 text-xs">

                                <div className="flex items-center gap-1">
                                    <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full"></span> Between 50%-80%
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>Above 80%
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="inline-block w-3 h-3 bg-red-400 rounded-full"></span> Below 50%
                                </div>
                                <div className="flex items-center gap-1">
                                    Attendance
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Performance Alert */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
                            <div className="font-semibold text-gray-700 mb-4">Performance Alert</div>

                            <span className='capitalize text-md my-4'>john doe's math score dropped to 45%</span>
                            <button className="bg-blue-700 text-center cursor-pointer text-white font-semibold px-4 py-2 rounded mb-2">
                                Dismiss
                            </button>
                            <span className='capitalize text-md my-4'>john doe's math score dropped to 45%</span>
                            <button className="bg-blue-700 text-center text-white font-semibold cursor-pointer px-4 py-2 rounded mb-2">
                                Dismiss
                            </button>
                            <span className='capitalize text-md my-4'>john doe's math score dropped to 45%</span>
                            <button className="bg-blue-700 text-center cursor-pointer text-white font-semibold px-4 py-2 rounded mb-2">
                                Dismiss
                            </button>
                            <span className='capitalize text-md my-4'>john doe's math score dropped to 45%</span>
                            <button className="bg-blue-700 text-center cursor-pointer text-white font-semibold px-4 py-2 rounded mb-2">
                                Dismiss
                            </button>
                            <span className='capitalize text-md my-4'>john doe's math score dropped to 45%</span>
                            <button className="bg-blue-700 text-center cursor-pointer text-white font-semibold px-4 py-2 rounded">
                                Dismiss
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}