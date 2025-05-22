import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";

export default function WeeklyAttendanceChart() {
  const [animate, setAnimate] = useState(true);

  // Data based on the chart in the image
  const attendanceData = [
    { name: "Maths", score: 80, color: "#4ade80" }, // green
    { name: "Eng", score: 85, color: "#4ade80" }, // green
    { name: "Sci", score: 62, color: "#facc15" }, // yellow
    { name: "Phy", score: 70, color: "#facc15" }, // yellow
    { name: "Chem", score: 83, color: "#4ade80" }, // green
    { name: "Bio", score: 67, color: "#facc15" }, // yellow
    { name: "Geo", score: 48, color: "#f87171" }, // red
    { name: "Hist", score: 50, color: "#f87171" }, // red
    { name: "Econ", score: 90, color: "#4ade80" }, // green
    { name: "Stat", score: 77, color: "#4ade80" }, // green
  ];

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
    <div className="w-[600px] ml-[2rem] bg-white p-6 rounded-lg shadow-md mb-[4rem]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Weekly Attendance</h2>
        <div className="flex items-center text-sm text-gray-500 cursor-pointer">
          <span>Performance view</span>
          <ChevronDown size={16} className="ml-1" />
        </div>
      </div>

      <div className=" h-[569px] ">
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

      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="text-sm text-gray-600">Above 80%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span className="text-sm text-gray-600">Between 70% - 80%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <span className="text-sm text-gray-600">Below 70%</span>
        </div>
      </div>
    </div>
  );
}
