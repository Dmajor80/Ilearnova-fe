import React from 'react';
import {
  Plus,
  FileText,
  Calendar,
  BarChart3,
  Users,
  Eye,
  MessageSquare,
  ClipboardList,
  CheckCircle,
} from 'lucide-react';

const getActionIcon = (iconType) => {
  switch (iconType) {
    case 'add_assignment':
      return <Plus className="w-8 h-8" />;
    case 'grading':
      return <FileText className="w-8 h-8" />;
    case 'schedule':
      return <Calendar className="w-8 h-8" />;
    case 'analytics':
      return <BarChart3 className="w-8 h-8" />;
    case 'class':
      return <Users className="w-8 h-8" />;
    case 'monitoring':
      return <Eye className="w-8 h-8" />;
    case 'message':
      return <MessageSquare className="w-8 h-8" />;
    case 'assessment':
      return <ClipboardList className="w-8 h-8" />;
    case 'attendance':
      return <CheckCircle className="w-8 h-8" />;
    default:
      return <Plus className="w-8 h-8" />;
  }
};

const getColorClasses = (color) => {
  switch (color) {
    case 'primary':
      return 'bg-blue-600 hover:bg-blue-700';
    case 'warning':
      return 'bg-yellow-600 hover:bg-yellow-700';
    case 'success':
      return 'bg-green-600 hover:bg-green-700';
    case 'info':
      return 'bg-cyan-600 hover:bg-cyan-700';
    case 'secondary':
      return 'bg-gray-600 hover:bg-gray-700';
    case 'light':
      return 'bg-gray-500 hover:bg-gray-600';
    default:
      return 'bg-blue-600 hover:bg-blue-700';
  }
};

const QuickActionsGrid = ({ actions }) => {
  if (!actions || actions.length === 0) {
    return <p className="text-gray-500 text-sm">No quick actions available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
      {actions.map((action, index) => (
        <a
          key={index}
          href={action.route}
          className={`relative flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg shadow hover:shadow-md transition-colors duration-200 text-white ${getColorClasses(action.color)}`}
        >
          <div className="mb-2">
            {getActionIcon(action.icon)}
          </div>
          <div className="text-center">
            <h4 className="font-semibold">{action.title}</h4>
            <p className="text-xs">{action.description}</p>
          </div>
          {action.badge && (
            <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 text-xs font-bold">
              {action.badge}
            </div>
          )}
        </a>
      ))}
    </div>
  );
};

export default QuickActionsGrid;
