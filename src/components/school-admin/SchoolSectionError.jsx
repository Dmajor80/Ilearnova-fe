import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * Error display component for individual school admin sections.
 * Shows when a specific API endpoint fails without affecting other sections.
 */
const SchoolSectionError = React.memo(function SchoolSectionError({
  title = "Data Unavailable",
  message = "Failed to load data",
  onRetry,
  showRetry = true,
  className = ""
}) {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 text-center ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {message}
          </p>
        </div>
        
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
});

export default SchoolSectionError;
