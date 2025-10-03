import React, { useState, useEffect } from 'react';
import { Trophy, Star, Award, Medal, Crown, Target, BookOpen, Clock, TrendingUp, Zap, Users, Heart } from 'lucide-react';

const BadgeDisplay = ({ userId }) => {
  const [badges, setBadges] = useState([]);
  const [filteredBadges, setFilteredBadges] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockBadges = [
      {
        id: 1,
        title: 'First Steps',
        description: 'Completed your first learning module',
        category: 'milestone',
        earnedDate: '2024-01-15T10:00:00Z',
        icon: 'trophy',
        rarity: 'common',
        points: 10,
        earned: true,
        color: 'yellow'
      },
      {
        id: 2,
        title: 'Week Warrior',
        description: 'Learned for 7 consecutive days',
        category: 'streak',
        earnedDate: '2024-01-20T10:00:00Z',
        icon: 'flame',
        rarity: 'uncommon',
        points: 25,
        earned: true,
        color: 'orange'
      },
      {
        id: 3,
        title: 'Math Master',
        description: 'Completed all mathematics modules with 90%+ score',
        category: 'subject',
        earnedDate: '2024-01-25T10:00:00Z',
        icon: 'calculator',
        rarity: 'rare',
        points: 50,
        earned: true,
        color: 'blue'
      },
      {
        id: 4,
        title: 'Speed Demon',
        description: 'Completed a module in record time',
        category: 'performance',
        earnedDate: '2024-01-22T14:30:00Z',
        icon: 'zap',
        rarity: 'epic',
        points: 75,
        earned: true,
        color: 'purple'
      },
      {
        id: 5,
        title: 'Century Club',
        description: 'Spent 100 hours learning',
        category: 'time',
        earnedDate: null,
        icon: 'clock',
        rarity: 'legendary',
        points: 100,
        earned: false,
        color: 'gold',
        progress: 67
      },
      {
        id: 6,
        title: 'Perfect Score',
        description: 'Achieved 100% on any assessment',
        category: 'performance',
        earnedDate: null,
        icon: 'star',
        rarity: 'rare',
        points: 30,
        earned: false,
        color: 'silver',
        progress: 0
      },
      {
        id: 7,
        title: 'Bookworm',
        description: 'Read 50 different learning materials',
        category: 'engagement',
        earnedDate: null,
        icon: 'book',
        rarity: 'uncommon',
        points: 20,
        earned: false,
        color: 'green',
        progress: 32
      },
      {
        id: 8,
        title: 'Social Butterfly',
        description: 'Participated in 25 forum discussions',
        category: 'social',
        earnedDate: null,
        icon: 'users',
        rarity: 'common',
        points: 15,
        earned: false,
        color: 'pink',
        progress: 12
      },
      {
        id: 9,
        title: 'Helper',
        description: 'Helped 10 other learners',
        category: 'social',
        earnedDate: null,
        icon: 'heart',
        rarity: 'uncommon',
        points: 25,
        earned: false,
        color: 'red',
        progress: 60
      }
    ];

    setTimeout(() => {
      setBadges(mockBadges);
      setFilteredBadges(mockBadges);
      setLoading(false);
    }, 1000);
  }, [userId]);

  useEffect(() => {
    const filtered = badges.filter(badge => {
      return filterCategory === 'all' || badge.category === filterCategory;
    });
    setFilteredBadges(filtered);
  }, [badges, filterCategory]);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'uncommon': return 'border-green-300 bg-green-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityTextColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'uncommon': return 'text-green-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getBadgeIcon = (icon, earned, size = 'w-12 h-12') => {
    const iconClass = `${size} ${earned ? 'text-white' : 'text-gray-400'}`;

    switch (icon) {
      case 'trophy': return <Trophy className={iconClass} />;
      case 'flame': return <TrendingUp className={iconClass} />;
      case 'calculator': return <Target className={iconClass} />;
      case 'zap': return <Zap className={iconClass} />;
      case 'clock': return <Clock className={iconClass} />;
      case 'star': return <Star className={iconClass} />;
      case 'book': return <BookOpen className={iconClass} />;
      case 'users': return <Users className={iconClass} />;
      case 'heart': return <Heart className={iconClass} />;
      default: return <Award className={iconClass} />;
    }
  };

  const getBadgeBackground = (color, earned) => {
    if (!earned) return 'bg-gray-200';

    switch (color) {
      case 'yellow': return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
      case 'orange': return 'bg-gradient-to-br from-orange-400 to-orange-600';
      case 'blue': return 'bg-gradient-to-br from-blue-400 to-blue-600';
      case 'purple': return 'bg-gradient-to-br from-purple-400 to-purple-600';
      case 'gold': return 'bg-gradient-to-br from-yellow-300 to-yellow-500';
      case 'silver': return 'bg-gradient-to-br from-gray-300 to-gray-500';
      case 'green': return 'bg-gradient-to-br from-green-400 to-green-600';
      case 'pink': return 'bg-gradient-to-br from-pink-400 to-pink-600';
      case 'red': return 'bg-gradient-to-br from-red-400 to-red-600';
      default: return 'bg-gradient-to-br from-gray-400 to-gray-600';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'milestone': return <Trophy className="w-4 h-4" />;
      case 'streak': return <TrendingUp className="w-4 h-4" />;
      case 'subject': return <BookOpen className="w-4 h-4" />;
      case 'performance': return <Target className="w-4 h-4" />;
      case 'time': return <Clock className="w-4 h-4" />;
      case 'engagement': return <Star className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getUniqueCategories = () => {
    return ['all', ...new Set(badges.map(item => item.category))];
  };

  const earnedBadges = badges.filter(b => b.earned);
  const totalPoints = earnedBadges.reduce((sum, b) => sum + b.points, 0);
  const completionRate = Math.round((earnedBadges.length / badges.length) * 100);

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Badges</h1>
          <p className="text-gray-600 mt-1">Showcase your achievements and milestones</p>
        </div>
      </div>

      {/* Badge Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Earned Badges</p>
              <p className="text-2xl font-bold text-gray-900">{earnedBadges.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-gray-900">{totalPoints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Badge</p>
              <p className="text-2xl font-bold text-gray-900">
                {badges.filter(b => !b.earned).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {getUniqueCategories().map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBadges.map((badge) => (
          <div
            key={badge.id}
            className={`relative border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${
              badge.earned ? getRarityColor(badge.rarity) : 'border-gray-200 bg-gray-50'
            } ${badge.earned ? 'hover:scale-105' : ''}`}
          >
            {/* Badge Icon */}
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full ${getBadgeBackground(badge.color, badge.earned)} shadow-lg`}>
                {getBadgeIcon(badge.icon, badge.earned)}
              </div>
            </div>

            {/* Badge Content */}
            <div className="text-center">
              <h3 className={`font-bold text-lg mb-2 ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                {badge.title}
              </h3>
              <p className={`text-sm mb-3 ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                {badge.description}
              </p>

              {/* Category and Rarity */}
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="flex items-center space-x-1">
                  {getCategoryIcon(badge.category)}
                  <span className="text-xs text-gray-500 capitalize">{badge.category}</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className={`text-xs font-semibold uppercase ${getRarityTextColor(badge.rarity)}`}>
                  {badge.rarity}
                </span>
              </div>

              {/* Points */}
              <div className="text-sm font-bold text-gray-600 mb-3">
                {badge.points} points
              </div>

              {/* Progress Bar for Unearned Badges */}
              {!badge.earned && badge.progress !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{badge.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${badge.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Earned Date or Status */}
              {badge.earned && badge.earnedDate ? (
                <div className="flex items-center justify-center text-xs text-gray-500">
                  <Star className="w-3 h-3 text-yellow-500 mr-1" />
                  Earned {new Date(badge.earnedDate).toLocaleDateString()}
                </div>
              ) : (
                <div className="flex items-center justify-center text-xs text-gray-400">
                  <Award className="w-3 h-3 mr-1" />
                  Not earned yet
                </div>
              )}
            </div>

            {/* Rarity Indicator */}
            {badge.earned && (
              <div className="absolute top-2 right-2">
                <div className={`w-3 h-3 rounded-full ${
                  badge.rarity === 'legendary' ? 'bg-yellow-400' :
                  badge.rarity === 'epic' ? 'bg-purple-400' :
                  badge.rarity === 'rare' ? 'bg-blue-400' :
                  badge.rarity === 'uncommon' ? 'bg-green-400' :
                  'bg-gray-400'
                } shadow-sm`}></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Badge Categories Legend */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Badge Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">Milestone</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-600">Streak</span>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">Subject</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">Performance</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-600">Time</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-indigo-500" />
            <span className="text-sm text-gray-600">Engagement</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-pink-500" />
            <span className="text-sm text-gray-600">Social</span>
          </div>
        </div>
      </div>

      {/* Achievement Showcase */}
      {earnedBadges.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Achievement Showcase</h3>
              <p className="text-yellow-100">You've earned {earnedBadges.length} badges and {totalPoints} points!</p>
            </div>
            <div className="flex space-x-2">
              {earnedBadges.slice(0, 5).map((badge, index) => (
                <div key={badge.id} className={`p-2 rounded-full ${getBadgeBackground(badge.color, true)} shadow-lg`}>
                  {getBadgeIcon(badge.icon, true, 'w-6 h-6')}
                </div>
              ))}
              {earnedBadges.length > 5 && (
                <div className="flex items-center justify-center w-10 h-10 bg-black bg-opacity-20 rounded-full">
                  <span className="text-sm font-bold">+{earnedBadges.length - 5}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;
