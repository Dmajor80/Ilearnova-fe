import React, { useState, useEffect } from 'react';
import { Trophy, Star, Award, Medal, Crown, Target, BookOpen, Clock, TrendingUp, Zap } from 'lucide-react';

const AchievementDisplay = ({ learnerId }) => {
  const [achievements, setAchievements] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockAchievements = [
      {
        id: 1,
        title: 'First Steps',
        description: 'Completed your first learning module',
        category: 'milestone',
        earnedDate: '2024-01-15T10:00:00Z',
        icon: 'trophy',
        rarity: 'common',
        points: 10,
        earned: true
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
        earned: true
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
        earned: true
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
        earned: true
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
        progress: 12
      }
    ];

    setTimeout(() => {
      setAchievements(mockAchievements);
      setFilteredAchievements(mockAchievements);
      setLoading(false);
    }, 1000);
  }, [learnerId]);

  useEffect(() => {
    const filtered = achievements.filter(achievement => {
      return filterCategory === 'all' || achievement.category === filterCategory;
    });
    setFilteredAchievements(filtered);
  }, [achievements, filterCategory]);

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

  const getAchievementIcon = (icon, earned, size = 'w-8 h-8') => {
    const iconClass = `${size} ${earned ? 'text-yellow-500' : 'text-gray-400'}`;

    switch (icon) {
      case 'trophy': return <Trophy className={iconClass} />;
      case 'flame': return <TrendingUp className={iconClass} />;
      case 'calculator': return <Target className={iconClass} />;
      case 'zap': return <Zap className={iconClass} />;
      case 'clock': return <Clock className={iconClass} />;
      case 'star': return <Star className={iconClass} />;
      case 'book': return <BookOpen className={iconClass} />;
      case 'users': return <Medal className={iconClass} />;
      default: return <Award className={iconClass} />;
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
      case 'social': return <Award className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getUniqueCategories = () => {
    return ['all', ...new Set(achievements.map(item => item.category))];
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const totalPoints = earnedAchievements.reduce((sum, a) => sum + a.points, 0);
  const completionRate = Math.round((earnedAchievements.length / achievements.length) * 100);

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
          <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
          <p className="text-gray-600 mt-1">Track your learning milestones and accomplishments</p>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Earned</p>
              <p className="text-2xl font-bold text-gray-900">{earnedAchievements.length}</p>
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
              <p className="text-sm text-gray-600">Next Goal</p>
              <p className="text-2xl font-bold text-gray-900">
                {achievements.filter(a => !a.earned).length}
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

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-md ${
              achievement.earned
                ? getRarityColor(achievement.rarity)
                : 'border-gray-200 bg-gray-50 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${achievement.earned ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                  {getAchievementIcon(achievement.icon)}
                </div>
                <div>
                  <h3 className={`font-semibold ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                    {achievement.title}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {getCategoryIcon(achievement.category)}
                    <span className="text-xs text-gray-500 capitalize">{achievement.category}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs font-semibold uppercase ${getRarityTextColor(achievement.rarity)}`}>
                  {achievement.rarity}
                </div>
                <div className="text-sm font-bold text-gray-600 mt-1">
                  {achievement.points} pts
                </div>
              </div>
            </div>

            <p className={`text-sm mb-4 ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}>
              {achievement.description}
            </p>

            {/* Progress Bar for Unearned Achievements */}
            {!achievement.earned && achievement.progress !== undefined && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{achievement.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${achievement.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Earned Date */}
            {achievement.earned && achievement.earnedDate && (
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Earned on {new Date(achievement.earnedDate).toLocaleDateString()}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span>Earned</span>
                </div>
              </div>
            )}

            {/* Not Earned Yet */}
            {!achievement.earned && (
              <div className="flex items-center justify-center text-xs text-gray-400 mt-4">
                <Award className="w-3 h-3 mr-1" />
                <span>Not earned yet</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Achievement Categories Legend */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Categories</h3>
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
            <Award className="w-4 h-4 text-pink-500" />
            <span className="text-sm text-gray-600">Social</span>
          </div>
        </div>
      </div>

      {/* Rarity Legend */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rarity Levels</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-gray-300 bg-gray-50 rounded"></div>
            <span className="text-sm text-gray-600">Common</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-green-300 bg-green-50 rounded"></div>
            <span className="text-sm text-gray-600">Uncommon</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-300 bg-blue-50 rounded"></div>
            <span className="text-sm text-gray-600">Rare</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-purple-300 bg-purple-50 rounded"></div>
            <span className="text-sm text-gray-600">Epic</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-yellow-300 bg-yellow-50 rounded"></div>
            <span className="text-sm text-gray-600">Legendary</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementDisplay;
