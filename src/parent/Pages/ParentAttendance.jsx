import SideMenu from "../components/SideMenu"
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
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Dummy children-specific data
const childrenPerformance = {
    1: {
        scoreData: [
            { subject: "Math", value: 95 },
            { subject: "English", value: 88 },
            { subject: "Science", value: 92 },
            { subject: "Civic", value: 80 },
        ],
        percentageData: [
            { month: "Jan", value: 90 },
            { month: "Feb", value: 92 },
            { month: "Mar", value: 88 },
            { month: "Apr", value: 95 },
        ],
        insights: "Excellent performance, keep it up!"
    },
    2: {
        scoreData: [
            { subject: "Math", value: 45 },
            { subject: "English", value: 60 },
            { subject: "Biology", value: 70 },
            { subject: "Physics", value: 55 },
        ],
        percentageData: [
            { month: "Jan", value: 60 },
            { month: "Feb", value: 55 },
            { month: "Mar", value: 50 },
            { month: "Apr", value: 65 },
        ],
        insights: "Needs improvement in Math and Science."
    },
    3: {
        scoreData: [
            { subject: "ND1", value: 80 },
            { subject: "ND2", value: 85 },
            { subject: "ND3", value: 78 },
        ],
        percentageData: [
            { month: "Jan", value: 80 },
            { month: "Feb", value: 85 },
            { month: "Mar", value: 78 },
        ],
        insights: "Consistent performance."
    },
    4: {
        scoreData: [
            { subject: "300 Level", value: 70 },
            { subject: "200 Level", value: 75 },
            { subject: "100 Level", value: 80 },
        ],
        percentageData: [
            { month: "Jan", value: 70 },
            { month: "Feb", value: 75 },
            { month: "Mar", value: 80 },
        ],
        insights: "Good academic progress."
    },
};

// Dummy children data (should match dashboard)
const children = [
    {
        id: 1,
        name: "Priscilla Daniel",
        age: 10,
        classLevel: "Primary 5",
        institution: "Primary",
        school: "Sunshine Primary School"
    },
    {
        id: 2,
        name: "John Doe",
        age: 15,
        classLevel: "SS2",
        institution: "Secondary",
        school: "Bright Future Secondary School"
    },
    {
        id: 3,
        name: "Mary Johnson",
        age: 19,
        classLevel: "ND2",
        institution: "Polytechnic",
        school: "Federal Polytechnic, Lagos"
    },
    {
        id: 4,
        name: "Samuel Lee",
        age: 22,
        classLevel: "300 Level",
        institution: "University",
        school: "University of Ibadan"
    }
];

const getBarColor = value =>
    value >= 80 ? "#4ade80" : value >= 60 ? "#fde047" : "#f87171";

function Attendance() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    // If navigated from dashboard, child is in state; else, get from param
    let child = location.state?.child;
    if (!child && id) {
        child = children.find(c => String(c.id) === String(id));
    }
    // If no child selected and no id, default to first child
    const isDefault = !child && !id;
    if (isDefault) {
        child = children[0];
    }
    const perf = child ? childrenPerformance[child.id] : null;
    const scoreData = perf ? perf.scoreData : [];
    const percentageData = perf ? perf.percentageData : [];
    const insights = perf ? perf.insights : "No insights available.";

    return (
        <div className="flex min-h-screen gap-2 bg-[#f5f8fe]">
            {/* Sidebar */}
            <SideMenu />
            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Topbar */}
                <DashboardHeader holder="Search" text="Attendance" />
                {/* Child selection buttons always visible */}
                <div className="bg-white rounded-xl shadow p-6 flex flex-col mx-2 md:mx-8 mt-8 mb-4">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Select a child to view performance</h2>
                    <div className="flex flex-wrap gap-4">
                        {children.map(c => (
                            <button
                                key={c.id}
                                className={`px-4 py-2 rounded text-sm font-medium transition ${child && c.id === child.id ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white'}`}
                                onClick={() => navigate(`/parent-attendance/${c.id}`)}
                            >
                                {c.name} ({c.classLevel})
                            </button>
                        ))}
                    </div>
                </div>
                {/* Back Button only if not default (not first child) */}
                {id && (
                    <button
                        className="flex items-center gap-1 text-blue-700 hover:underline text-sm w-fit ml-4 mt-2"
                        onClick={() => navigate('/parent-attendance')}
                    >
                        <span className="material-icons text-base">arrow_back</span> Back to Attendance
                    </button>
                )}
                {/* Child Performance Header */}
                {child && (
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mx-2 md:mx-8 mt-4 mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-blue-700 mb-1">Performance Insights for {child.name}</h2>
                            <div className="text-gray-700 text-sm mb-1">Class: <span className="font-semibold">{child.classLevel}</span></div>
                            <div className="text-gray-700 text-sm mb-1">School: <span className="font-semibold">{child.school}</span></div>
                            <div className="text-gray-700 text-sm">Age: <span className="font-semibold">{child.age}</span></div>
                        </div>
                        <div className="text-green-700 font-semibold text-md">{insights}</div>
                    </div>
                )}
                {/* Filters & Download */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-2 md:px-8 mt-10">
                    <span className="font-semibold text-gray-700">Attendance</span>
                    <div className="flex items-center gap-2">
                        <button className="border-3 border-gray-300 flex items-center gap-2 px-4 py-2 rounded text-xs bg-white"><span className="material-icons bg-none text-gray-700">
                            filter_alt
                        </span>Filter</button>
                        <button className="border-3 border-gray-300 px-4 py-2 flex items-center gap-2 rounded text-xs bg-white"><span className="material-icons bg-none text-gray-700">
                            calendar_month
                        </span>Date</button>
                        <button className="bg-blue-900 text-white flex items-center gap-2 cursor-pointer px-4 py-2 rounded text-xs font-semibold">Download</button>
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
                            {child ? (
                                <>
                                    <span className='capitalize text-md my-4 flex gap-2 justify-contents-between items-center'>
                                        <div className="rounded-full bg-blue-500 h-3 w-3"></div> {child.name}'s latest insight: {insights}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className='capitalize text-md my-4 flex gap-2 justify-contents-between items-center'>
                                        <div className="rounded-full bg-red-500 h-3 w-3"></div> Please select a child from the dashboard.
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Attendance;