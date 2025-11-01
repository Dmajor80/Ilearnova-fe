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
import { getStudentAttendance } from "../../api/dashboardApi";

// WeeklyAttendanceChart Component
function WeeklyAttendanceChart() {
  const [animate, setAnimate] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        const response = await getStudentAttendance();
        // Transform the data to match the expected format
        const transformedData = response.data?.weeklyAttendance?.map(item => ({
          name: item.subject?.name || item.subject,
          score: item.percentage || item.score,
          color: item.percentage >= 80 ? "#4ade80" : item.percentage >= 70 ? "#facc15" : "#f87171"
        })) || [];
        setAttendanceData(transformedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching attendance data:", err);
        setError("Failed to load attendance data");
        // Fallback to sample data if API fails
        setAttendanceData([
          { name: "Maths", score: 80, color: "#4ade80" },
          { name: "Eng", score: 85, color: "#4ade80" },
          { name: "Sci", score: 62, color: "#facc15" },
          { name: "Phy", score: 70, color: "#facc15" },
          { name: "Chem", score: 83, color: "#4ade80" },
          { name: "Bio", score: 67, color: "#facc15" },
          { name: "Geo", score: 48, color: "#f87171" },
          { name: "Hist", score: 50, color: "#f87171" },
          { name: "Econ", score: 90, color: "#4ade80" },
          { name: "Stat", score: 77, color: "#4ade80" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  useEffect(() => {
    // Disable animation after initial render
    const timer = setTimeout(() => setAnimate(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Custom tooltip to show score
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
          <p className="font-semibold">{`${payload[0].payload.name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom bar that uses the color from the data
  const CustomBar = (props) => {
    const { x, y, width, height, data, index } = props;
    const color = data[index].color;
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        radius={[4, 4, 0, 0]}
      />
    );
  };

  return (
    <div className="w-full lg:w-[600px] xl:ml-8 bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 lg:mb-16">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h2 className="font-bold text-lg">Weekly Attendance</h2>
        <div className="flex items-center text-sm text-gray-500 cursor-pointer">
          <span>Performance view</span>
          <ChevronDown size={16} className="ml-1" />
        </div>
      </div>

      <div className="h-[300px] sm:h-[400px] lg:h-[569px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={attendanceData}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="score"
              shape={<CustomBar data={attendanceData} />}
              isAnimationActive={animate}
              animationDuration={1500}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="text-xs sm:text-sm text-gray-600">Above 80%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span className="text-xs sm:text-sm text-gray-600">
            Between 70% - 80%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <span className="text-xs sm:text-sm text-gray-600">Below 70%</span>
        </div>
      </div>
    </div>
  );
}

// Monthly Attendance Chart Component
function MonthlyAttendanceChart() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        setLoading(true);
        const response = await getStudentAttendance();
        // Transform the data to match the expected format
        const transformedData = response.data?.monthlyAttendance?.map(item => ({
          name: item.month,
          percentage: item.percentage
        })) || [];
        setMonthlyData(transformedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching monthly attendance data:", err);
        setError("Failed to load monthly attendance data");
        // Fallback to sample data if API fails
        setMonthlyData([
          { name: "Jan", percentage: 90 },
          { name: "Feb", percentage: 85 },
          { name: "Mar", percentage: 75 },
          { name: "Apr", percentage: 72 },
          { name: "May", percentage: 88 },
          { name: "Jun", percentage: 65 },
          { name: "Jul", percentage: 55 },
          { name: "Aug", percentage: 52 },
          { name: "Sep", percentage: 82 },
          { name: "Oct", percentage: 78 },
          { name: "Nov", percentage: 85 },
          { name: "Dec", percentage: 90 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, []);

  return (
    <Card className="mt-6 lg:mt-0">
      <h2 className="font-bold mb-4 text-lg sm:text-xl">Percentage</h2>
      <div className="h-[300px] sm:h-[400px] lg:h-[579px]">
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
              animationDuration={2000}
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
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs sm:text-sm text-gray-600">
            Above 80%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-xs sm:text-sm text-gray-600">
            70%-80%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-xs sm:text-sm text-gray-600">
            Below 70%
          </span>
        </div>
      </div>
    </Card>
  );
}

// Card component
const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white w-full rounded-lg shadow-md p-4 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
};

// Button component
const Button = ({ children, primary, className = "" }) => {
  return (
    <button
      className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md flex items-center gap-2 text-sm sm:text-base ${
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
    <div className="bg-gray-100 min-h-screen p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl font-bold">Attendance</h1>
          <div className="flex flex-wrap gap-2">
            <Button>
              <Filter size={16} />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button>
              <Calendar size={16} />
              <span className="hidden sm:inline">Date</span>
            </Button>
            <Button primary>
              <Download size={16} />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="space-y-6 lg:space-y-0">
          {/* Main Chart and Action Panel */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 mt-4 lg:mt-20">
            <WeeklyAttendanceChart />

            {/* Action Panel */}
            <div className="w-full lg:w-[300px] xl:w-[300px]">
              <h2 className="text-base sm:text-lg font-medium mb-4 flex items-center justify-between">
                Performance view <Calendar size={16} />
              </h2>
              <div className="space-y-2">
                {[...Array(4)].map((_, index) => (
                  <button
                    key={index}
                    className="w-full py-2 text-white rounded-md font-medium h-20 sm:h-[104px]"
                    style={{ backgroundColor: "rgba(245, 248, 254, 1)" }}
                  >
                    <div className="text-xs sm:text-sm text-black flex items-center gap-2 mb-4 sm:mb-8 px-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                      <span className="text-left">
                        John Doe's Math score dropped to 45%.
                      </span>
                    </div>
                    <button
                      className="text-sm sm:text-lg w-full h-8 sm:h-[42px] rounded-2xl text-white px-4 py-2 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: "rgba(18, 40, 164, 1)" }}
                    >
                      Dismiss
                    </button>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Chart */}
          <MonthlyAttendanceChart />
        </div>
      </div>
    </div>
  );
}
