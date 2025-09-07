import React from "react";
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Utensils,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

/**
 * Reusable stats card component for school dashboard.
 * Displays school metrics with icon, value, label, and optional trend.
 */
const SchoolStatsCard = React.memo(function SchoolStatsCard({
  id,
  value,
  label,
  description,
  iconType = "users",
  trend = null, // { direction: "up" | "down" | "neutral", value: "5.2%", period: "vs last month" }
  onClick,
  loading = false,
  error = false,
  className = "",
  variant = "default" // "default" | "compact" | "detailed"
}) {
  const IconComponent = getIconComponent(iconType);
  
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

  // Get icon background color based on type
  const getIconBgColor = (type) => {
    const colorMap = {
      users: "bg-indigo-100 text-indigo-600",
      userCheck: "bg-orange-100 text-orange-600", 
      calendar: "bg-yellow-100 text-yellow-600",
      utensils: "bg-slate-100 text-slate-600",
      default: "bg-blue-100 text-blue-600"
    };
    return colorMap[type] || colorMap.default;
  };

  const iconBgColor = getIconBgColor(iconType);

  if (variant === "compact") {
    return (
      <div
        className={`
          bg-white rounded-lg p-4 shadow-sm border border-gray-100 
          transition-all duration-200 ease-in-out
          ${onClick && !loading && !error ? "cursor-pointer hover:shadow-md hover:border-blue-200" : ""}
          ${error ? "border-red-200 bg-red-50" : ""}
          ${loading ? "animate-pulse" : ""}
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
        aria-atomic="true"
      >
        <div className="flex items-center">
          <div className={`p-2 rounded-full ${iconBgColor} mr-3`}>
            {loading ? (
              <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
            ) : (
              <IconComponent className="w-4 h-4" aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="text-gray-500 text-xs">{loading ? "" : label}</p>
            <p className="text-lg font-bold text-gray-800">
              {loading ? "..." : error ? "Error" : value}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-white rounded-xl p-6 shadow-sm border border-gray-100 
        transition-all duration-200 ease-in-out
        ${onClick && !loading && !error ? "cursor-pointer hover:shadow-md hover:border-blue-200 hover:scale-105" : ""}
        ${error ? "border-red-200 bg-red-50" : ""}
        ${loading ? "animate-pulse" : ""}
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
      <div className="flex items-center">
        {/* Icon */}
        <div className={`p-3 rounded-full ${iconBgColor} mr-4`}>
          {loading ? (
            <div className="w-6 h-6 bg-gray-300 rounded animate-pulse" />
          ) : (
            <IconComponent className="w-6 h-6" aria-hidden="true" />
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          {/* Value */}
          <div className={`
            text-2xl font-bold text-gray-800 leading-none mb-1
            ${loading ? "bg-gray-300 rounded h-8 animate-pulse" : ""}
          `}>
            {loading ? "" : error ? "Error" : value}
          </div>
          
          {/* Label */}
          <p className={`
            text-gray-500 text-sm mb-2
            ${loading ? "bg-gray-300 rounded h-4 animate-pulse" : ""}
          `}>
            {loading ? "" : label}
          </p>
          
          {/* Trend Indicator */}
          {trend && !loading && !error && (
            <div className="flex items-center">
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
                text-xs font-medium
                ${trend.direction === "up" ? "text-green-600" : ""}
                ${trend.direction === "down" ? "text-red-600" : ""}
                ${trend.direction === "neutral" ? "text-gray-600" : ""}
              `}>
                {trend.value}
              </span>
              {trend.period && (
                <span className="text-xs text-gray-500 ml-1">
                  {trend.period}
                </span>
              )}
            </div>
          )}
          
          {/* Description for detailed variant */}
          {variant === "detailed" && description && (
            <p 
              id={`${id}-description`}
              className={`
                text-gray-600 text-xs mt-2 leading-relaxed
                ${loading ? "bg-gray-300 rounded h-3 animate-pulse" : ""}
              `}
            >
              {loading ? "" : description}
            </p>
          )}
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
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
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
    userCheck: UserCheck,
    calendar: Calendar,
    utensils: Utensils,
    default: Users
  };
  
  return iconMap[iconType] || iconMap.default;
}

/**
 * Grid component for school stats cards
 */
export const SchoolStatsGrid = React.memo(function SchoolStatsGrid({
  stats = [],
  loading = false,
  error = null,
  onStatsClick,
  onRetry,
  variant = "default",
  columns = 4,
  className = ""
}) {
  // Grid column classes for responsive design
  const gridClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  const gridClass = gridClasses[columns] || gridClasses[4];

  // Show error state
  if (error && stats.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to Load School Stats
            </h3>
            
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {error}
            </p>
            
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                aria-label="Retry loading school stats"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section 
      className={`grid ${gridClass} gap-6 ${className}`}
      aria-label="School statistics"
    >
      {stats.map((stat, index) => (
        <SchoolStatsCard
          key={stat.id || index}
          id={stat.id}
          value={stat.value}
          label={stat.label}
          description={stat.description}
          iconType={stat.iconType}
          trend={stat.trend}
          onClick={onStatsClick}
          loading={loading}
          error={stat.error}
          variant={variant}
        />
      ))}
    </section>
  );
});

export default SchoolStatsCard;
