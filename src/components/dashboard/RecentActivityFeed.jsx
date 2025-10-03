import React from 'react';
import { Clock, FileText, Award, Calendar, BookOpen, CheckCircle } from 'lucide-react';

const getActivityIcon = (iconType) => {
  switch (iconType) {
    case 'assignment':
      return <FileText className="w-5 h-5" />;
    case 'grade':
      return <Award className="w-5 h-5" />;
    case 'attendance':
      return <Calendar className="w-5 h-5" />;
    case 'exam':
      return <BookOpen className="w-5 h-5" />;
    case 'check':
      return <CheckCircle className="w-5 h-5" />;
    default:
      return <Clock className="w-5 h-5" />;
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'border-red-200 bg-red-50';
    case 'medium':
      return 'border-yellow-200 bg-yellow-50';
    case 'low':
      return 'border-blue-200 bg-blue-50';
    default:
      return 'border-gray-200 bg-white';
  }
};

const RecentActivityFeed = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return <p className="text-gray-500 text-sm">No recent activity.</p>;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div
          key={index}
          className={`flex items-start gap-3 p-3 rounded shadow-sm border ${getPriorityColor(activity.priority)}`}
        >
          <div className="flex-shrink-0 text-blue-600">
            {getActivityIcon(activity.icon)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
            {activity.subtitle && <p className="text-xs text-gray-500">{activity.subtitle}</p>}
            <p className="text-xs text-gray-400 mt-1">
              {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'N/A'}
            </p>
            {activity.student_name && (
              <p className="text-xs text-blue-600 mt-1">Student: {activity.student_name}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivityFeed;
