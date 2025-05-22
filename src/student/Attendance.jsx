import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Calendar, ChevronDown, Download, Filter } from "lucide-react";
import WeeklyAttendanceChart from "./WeeklyAttendanceChart";

// Sample attendance data
const attendanceData = [
  { name: "Monday", present: 85, absent: 15, late: 5 },
  { name: "Tuesday", present: 78, absent: 18, late: 4 },
  { name: "Wednesday", present: 65, absent: 25, late: 10 },
  { name: "Thursday", present: 62, absent: 30, late: 8 },
  { name: "Friday", present: 55, absent: 35, late: 10 },
  { name: "Saturday", present: 72, absent: 20, late: 8 },
  { name: "Sunday", present: 88, absent: 10, late: 2 },
];

// Sample monthly data
const monthlyData = [
  { name: "Jan", percentage: 90, color: "bg-green-500" },
  { name: "Feb", percentage: 85, color: "bg-green-500" },
  { name: "Mar", percentage: 75, color: "bg-yellow-500" },
  { name: "Apr", percentage: 72, color: "bg-yellow-500" },
  { name: "May", percentage: 88, color: "bg-green-500" },
  { name: "Jun", percentage: 65, color: "bg-yellow-500" },
  { name: "Jul", percentage: 55, color: "bg-red-500" },
  { name: "Aug", percentage: 52, color: "bg-red-500" },
  { name: "Sep", percentage: 82, color: "bg-green-500" },
  { name: "Oct", percentage: 78, color: "bg-yellow-500" },
  { name: "Nov", percentage: 85, color: "bg-green-500" },
  { name: "Dec", percentage: 90, color: "bg-green-500" },
];

// Card component
const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white w-full rounded-lg shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
};

// Button component
const Button = ({ children, primary, className = "" }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md flex items-center gap-2 ${
        primary ? "bg-blue-600 text-white" : "border border-gray-300 bg-white"
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default function Attendance() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Start animation after component loads
    setAnimate(true);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Attendance</h1>
          <div className="flex gap-2">
            <Button>
              <Filter size={16} />
              Filter
            </Button>
            <Button>
              <Calendar size={16} />
              Date
            </Button>
            <Button primary>
              <Download size={16} />
              Download
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className=" lg:grid-cols-3 ">
          {/* Main Chart */}
          <div className=" flex  gap-[2rem] mt-[5rem]">
            <WeeklyAttendanceChart />
            {/* Action Panel */}{" "}
            <div className="w-[300px]">
              <h2 className="text-[18px] font-medium mb-4 flex items-center justify-between">
                Performance view <Calendar size={16} />{" "}
              </h2>
              <div className="space-y-2">
                <button
                  className="w-full py-2  text-white rounded-md font-medium h-[104px]"
                  style={{ backgroundColor: "rgba(245, 248, 254, 1)" }}
                >
                  <p className="text-[12px] text-black flex items-center gap-2 mb-[2rem]">
                    {" "}
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div> John
                    Doe’s Math score dropped to 45%.
                  </p>
                  <button
                    className="text-[18px] w-full h-[42px] rounded-2xl"
                    style={{ backgroundColor: "rgba(18, 40, 164, 1)" }}
                  >
                    Dismsiss
                  </button>
                </button>
                <button
                  className="w-full py-2  text-white rounded-md font-medium h-[104px]"
                  style={{ backgroundColor: "rgba(245, 248, 254, 1)" }}
                >
                  <p className="text-[12px] text-black flex items-center gap-2 mb-[2rem]">
                    {" "}
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div> John
                    Doe’s Math score dropped to 45%.
                  </p>
                  <button
                    className="text-[18px] w-full h-[42px] rounded-2xl"
                    style={{ backgroundColor: "rgba(18, 40, 164, 1)" }}
                  >
                    Dismsiss
                  </button>
                </button>
                <button
                  className="w-full py-2  text-white rounded-md font-medium h-[104px]"
                  style={{ backgroundColor: "rgba(245, 248, 254, 1)" }}
                >
                  <p className="text-[12px] text-black flex items-center gap-2 mb-[2rem]">
                    {" "}
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div> John
                    Doe’s Math score dropped to 45%.
                  </p>
                  <button
                    className="text-[18px] w-full h-[42px] rounded-2xl"
                    style={{ backgroundColor: "rgba(18, 40, 164, 1)" }}
                  >
                    Dismsiss
                  </button>
                </button>
                <button
                  className="w-full py-2  text-white rounded-md font-medium h-[104px]"
                  style={{ backgroundColor: "rgba(245, 248, 254, 1)" }}
                >
                  <p className="text-[12px] text-black flex items-center gap-2 mb-[2rem]">
                    {" "}
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div> John
                    Doe’s Math score dropped to 45%.
                  </p>
                  <button
                    className="text-[18px] w-full h-[42px] rounded-2xl"
                    style={{ backgroundColor: "rgba(18, 40, 164, 1)" }}
                  >
                    Dismsiss
                  </button>
                </button>
              </div>
            </div>
          </div>
          {/* Monthly Chart */}
          <Card className="lg:col-span-3">
            <h2 className="font-bold mb-4">Percentage</h2>
            <div className="h-[579px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="percentage"
                    name="Month"
                    radius={[4, 4, 0, 0]}
                    animationDuration={animate ? 2000 : 0}
                  >
                    {monthlyData.map((entry, index) => (
                      <cell
                        key={`cell-${index}`}
                        fill={
                          entry.percentage >= 80
                            ? "#4ade80"
                            : entry.percentage >= 70
                            ? "#facc15"
                            : "#f87171"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Above 80%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">70%-80%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Below 70%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
