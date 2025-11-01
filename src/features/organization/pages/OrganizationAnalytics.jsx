import React from "react";

const OrganizationAnalytics = () => {
  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm">
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Analytics Dashboard</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 md:gap-6">
        <div className="p-3 sm:p-4 md:p-6 bg-gray-50 rounded-lg">
          <h4 className="text-sm sm:text-base font-medium mb-2">Performance Trends</h4>
          <div className="h-32 bg-white rounded p-2">
            <div className="text-center text-gray-500 mt-8">Chart Placeholder</div>
          </div>
        </div>
        <div className="p-3 sm:p-4 md:p-6 bg-gray-50 rounded-lg">
          <h4 className="text-sm sm:text-base font-medium mb-2">Attendance Overview</h4>
          <div className="h-32 bg-white rounded p-2">
            <div className="text-center text-gray-500 mt-8">Chart Placeholder</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationAnalytics;
