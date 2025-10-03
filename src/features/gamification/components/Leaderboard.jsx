import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown, TrendingUp, Star, Users, Target, Calendar, Filter } from 'lucide-react';

const Leaderboard = ({ timeframe = 'all' }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockLeaderboard = [
      {
        id: 1,
        name: 'Alice Johnson',
        avatar: '/api/placeholder/40/40',
        points: 2450,
        badges: 12,
        streak: 28,
        rank: 1,
        change: 0,
        category: 'overall'
      },
      {
        id: 2,
        name: 'Bob Smith',
        avatar: '/api/placeholder/40/40',
        points: 2230,
        badges: 10,
        streak: 15,
        rank: 2,
        change: 1,
        category: 'overall'
      },
      {
        id: 3,
        name: 'Charlie Brown',
        avatar: '/api/placeholder/40/40',
        points: 2100,
        badges: 9,
        streak: 22,
        rank: 3,
        change: -1,
        category: 'overall'
      },
      {
        id: 4,
        name: 'Diana Wilson',
        avatar: '/api/placeholder/40/40',
        points: 1980,
        badges: 8,
        streak: 18,
        rank: 4,
        change: 2,
        category: 'overall'
      },
      {
        id: 5,
        name: 'Current User',
        avatar: '/api/placeholder/40/40',
        points: 1850,
        badges: 7,
        streak: 12,
        rank: 5,
        change: 0,
        category: 'overall',
        isCurrentUser: true
      },
      {
        id: 6,
        name: 'Eva Martinez',
        avatar: '/api/placeholder/40/40',
        points: 1720,
        badges: 6,
        streak: 8,
        rank: 6,
        change: -2,
        category: 'overall'
      },
      {
        id: 7,
        name: 'Frank Garcia',
        avatar: '/api/placeholder/40/40',
        points: 1650,
        badges: 5,
        streak: 25,
        rank: 7,
        change: 1,
        category: 'overall'
      },
      {
        id: 8,
        name: 'Grace Lee',
        avatar: '/api/placeholder/40/40',
        points: 1580,
        badges: 4,
        streak: 14,
        rank: 8,
        change: 0,
        category: 'overall'
      }
    ];

    const mockCurrentUser = {
      id: 5,
      name: 'Current User',
      avatar: '/api/placeholder/40/40',
      points: 1850,
      badges: 7,
      streak: 12,
      rank: 5
    };

    setTimeout(() => {
      setLeaderboard(mockLeaderboard);
      setCurrentUser(mockCurrentUser);
      setLoading(false);
    }, 1000);
  }, [selectedTimeframe, selectedCategory]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBadge = (rank) => {
    if (rank <= 3) {
      return rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
             rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
             'bg-gradient-to-r from-amber-400 to-amber-600';
    }
    return 'bg-gray-100';
  };

  const getChangeIndicator = (change) => {
    if (change > 0) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (change < 0) {
      return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    }
    return <div className="w-4 h-4" />;
  };

  const getChangeText = (change) => {
    if (change > 0) return `+${change}`;
    if (change < 0) return change.toString();
    return '—';
  };

  const timeframes = [
    { value: 'daily', label: 'Today' },
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'all', label: 'All Time' }
  ];

  const categories = [
    { value: 'overall', label: 'Overall' },
    { value: 'points', label: 'Points' },
    { value: 'badges', label: 'Badges' },
    { value: 'streak', label: 'Streaks' }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600 mt-1">See how you rank among other learners</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {timeframes.map(timeframe => (
                <option key={timeframe.value} value={timeframe.value}>
                  {timeframe.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Top Performers</h3>
        <div className="flex justify-center items-end space-x-4">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">{leaderboard[1]?.name}</p>
              <p className="text-sm text-gray-600">{leaderboard[1]?.points} pts</p>
            </div>
            <div className="w-16 h-24 bg-gradient-to-t from-gray-200 to-gray-300 rounded-t-lg mt-2 flex items-end justify-center pb-2">
              <Medal className="w-6 h-6 text-gray-600" />
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">{leaderboard[0]?.name}</p>
              <p className="text-sm text-gray-600">{leaderboard[0]?.points} pts</p>
            </div>
            <div className="w-20 h-32 bg-gradient-to-t from-yellow-200 to-yellow-300 rounded-t-lg mt-2 flex items-end justify-center pb-2">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">{leaderboard[2]?.name}</p>
              <p className="text-sm text-gray-600">{leaderboard[2]?.points} pts</p>
            </div>
            <div className="w-16 h-20 bg-gradient-to-t from-amber-200 to-amber-300 rounded-t-lg mt-2 flex items-end justify-center pb-2">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Full Rankings</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Learner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badges</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Streak</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboard.map((user) => (
                <tr key={user.id} className={`${user.isCurrentUser ? 'bg-blue-50' : 'hover:bg-gray-50'} transition-colors`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankBadge(user.rank)}`}>
                        {getRankIcon(user.rank)}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className={`text-sm font-medium ${user.isCurrentUser ? 'text-blue-600' : 'text-gray-900'}`}>
                          {user.name}
                          {user.isCurrentUser && <span className="ml-2 text-xs text-blue-600">(You)</span>}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    {user.points.toLocaleString()}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      {user.badges}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Target className="w-4 h-4 text-green-500 mr-1" />
                      {user.streak} days
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      {getChangeIndicator(user.change)}
                      <span className={`ml-1 ${user.change > 0 ? 'text-green-600' : user.change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        {getChangeText(user.change)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Current User Stats */}
      {currentUser && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Your Ranking</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-blue-100 text-sm">Current Rank</p>
                  <p className="text-2xl font-bold">#{currentUser.rank}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Total Points</p>
                  <p className="text-2xl font-bold">{currentUser.points.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Badges Earned</p>
                  <p className="text-2xl font-bold">{currentUser.badges}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Current Streak</p>
                  <p className="text-2xl font-bold">{currentUser.streak} days</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Rules */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How Rankings Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Point System</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Complete modules: +10 points</li>
              <li>• Earn badges: +5-100 points</li>
              <li>• Perfect scores: +25 points</li>
              <li>• Help others: +15 points</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Ranking Criteria</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Primary: Total points earned</li>
              <li>• Secondary: Number of badges</li>
              <li>• Tertiary: Current streak</li>
              <li>• Updates: Daily at midnight</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
