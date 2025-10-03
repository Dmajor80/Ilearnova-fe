import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Star, Award, Target, BookOpen, Users, Calendar, Filter, Download, Search } from 'lucide-react';

const PointsHistory = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  // Mock data for demonstration
  useEffect(() => {
    const mockTransactions = [
      {
        id: 1,
        type: 'module_completion',
        description: 'Completed "Introduction to Mathematics" module',
        points: 10,
        date: '2024-01-28T14:30:00Z',
        category: 'learning'
      },
      {
        id: 2,
        type: 'badge_earned',
        description: 'Earned "First Steps" badge',
        points: 25,
        date: '2024-01-28T10:15:00Z',
        category: 'achievement'
      },
      {
        id: 3,
        type: 'perfect_score',
        description: 'Achieved perfect score on "Basic Algebra" quiz',
        points: 25,
        date: '2024-01-27T16:45:00Z',
        category: 'performance'
      },
      {
        id: 4,
        type: 'streak_bonus',
        description: '7-day learning streak bonus',
        points: 15,
        date: '2024-01-27T09:00:00Z',
        category: 'streak'
      },
      {
        id: 5,
        type: 'forum_help',
        description: 'Helped another student in forum discussion',
        points: 15,
        date: '2024-01-26T11:20:00Z',
        category: 'social'
      },
      {
        id: 6,
        type: 'module_completion',
        description: 'Completed "English Reading Skills" module',
        points: 10,
        date: '2024-01-25T13:10:00Z',
        category: 'learning'
      },
      {
        id: 7,
        type: 'badge_earned',
        description: 'Earned "Week Warrior" badge',
        points: 50,
        date: '2024-01-25T08:30:00Z',
        category: 'achievement'
      },
      {
        id: 8,
        type: 'daily_login',
        description: 'Daily login bonus',
        points: 5,
        date: '2024-01-24T07:00:00Z',
        category: 'engagement'
      },
      {
        id: 9,
        type: 'video_call',
        description: 'Participated in scheduled video call',
        points: 10,
        date: '2024-01-23T15:00:00Z',
        category: 'participation'
      },
      {
        id: 10,
        type: 'assignment_submission',
        description: 'Submitted assignment on time',
        points: 20,
        date: '2024-01-22T12:00:00Z',
        category: 'performance'
      }
    ];

    const mockStats = {
      totalPoints: 1850,
      thisWeek: 120,
      thisMonth: 450,
      totalTransactions: mockTransactions.length,
      averagePerDay: 8.5
    };

    setTimeout(() => {
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, [userId]);

  useEffect(() => {
    const filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || transaction.category === filterType;
      const matchesDate = filterDate === 'all' || checkDateFilter(transaction.date, filterDate);
      return matchesSearch && matchesType && matchesDate;
    });
    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, filterType, filterDate]);

  const checkDateFilter = (dateString, filter) => {
    const date = new Date(dateString);
    const now = new Date();

    switch (filter) {
      case 'today':
        return date.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return date >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return date >= monthAgo;
      default:
        return true;
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'module_completion':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'badge_earned':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'perfect_score':
        return <Target className="w-5 h-5 text-green-500" />;
      case 'streak_bonus':
        return <TrendingUp className="w-5 h-5 text-orange-500" />;
      case 'forum_help':
        return <Users className="w-5 h-5 text-purple-500" />;
      case 'daily_login':
        return <Star className="w-5 h-5 text-indigo-500" />;
      case 'video_call':
        return <Users className="w-5 h-5 text-pink-500" />;
      case 'assignment_submission':
        return <Target className="w-5 h-5 text-teal-500" />;
      default:
        return <Star className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'learning': return 'bg-blue-100 text-blue-800';
      case 'achievement': return 'bg-yellow-100 text-yellow-800';
      case 'performance': return 'bg-green-100 text-green-800';
      case 'streak': return 'bg-orange-100 text-orange-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      case 'engagement': return 'bg-indigo-100 text-indigo-800';
      case 'participation': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniqueCategories = () => {
    return ['all', ...new Set(transactions.map(item => item.category))];
  };

  const exportHistory = () => {
    // Mock export functionality
    const csvContent = [
      ['Date', 'Description', 'Category', 'Points'],
      ...filteredTransactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.description,
        t.category,
        t.points
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'points-history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Points History</h1>
          <p className="text-gray-600 mt-1">Track your points earned and activities</p>
        </div>
        <button
          onClick={exportHistory}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPoints?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">+{stats.thisWeek}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">+{stats.thisMonth}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Daily Average</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averagePerDay}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {getUniqueCategories().map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(transaction.category)}`}>
                      {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-semibold text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +{transaction.points}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()} at {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Points Breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Points Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {transactions.filter(t => t.category === 'learning').reduce((sum, t) => sum + t.points, 0)}
            </div>
            <div className="text-sm text-gray-600">Learning Points</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(transactions.filter(t => t.category === 'learning').reduce((sum, t) => sum + t.points, 0) / stats.totalPoints) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {transactions.filter(t => t.category === 'achievement').reduce((sum, t) => sum + t.points, 0)}
            </div>
            <div className="text-sm text-gray-600">Achievement Points</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(transactions.filter(t => t.category === 'achievement').reduce((sum, t) => sum + t.points, 0) / stats.totalPoints) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {transactions.filter(t => t.category === 'performance').reduce((sum, t) => sum + t.points, 0)}
            </div>
            <div className="text-sm text-gray-600">Performance Points</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${(transactions.filter(t => t.category === 'performance').reduce((sum, t) => sum + t.points, 0) / stats.totalPoints) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsHistory;
