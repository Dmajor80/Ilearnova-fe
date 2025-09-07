import React from "react";

/**
 * Loading skeleton component for dashboard.
 * Provides visual feedback while data is loading.
 */
const DashboardSkeleton = React.memo(function DashboardSkeleton({
  showHeader = true,
  showMetrics = true,
  showChart = true,
  metricsCount = 6,
  className = ""
}) {
  return (
    <div className={`animate-pulse ${className}`} role="status" aria-label="Loading dashboard">
      {/* Header Skeleton */}
      {showHeader && (
        <div className="flex items-center justify-between mb-8">
          {/* Left side - Welcome message */}
          <div className="flex-1">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-8 bg-gray-300 rounded w-48"></div>
              <div className="h-3 bg-gray-300 rounded w-40"></div>
            </div>
          </div>
          
          {/* Right side - Action buttons */}
          <div className="flex items-center gap-4">
            <div className="h-10 bg-gray-300 rounded-lg w-24"></div>
            <div className="h-10 bg-gray-300 rounded-lg w-24"></div>
            <div className="h-10 bg-gray-300 rounded-lg w-32"></div>
          </div>
        </div>
      )}

      {/* Metrics Grid Skeleton */}
      {showMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: metricsCount }).map((_, index) => (
            <MetricCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Chart Skeleton */}
      {showChart && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-4">
            {/* Chart header */}
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-300 rounded w-48"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
            
            {/* Chart area */}
            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-gray-400 text-sm">Chart Loading...</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Screen reader text */}
      <span className="sr-only">Loading dashboard content...</span>
    </div>
  );
});

/**
 * Skeleton for individual metric cards
 */
const MetricCardSkeleton = React.memo(function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Icon and Value Row */}
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-300 rounded w-20 mb-1"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
          
          {/* Label */}
          <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
          
          {/* Description */}
          <div className="space-y-1">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Compact skeleton for smaller loading states
 */
export const CompactDashboardSkeleton = React.memo(function CompactDashboardSkeleton({
  className = ""
}) {
  return (
    <div className={`animate-pulse space-y-4 ${className}`} role="status" aria-label="Loading">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-300 rounded w-48"></div>
        <div className="h-8 bg-gray-300 rounded w-24"></div>
      </div>
      
      {/* Content rows */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
      
      <span className="sr-only">Loading content...</span>
    </div>
  );
});

/**
 * Grid skeleton for metric cards only
 */
export const MetricsGridSkeleton = React.memo(function MetricsGridSkeleton({
  count = 6,
  columns = 3,
  className = ""
}) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div 
      className={`animate-pulse grid ${gridClasses[columns] || gridClasses[3]} gap-6 ${className}`}
      role="status" 
      aria-label="Loading metrics"
    >
      {Array.from({ length: count }).map((_, index) => (
        <MetricCardSkeleton key={index} />
      ))}
      <span className="sr-only">Loading dashboard metrics...</span>
    </div>
  );
});

export default DashboardSkeleton;
