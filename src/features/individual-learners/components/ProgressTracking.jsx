import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Target, Award, Clock, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';

const ProgressTracking = ({ learnerId }) => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockProgressData = {
      learner: {
        id: learnerId || 1,
        name: 'Alice Johnson',
        email: 'alice.johnson@email.com',
        grade: 'Grade 1',
        className: 'Grade 1A'
      },
      overallProgress: {
        completedModules: 8,
        totalModules: 12,
        overallPercentage: 67,
        timeSpent: '45 hours',
        streak: 5,
        lastActivity: '2024-01-28T10:30:00Z'
      },
      courses: [
        {
          id: 1,
          title: 'Mathematics Fundamentals',
          progress: 85,
          completedModules: 6,
          totalModules: 8,
          timeSpent: '12 hours',
          lastAccessed: '2024-01-28T09:15:00Z',
          status: 'in_progress'
        },
        {
          id: 2,
          title: 'English Reading Skills',
          progress: 100,
          completedModules: 10,
          totalModules: 10,
          timeSpent: '18 hours',
          lastAccessed: '2024-01-25T14:20:00Z',
          status: 'completed'
        },
        {
          id: 3,
          title: 'Basic Science',
          progress: 40,
          completedModules: 4,
          totalModules: 12,
          timeSpent: '8 hours',
          lastAccessed: '2024-01-27T11:45:00Z',
          status: 'in_progress'
        },
        {
          id: 4,
          title: 'History Introduction',
          progress: 0,
          completedModules: 0,
          totalModules: 15,
          timeSpent: '0 hours',
          lastAccessed: null,
          status: 'not_started'
        }
      ],
      achievements: [
        {
          id: 1,
          title: 'First Module Completed',
          description: 'Completed your first learning module',
          earnedDate: '2024-01-15T10:00:00Z',
          icon: 'trophy'
        },
        {
          id: 2,
          title: 'Week Streak',
          description: 'Learned for 7 consecutive days',
          earnedDate: '2024-01-20T10:00:00Z',
          icon: 'flame'
        },
        {
          id: 3,
          title: 'Math Master',
          description: 'Completed all mathematics modules',
          earnedDate: '2024-01-25T10:00:00Z',
          icon: 'calculator'
        }
      ],
      weeklyActivity: [
        { day: 'Mon', hours: 2.5 },
        { day: 'Tue', hours: 1.8 },
        { day: 'Wed', hours: 3.2 },
        { day: 'Thu', hours: 2.1 },
        { day: 'Fri', hours: 1.5 },
        { day: 'Sat', hours: 0.8 },
        { day: 'Sun', hours: 2.9 }
      ]
    };

    setTimeout(() => {
      setProgressData(mockProgressData);
      setLoading(false);
    }, 1000);
  }, [learnerId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'not_started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'not_started': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getAchievementIcon = (icon) => {
    switch (icon) {
      case 'trophy': return <Award className="w-6 h-6 text-yellow-500" />;
      case 'flame': return <TrendingUp className="w-6 h-6 text-orange-500" />;
      case 'calculator': return <BarChart3 className="w-6 h-6 text-blue-500" />;
      default: return <Award className="w-6 h-6 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No progress data found</h3>
        <p className="text-gray-600">Unable to load learner progress information</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Progress</h1>
          <p className="text-gray-600 mt-1">
            Track your learning journey and achievements for {progressData.learner.name}
          </p>
        </div>
      </div>

      {/* Overall Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overall Progress</p>
              <p className="text-2xl font-bold text-gray-900">{progressData.overallProgress.overallPercentage}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Modules Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {progressData.overallProgress.completedModules}/{progressData.overallProgress.totalModules}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Time Spent</p>
              <p className="text-2xl font-bold text-gray-900">{progressData.overallProgress.timeSpent}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">{progressData.overallProgress.streak} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Progress</h3>
        <div className="space-y-4">
          {progressData.courses.map((course) => (
            <div key={course.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{course.title}</h4>
                <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                  {getStatusIcon(course.status)}
                  <span>{course.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-3">
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {course.completedModules}/{course.totalModules} modules
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Time spent: {course.timeSpent}</span>
                <span>
                  Last accessed: {course.lastAccessed
                    ? new Date(course.lastAccessed).toLocaleDateString()
                    : 'Never'
                  }
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
        <div className="flex items-end space-x-4 h-32">
          {progressData.weeklyActivity.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${(day.hours / 4) * 100}%` }}
              ></div>
              <div className="text-xs text-gray-600 mt-2">{day.day}</div>
              <div className="text-xs text-gray-500">{day.hours}h</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {progressData.achievements.map((achievement) => (
            <div key={achievement.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  {getAchievementIcon(achievement.icon)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {progressData.achievements.length === 0 && (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No achievements yet. Keep learning to earn badges!</p>
          </div>
        )}
      </div>

      {/* Learner Info */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learner Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <p className="text-gray-900">{progressData.learner.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <p className="text-gray-900">{progressData.learner.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
            <p className="text-gray-900">{progressData.learner.grade}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <p className="text-gray-900">{progressData.learner.className}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;
