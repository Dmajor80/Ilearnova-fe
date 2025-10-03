import React, { useState, useEffect } from 'react';
import { Trophy, Star, Award, Bell, CheckCircle, X, Clock, TrendingUp, Target, BookOpen, Users } from 'lucide-react';

const AchievementNotifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'achievement_unlocked',
        title: 'New Achievement Unlocked!',
        message: 'You earned the "First Steps" badge for completing your first learning module.',
        badge: {
          name: 'First Steps',
          icon: 'trophy',
          rarity: 'common',
          points: 10
        },
        timestamp: '2024-01-28T14:30:00Z',
        read: false,
        actionUrl: '/achievements'
      },
      {
        id: 2,
        type: 'streak_milestone',
        title: 'Streak Milestone Reached!',
        message: 'Congratulations! You\'ve maintained a 7-day learning streak.',
        badge: {
          name: 'Week Warrior',
          icon: 'flame',
          rarity: 'uncommon',
          points: 25
        },
        timestamp: '2024-01-27T09:00:00Z',
        read: false,
        actionUrl: '/achievements'
      },
      {
        id: 3,
        type: 'points_milestone',
        title: 'Points Milestone!',
        message: 'You\'ve reached 1,000 total points! Keep up the great work.',
        badge: null,
        timestamp: '2024-01-25T16:45:00Z',
        read: true,
        actionUrl: '/points'
      },
      {
        id: 4,
        type: 'leaderboard_rise',
        title: 'Leaderboard Position Improved!',
        message: 'You moved up 2 positions in the monthly leaderboard.',
        badge: null,
        timestamp: '2024-01-24T11:20:00Z',
        read: true,
        actionUrl: '/leaderboard'
      },
      {
        id: 5,
        type: 'achievement_unlocked',
        title: 'Rare Achievement Unlocked!',
        message: 'You earned the "Math Master" badge for exceptional performance.',
        badge: {
          name: 'Math Master',
          icon: 'calculator',
          rarity: 'rare',
          points: 50
        },
        timestamp: '2024-01-23T08:30:00Z',
        read: true,
        actionUrl: '/achievements'
      }
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
      setLoading(false);
    }, 1000);
  }, [userId]);

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type, badgeIcon) => {
    if (badgeIcon) {
      switch (badgeIcon) {
        case 'trophy': return <Trophy className="w-6 h-6 text-yellow-500" />;
        case 'flame': return <TrendingUp className="w-6 h-6 text-orange-500" />;
        case 'calculator': return <Target className="w-6 h-6 text-blue-500" />;
        case 'star': return <Star className="w-6 h-6 text-yellow-500" />;
        default: return <Award className="w-6 h-6 text-gray-500" />;
      }
    }

    switch (type) {
      case 'achievement_unlocked': return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'streak_milestone': return <TrendingUp className="w-6 h-6 text-orange-500" />;
      case 'points_milestone': return <Star className="w-6 h-6 text-purple-500" />;
      case 'leaderboard_rise': return <Award className="w-6 h-6 text-green-500" />;
      default: return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'achievement_unlocked': return 'border-l-yellow-500 bg-yellow-50';
      case 'streak_milestone': return 'border-l-orange-500 bg-orange-50';
      case 'points_milestone': return 'border-l-purple-500 bg-purple-50';
      case 'leaderboard_rise': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return time.toLocaleDateString();
  };

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bell className="w-8 h-8 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Achievement Notifications</h1>
            <p className="text-gray-600 mt-1">Stay updated on your learning milestones</p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Mark All Read
          </button>
        )}
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Bell className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Achievements</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.type === 'achievement_unlocked').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => {
                  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                  return new Date(n.timestamp) >= weekAgo;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {displayedNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`border-l-4 rounded-r-xl p-6 shadow-sm transition-all duration-300 ${
              notification.read ? 'bg-white border-gray-200' : `${getNotificationColor(notification.type)} border-l-4`
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type, notification.badge?.icon)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className={`font-semibold ${notification.read ? 'text-gray-900' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>

                  <p className={`text-sm mb-3 ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                    {notification.message}
                  </p>

                  {notification.badge && (
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                        {getNotificationIcon(notification.type, notification.badge.icon)}
                        <span className="text-sm font-medium">{notification.badge.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          notification.badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                          notification.badge.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {notification.badge.rarity}
                        </span>
                        <span className="text-sm text-gray-600">+{notification.badge.points} pts</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeAgo(notification.timestamp)}</span>
                    </div>
                    <span>•</span>
                    <span className="capitalize">{notification.type.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}

                {notification.actionUrl && (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                    View
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {notifications.length > 5 && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            {showAll ? 'Show Less' : `Show All (${notifications.length})`}
          </button>
        </div>
      )}

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications yet</h3>
          <p className="text-gray-600">Start learning to receive achievement notifications!</p>
        </div>
      )}

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Achievement unlocks</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Streak milestones</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Points milestones</span>
            </label>
          </div>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Leaderboard changes</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Weekly summaries</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Monthly reports</span>
            </label>
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotifications;
