import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
} from "recharts";

const SchoolOverviewChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Week");
  const [data, setData] = useState([]);

  // Base data template
  const baseData = [
    { month: "Jan", projects: 75, revenue: 45, active: 35 },
    { month: "Feb", projects: 85, revenue: 55, active: 40 },
    { month: "Mar", projects: 70, revenue: 60, active: 30 },
    { month: "Apr", projects: 98, revenue: 70, active: 45 },
    { month: "May", projects: 45, revenue: 40, active: 25 },
    { month: "Jun", projects: 98, revenue: 75, active: 50 },
    { month: "Jul", projects: 80, revenue: 45, active: 35 },
    { month: "Aug", projects: 75, revenue: 55, active: 40 },
    { month: "Sep", projects: 95, revenue: 65, active: 45 },
    { month: "Oct", projects: 30, revenue: 35, active: 20 },
    { month: "Nov", projects: 75, revenue: 50, active: 30 },
    { month: "Dec", projects: 98, revenue: 45, active: 40 },
  ];

  // Function to add random variations to make it "live"
  const generateLiveData = () => {
    return baseData.map((item) => ({
      ...item,
      projects: Math.max(
        20,
        Math.min(100, item.projects + (Math.random() - 0.5) * 10)
      ),
      revenue: Math.max(
        15,
        Math.min(85, item.revenue + (Math.random() - 0.5) * 8)
      ),
      active: Math.max(
        10,
        Math.min(60, item.active + (Math.random() - 0.5) * 6)
      ),
    }));
  };

  // Update data every 3 seconds to simulate live updates
  useEffect(() => {
    setData(generateLiveData());

    const interval = setInterval(() => {
      setData(generateLiveData());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const periods = ["Week", "Month", "Year", "All"];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">School Overview</h2>

        {/* Period Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedPeriod === period
                  ? "bg-indigo-100 text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              domain={[0, 100]}
            />

            {/* Bar Chart for Number of Projects */}
            <Bar
              dataKey="projects"
              fill="#4f46e5"
              radius={[2, 2, 0, 0]}
              fillOpacity={0.8}
            />

            {/* Line Charts */}
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="active"
              stroke="#f59e0b"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#f59e0b", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-500 rounded"></div>
          <span className="text-sm text-gray-600">Number of Projects</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-dashed border-yellow-500"></div>
          <span className="text-sm text-gray-600">Active Projects</span>
        </div>
      </div>

      {/* Live indicator */}
      <div className="flex items-center justify-center mt-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">
            Live data - updates every 3 seconds
          </span>
        </div>
      </div>
    </div>
  );
};

export default SchoolOverviewChart;
