import React from "react";
import { ArrowRight } from "lucide-react";

const OrganizationReports = () => {
  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm">
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Reports & Documents</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 md:gap-6">
        <div className="p-3 sm:p-4 md:p-6 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-medium">Monthly Performance Report</h4>
              <p className="text-xs sm:text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>
        </div>
        <div className="p-3 sm:p-4 md:p-6 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-medium">Student Enrollment Report</h4>
              <p className="text-xs sm:text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationReports;
