import React from "react";
import { BarChart3, PieChart, TrendingUp, AlertCircle } from "lucide-react";

/**
 * Chart placeholder component for dashboard.
 * Shows when chart data is loading, unavailable, or there's an error.
 */
const ChartPlaceholder = React.memo(function ChartPlaceholder({
  title = "Analytics Chart",
  type = "bar", // "bar" | "pie" | "line" | "area"
  state = "loading", // "loading" | "empty" | "error"
  height = "h-64",
  message,
  onRetry,
  className = ""
}) {
  const IconComponent = getChartIcon(type);
  
  const getStateContent = () => {
    switch (state) {
      case "loading":
        return {
          icon: <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />,
          title: "Loading Chart Data",
          message: message || "Please wait while we fetch the latest analytics...",
          showRetry: false
        };
      
      case "empty":
        return {
          icon: <IconComponent className="w-12 h-12 text-gray-400" />,
          title: "No Data Available",
          message: message || "There's no data to display for this chart yet.",
          showRetry: false
        };
      
      case "error":
        return {
          icon: <AlertCircle className="w-12 h-12 text-red-500" />,
          title: "Failed to Load Chart",
          message: message || "We couldn't load the chart data. Please try again.",
          showRetry: true
        };
      
      default:
        return {
          icon: <IconComponent className="w-12 h-12 text-gray-400" />,
          title: "Chart Placeholder",
          message: message || "Chart content will appear here.",
          showRetry: false
        };
    }
  };

  const content = getStateContent();

  const handleRetry = () => {
    if (onRetry && state === "error") {
      onRetry();
    }
  };

  const handleRetryKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && onRetry && state === "error") {
      e.preventDefault();
      onRetry();
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {/* Chart Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <IconComponent className="w-4 h-4" />
            <span className="capitalize">{type} Chart</span>
          </div>
        </div>
      </div>

      {/* Chart Content Area */}
      <div className={`${height} flex flex-col items-center justify-center p-8 text-center`}>
        {/* Icon */}
        <div className="mb-4">
          {content.icon}
        </div>

        {/* Title */}
        <h4 className="text-lg font-medium text-gray-900 mb-2">
          {content.title}
        </h4>

        {/* Message */}
        <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
          {content.message}
        </p>

        {/* Retry Button */}
        {content.showRetry && onRetry && (
          <button
            onClick={handleRetry}
            onKeyDown={handleRetryKeyDown}
            className={`
              px-4 py-2 bg-blue-600 text-white rounded-lg font-medium
              transition-all duration-200 ease-in-out
              hover:bg-blue-700 focus:bg-blue-700
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
            aria-label="Retry loading chart data"
          >
            Try Again
          </button>
        )}

        {/* Loading Animation for Empty State */}
        {state === "empty" && (
          <div className="mt-4 flex space-x-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Chart Type Indicator */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Chart Type: {type.charAt(0).toUpperCase() + type.slice(1)}</span>
          {state === "loading" && (
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              Loading...
            </span>
          )}
          {state === "error" && (
            <span className="text-red-500">Error occurred</span>
          )}
          {state === "empty" && (
            <span>No data available</span>
          )}
        </div>
      </div>
    </div>
  );
});

/**
 * Get the appropriate chart icon based on type
 */
function getChartIcon(type) {
  const iconMap = {
    bar: BarChart3,
    pie: PieChart,
    line: TrendingUp,
    area: TrendingUp,
    default: BarChart3
  };
  
  return iconMap[type] || iconMap.default;
}

/**
 * Simplified chart placeholder for smaller spaces
 */
export const CompactChartPlaceholder = React.memo(function CompactChartPlaceholder({
  type = "bar",
  state = "loading",
  className = ""
}) {
  const IconComponent = getChartIcon(type);
  
  return (
    <div className={`bg-gray-100 rounded-lg p-4 flex items-center justify-center ${className}`}>
      {state === "loading" && (
        <div className="flex items-center gap-2 text-gray-600">
          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      )}
      
      {state === "empty" && (
        <div className="flex items-center gap-2 text-gray-500">
          <IconComponent className="w-4 h-4" />
          <span className="text-sm">No data</span>
        </div>
      )}
      
      {state === "error" && (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Error</span>
        </div>
      )}
    </div>
  );
});

export default ChartPlaceholder;
