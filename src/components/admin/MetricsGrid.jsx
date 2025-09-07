import React from "react";
import MetricCard from "./MetricCard";
import { MetricsGridSkeleton } from "./DashboardSkeleton";

/**
 * Metrics grid layout component for dashboard.
 * Renders a responsive grid of metric cards with loading and error states.
 */
const MetricsGrid = React.memo(function MetricsGrid({
  metrics = [],
  loading = false,
  error = null,
  onMetricClick,
  onRetry,
  columns = 3,
  className = ""
}) {
  // Grid column classes for responsive design
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
  };

  const gridClass = gridClasses[columns] || gridClasses[3];

  // Show loading skeleton
  if (loading && metrics.length === 0) {
    return (
      <MetricsGridSkeleton 
        count={6} 
        columns={columns}
        className={className}
      />
    );
  }

  // Show error state
  if (error && metrics.length === 0) {
    return (
      <div className={`${className}`}>
        <ErrorState 
          message={error}
          onRetry={onRetry}
        />
      </div>
    );
  }

  // Show empty state
  if (!loading && metrics.length === 0) {
    return (
      <div className={`${className}`}>
        <EmptyState />
      </div>
    );
  }

  return (
    <section 
      className={`grid ${gridClass} gap-6 ${className}`}
      aria-label="Dashboard metrics"
    >
      {metrics.map((metric, index) => (
        <MetricCard
          key={metric.id || index}
          id={metric.id}
          value={metric.value}
          label={metric.label}
          description={metric.description}
          iconType={metric.iconType}
          trend={metric.trend}
          onClick={onMetricClick}
          loading={loading}
          error={metric.error}
        />
      ))}
    </section>
  );
});

/**
 * Error state component for metrics grid
 */
const ErrorState = React.memo(function ErrorState({ 
  message = "Failed to load metrics", 
  onRetry 
}) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  const handleRetryKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && onRetry) {
      e.preventDefault();
      onRetry();
    }
  };

  return (
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
          Unable to Load Metrics
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {message}
        </p>
        
        {onRetry && (
          <button
            onClick={handleRetry}
            onKeyDown={handleRetryKeyDown}
            className={`
              px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
              transition-all duration-200 ease-in-out
              hover:bg-blue-700 focus:bg-blue-700
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
            aria-label="Retry loading metrics"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
});

/**
 * Empty state component for metrics grid
 */
const EmptyState = React.memo(function EmptyState() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg 
            className="w-8 h-8 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Metrics Available
        </h3>
        
        <p className="text-gray-600 max-w-md mx-auto">
          Dashboard metrics will appear here once data is available.
        </p>
      </div>
    </div>
  );
});

/**
 * Metrics grid with custom layout for specific use cases
 */
export const FeaturedMetricsGrid = React.memo(function FeaturedMetricsGrid({
  primaryMetrics = [],
  secondaryMetrics = [],
  loading = false,
  error = null,
  onMetricClick,
  className = ""
}) {
  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <MetricsGridSkeleton count={2} columns={2} />
        <MetricsGridSkeleton count={4} columns={4} />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Primary Metrics - Larger cards */}
      {primaryMetrics.length > 0 && (
        <section aria-label="Primary metrics">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Key Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {primaryMetrics.map((metric, index) => (
              <MetricCard
                key={metric.id || index}
                {...metric}
                onClick={onMetricClick}
                size="large"
              />
            ))}
          </div>
        </section>
      )}

      {/* Secondary Metrics - Smaller cards */}
      {secondaryMetrics.length > 0 && (
        <section aria-label="Secondary metrics">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {secondaryMetrics.map((metric, index) => (
              <MetricCard
                key={metric.id || index}
                {...metric}
                onClick={onMetricClick}
                size="small"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
});

export default MetricsGrid;
