import React from "react";
import ChartPlaceholder from "./ChartPlaceholder";

/**
 * Charts section component for dashboard.
 * Displays analytics charts with proper loading and error states.
 */
const ChartsSection = React.memo(function ChartsSection({
  chartData,
  loading = false,
  error = null,
  onRetry,
  className = ""
}) {
  // If we have chart data, we would render actual charts here
  // For now, we'll use the placeholder with the actual chart image
  const hasChartData = chartData && !loading && !error;
  
  return (
    <section className={`space-y-6 ${className}`} aria-label="Analytics charts">
      {/* Main Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {hasChartData ? (
          <ActualChart chartData={chartData} />
        ) : (
          <ChartPlaceholder
            title="System Analytics"
            type="pie"
            state={loading ? "loading" : error ? "error" : "empty"}
            message={error || (loading ? "Loading analytics data..." : "No chart data available")}
            onRetry={onRetry}
            height="h-80"
          />
        )}
      </div>

      {/* Additional Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder
          title="User Activity"
          type="line"
          state={loading ? "loading" : "empty"}
          height="h-64"
        />
        
        <ChartPlaceholder
          title="Course Performance"
          type="bar"
          state={loading ? "loading" : "empty"}
          height="h-64"
        />
      </div>
    </section>
  );
});

/**
 * Component to render actual chart when data is available
 */
const ActualChart = React.memo(function ActualChart({ chartData }) {
  // This would integrate with your actual charting library
  // For now, we'll show the existing chart image as a fallback
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          System Analytics
        </h3>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
        {/* Placeholder for actual chart implementation */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
              />
            </svg>
          </div>
          <p className="text-gray-600">
            Chart visualization would render here
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Integrate with Chart.js, D3, or your preferred charting library
          </p>
        </div>
      </div>
    </div>
  );
});

/**
 * Simplified charts section for mobile or compact views
 */
export const CompactChartsSection = React.memo(function CompactChartsSection({
  chartData,
  loading = false,
  error = null,
  onRetry,
  className = ""
}) {
  return (
    <section className={`${className}`} aria-label="Analytics summary">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Analytics Summary
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {loading ? "..." : "85%"}
            </div>
            <div className="text-sm text-gray-600">
              System Health
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {loading ? "..." : "92%"}
            </div>
            <div className="text-sm text-gray-600">
              User Satisfaction
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              {error}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-2 text-red-600 text-sm font-medium hover:text-red-700"
              >
                Try again
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
});

/**
 * Charts section with custom layout for specific chart types
 */
export const CustomChartsLayout = React.memo(function CustomChartsLayout({
  charts = [],
  loading = false,
  error = null,
  onRetry,
  layout = "grid", // "grid" | "stack" | "sidebar"
  className = ""
}) {
  const layoutClasses = {
    grid: "grid grid-cols-1 lg:grid-cols-2 gap-6",
    stack: "space-y-6",
    sidebar: "grid grid-cols-1 lg:grid-cols-3 gap-6"
  };

  return (
    <section className={`${className}`} aria-label="Custom charts layout">
      <div className={layoutClasses[layout]}>
        {charts.map((chart, index) => (
          <ChartPlaceholder
            key={chart.id || index}
            title={chart.title}
            type={chart.type}
            state={loading ? "loading" : error ? "error" : chart.state || "empty"}
            message={chart.message}
            onRetry={onRetry}
            height={chart.height || "h-64"}
          />
        ))}
      </div>
    </section>
  );
});

export default ChartsSection;
