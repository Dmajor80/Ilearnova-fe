import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const SchoolPerformanceChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const data = [
    { week: "Week 01", value: 560 },
    { week: "Week 02", value: 300 },
    { week: "Week 03", value: 480 },
    { week: "Week 04", value: 240 },
    { week: "Week 05", value: 560 },
    { week: "Week 06", value: 240 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            <span className="inline-block w-3 h-3 bg-orange-300 rounded-full mr-2"></span>
            series2: {payload[0].value}k
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 w-full">
      {/* Header */}
      <div className="p-6 pb-0 border-0 flex flex-wrap justify-between items-start">
        <div className="mb-4 sm:mb-0">
          <div className="mb-3">
            <h2 className="text-2xl font-bold text-gray-900">
              School Performance
            </h2>
          </div>
        </div>

        {/* Period Selection */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <label
              className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all ${
                selectedPeriod === "weekly"
                  ? "bg-gray-100 border-2 border-blue-500"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="period"
                value="weekly"
                checked={selectedPeriod === "weekly"}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <span className="text-sm text-gray-600">This Week</span>
                <div className="text-lg font-bold text-gray-900">1.245</div>
              </div>
            </label>

            <label
              className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all ${
                selectedPeriod === "monthly"
                  ? "bg-gray-100 border-2 border-blue-500"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="period"
                value="monthly"
                checked={selectedPeriod === "monthly"}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <span className="text-sm text-gray-600">Last Week</span>
                <div className="text-lg font-bold text-gray-900">1.356</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 pt-2">
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <AreaChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f5a792" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#f5a792" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="6 6"
                stroke="#dadada"
                horizontal={false}
              />
              <XAxis
                dataKey="week"
                axisLine={{ stroke: "#e0e0e0" }}
                tickLine={{ stroke: "#e0e0e0" }}
                tick={{
                  fill: "#b5b5c3",
                  fontSize: 12,
                  fontFamily: "system-ui",
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#b5b5c3",
                  fontSize: 12,
                  fontFamily: "system-ui",
                }}
                tickFormatter={(value) => `${value}k`}
                domain={[160, 560]}
                ticks={[160, 240, 320, 400, 480, 560]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#f5a792"
                strokeWidth={3}
                fill="url(#colorValue)"
                dot={{
                  r: 6,
                  fill: "#f5a792",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 8,
                  fill: "#f5a792",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SchoolPerformanceChart;
