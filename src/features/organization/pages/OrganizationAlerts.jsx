import React from "react";
import StudentAlertsPanel from "@/components/dashboard/StudentAlertsPanel";

const OrganizationAlerts = () => {
  // Mock alerts data - in real app, this would come from API
  const mockAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Low attendance rate in Class 10A',
      timestamp: new Date().toISOString(),
      priority: 'high'
    },
    {
      id: 2,
      type: 'info',
      message: 'New student enrollment pending approval',
      timestamp: new Date().toISOString(),
      priority: 'medium'
    }
  ];

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm">
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">System Alerts</h3>
      <StudentAlertsPanel alerts={mockAlerts} />
    </div>
  );
};

export default OrganizationAlerts;
