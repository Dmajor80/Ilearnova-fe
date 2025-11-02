import React from 'react';
import { TrendingUp, Users, BookOpen, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

const QuickStatsCard = ({ title, value, subtitle, icon, color = 'blue', trend, trendUp }) => {
  const getIcon = () => {
    switch (icon) {
      case 'users':
        return <Users className="w-6 h-6" />;
      case 'book':
        return <BookOpen className="w-6 h-6" />;
      case 'calendar':
        return <Calendar className="w-6 h-6" />;
      case 'alert':
        return <AlertTriangle className="w-6 h-6" />;
      case 'check':
        return <CheckCircle className="w-6 h-6" />;
      case 'award':
        return <CheckCircle className="w-6 h-6" />;
      case 'trending-up':
        return <TrendingUp className="w-6 h-6" />;
      default:
        return <TrendingUp className="w-6 h-6" />;
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'red':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'yellow':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'purple':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'indigo':
        return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      case 'teal':
        return 'bg-teal-50 text-teal-600 border-teal-200';
      default:
        return 'bg-blue-50 text-blue-600 border-blue-200';
    }
  };

  const getTrendIcon = () => {
    if (trendUp === null) return null;
    return trendUp ? (
      <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
    ) : (
      <TrendingUp className="w-3 h-3 mr-1 text-red-600 rotate-180" />
    );
  };

  return (
    <div className={`p-4 rounded-lg border ${getColorClasses()} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              {getTrendIcon()}
              <span className={`text-xs font-medium ${trendUp === null ? 'text-gray-600' : trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className="ml-4">
          {getIcon()}
        </div>
      </div>
    </div>
  );
};

export default QuickStatsCard;
