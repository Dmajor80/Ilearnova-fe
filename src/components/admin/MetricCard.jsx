import React from "react";
import { 
  Users, 
  BookOpen, 
  Clock, 
  Activity, 
  LogIn, 
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

/**
 * Reusable metric card component for dashboard statistics.
 * Displays a metric value with icon, label, description, and optional trend.
 */
const MetricCard = React.memo(function MetricCard({
  id,
  value,
  label,
  description,
  iconType = "default",
  trend = null, // { direction: "up" | "down" | "neutral", value: "5.2%", period: "vs last month" }
  onClick,
  loading = false,
  error = false,
  className = "",
  size = "default" // "small" | "default" | "large"
}) {
  const IconComponent = getIconComponent(iconType);
  
  const sizeClasses = {
    small: "p-4",
    default: "p-6",
    large: "p-8"
  };
  
  const valueSizeClasses = {
    small: "text-xl",
    default: "text-2xl md:text-3xl",
    large: "text-3xl md:text-4xl"
  };

  const handleClick = () => {
    if (onClick && !loading && !error) {
      onClick(id);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && onClick && !loading && !error) {
      e.preventDefault();
      onClick(id);
    }
    // Handle escape key to remove focus
    if (e.key === "Escape") {
      e.target.blur();
    }
  };

  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100 
        transition-all duration-200 ease-in-out
        ${onClick && !loading && !error ? "cursor-pointer hover:shadow-md hover:border-blue-200 hover:scale-105" : ""}
        ${error ? "border-red-200 bg-red-50" : ""}
        ${loading ? "animate-pulse" : ""}
        ${sizeClasses[size]}
        ${className}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick && !loading && !error ? 0 : -1}
      role={onClick ? "button" : "article"}
      aria-label={onClick ? `View details for ${label}` : `${label}: ${value}`}
      aria-describedby={`${id}-description`}
      aria-live={loading ? "polite" : undefined}
      aria-busy={loading}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Icon and Value Row */}
          <div className="flex items-center mb-3">
            <div className={`
              p-3 rounded-full mr-4 transition-colors
              ${error ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}
            `}>
              {loading ? (
                <div className="w-6 h-6 bg-gray-300 rounded animate-pulse" />
              ) : (
                <IconComponent className="w-6 h-6" aria-hidden="true" />
              )}
            </div>
            
            <div className="flex-1">
              {/* Value */}
              <div className={`
                font-bold text-gray-900 leading-none
                ${valueSizeClasses[size]}
                ${loading ? "bg-gray-300 rounded h-8 animate-pulse" : ""}
              `}>
                {loading ? "" : error ? "Error" : value}
              </div>
              
              {/* Trend Indicator */}
              {trend && !loading && !error && (
                <div className="flex items-center mt-1">
                  {trend.direction === "up" && (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" aria-hidden="true" />
                  )}
                  {trend.direction === "down" && (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" aria-hidden="true" />
                  )}
                  {trend.direction === "neutral" && (
                    <Minus className="w-4 h-4 text-gray-500 mr-1" aria-hidden="true" />
                  )}
                  <span className={`
                    text-sm font-medium
                    ${trend.direction === "up" ? "text-green-600" : ""}
                    ${trend.direction === "down" ? "text-red-600" : ""}
                    ${trend.direction === "neutral" ? "text-gray-600" : ""}
                  `}>
                    {trend.value}
                  </span>
                  {trend.period && (
                    <span className="text-sm text-gray-500 ml-1">
                      {trend.period}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Label */}
          <h3 className={`
            font-semibold text-gray-800 mb-2
            ${size === "small" ? "text-sm" : "text-base"}
            ${loading ? "bg-gray-300 rounded h-5 animate-pulse" : ""}
          `}>
            {loading ? "" : label}
          </h3>
          
          {/* Description */}
          <p
            id={`${id}-description`}
            className={`
              text-gray-600 leading-relaxed
              ${size === "small" ? "text-xs" : "text-sm"}
              ${loading ? "bg-gray-300 rounded h-4 animate-pulse" : ""}
            `}
          >
            {loading ? "" : description}
          </p>
        </div>
      </div>
      
      {/* Error State */}
      {error && !loading && (
        <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded-lg">
          <p className="text-red-700 text-xs">
            Failed to load data. Click to retry.
          </p>
        </div>
      )}
      
      {/* Loading State Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 rounded-xl flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
});

/**
 * Get the appropriate icon component based on type
 */
function getIconComponent(iconType) {
  const iconMap = {
    users: Users,
    book: BookOpen,
    clock: Clock,
    activity: Activity,
    login: LogIn,
    message: MessageSquare,
    default: Activity
  };
  
  return iconMap[iconType] || iconMap.default;
}

export default MetricCard;
