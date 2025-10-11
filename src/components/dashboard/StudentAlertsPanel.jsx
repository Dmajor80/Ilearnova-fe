import React from 'react';
import { AlertTriangle } from 'lucide-react';

const severityColors = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-blue-100 text-blue-700',
};

const StudentAlertsPanel = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return <p className="text-gray-500 text-sm">No student alerts.</p>;
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded border ${severityColors[alert.severity] || 'bg-gray-100 text-gray-700'}`}
        >
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">{alert.student?.user?.first_name || alert.student?.name || 'Student'}</p>
            <p className="text-xs">{alert.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentAlertsPanel;
