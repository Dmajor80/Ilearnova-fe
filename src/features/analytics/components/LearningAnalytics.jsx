import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Users, BookOpen, Clock, Target, Award, Calendar, Download, Filter } from 'lucide-react';

const gradeColors = {
  A: { text: 'text-green-600', bg: 'bg-green-500' },
  B: { text: 'text-blue-600', bg: 'bg-blue-500' },
  C: { text: 'text-yellow-600', bg: 'bg-yellow-500' },
  D: { text: 'text-orange-600', bg: 'bg-orange-500' },
  F: { text: 'text-red-600', bg: 'bg-red-500' }
};

const LearningAnalytics = ({ userId, timeframe = 'month' }) => {
  const [analytics, setAnalytics] = useState({});
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockAnalytics = {
      overview: {
        totalStudents: 1250,
        activeStudents: 892,
        totalCourses: 45,
        totalEnrollments: 3240,
        completionRate: 78.5,
        averageScore: 82.3,
        totalStudyHours: 15420,
        averageSessionTime: 45
      },
      trends: {
        studentGrowth: [
          { month: 'Jan', students: 1100, active: 780 },
          { month: 'Feb', students: 1150, active: 820 },
          { month: 'Mar', students: 1200, active: 850 },
          { month: 'Apr', students: 1220, active: 860 },
          { month: 'May', students: 1250, active: 892 }
        ],
        completionRates: [
          { month: 'Jan', rate: 72.3 },
          { month: 'Feb', rate: 74.1 },
          { month: 'Mar', rate: 76.8 },
          { month: 'Apr', rate: 77.9 },
          { month: 'May', rate: 78.5 }
        ],
        averageScores: [
          { month: 'Jan', score: 79.2 },
          { month: 'Feb', score: 80.1 },
          { month: 'Mar', score: 81.5 },
          { month: 'Apr', score: 82.1 },
          { month: 'May', score: 82.3 }
        ]
      },
      coursePerformance: [
        {
          courseId: 'MATH101',
          courseName: 'Introduction to Mathematics',
          enrollments: 245,
          completions: 198,
          completionRate: 80.8,
          averageScore: 85.2,
          averageTime: 42,
          dropouts: 15
        },
        {
          courseId: 'ENG201',
          courseName: 'English Literature',
          enrollments: 189,
          completions: 142,
          completionRate: 75.1,
          averageScore: 78.9,
          averageTime: 38,
          dropouts: 22
        },
        {
          courseId: 'SCI301',
          courseName: 'Physics Fundamentals',
          enrollments: 156,
          completions: 98,
          completionRate: 62.8,
          averageScore: 74.5,
          averageTime: 55,
          dropouts: 28
        },
        {
          courseId: 'HIST101',
          courseName: 'World History',
          enrollments: 203,
          completions: 167,
          completionRate: 82.3,
          averageScore: 88.1,
          averageTime: 35,
          dropouts: 12
        }
      ],
      studentEngagement: {
        dailyActive: 892,
        weeklyActive: 1156,
        monthlyActive: 1250,
        averageSessionsPerWeek: 4.2,
        averageTimePerSession: 45,
        topEngagedCourses: [
          { course: 'Introduction to Mathematics', engagement: 92.3 },
          { course: 'World History', engagement: 89.1 },
          { course: 'English Literature', engagement: 85.7 },
          { course: 'Physics Fundamentals', engagement: 78.4 }
        ]
      },
      performanceMetrics: {
        highPerformers: 245, // Students with >90% average
        averagePerformers: 678, // Students with 70-90% average
        needsImprovement: 327, // Students with <70% average
        gradeDistribution: {
          A: 312,
          B: 456,
          C: 289,
          D: 145,
          F: 48
        }
      }
    };

    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  }, [userId, selectedTimeframe]);

  const timeframes = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const metrics = [
    { value: 'overview', label: 'Overview' },
    { value: 'courses', label: 'Course Performance' },
    { value: 'engagement', label: 'Student Engagement' },
    { value: 'performance', label: 'Performance Metrics' }
  ];

  const exportAnalytics = () => {
    // Mock export functionality
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Students', analytics.overview?.totalStudents || 0],
      ['Active Students', analytics.overview?.activeStudents || 0],
      ['Total Courses', analytics.overview?.totalCourses || 0],
      ['Completion Rate', `${analytics.overview?.completionRate || 0}%`],
      ['Average Score', `${analytics.overview?.averageScore || 0}%`]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'learning-analytics.csv';
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Learning Analytics</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Comprehensive insights into learning performance and engagement</p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            {timeframes.map(timeframe => (
              <option key={timeframe.value} value={timeframe.value}>
                {timeframe.label}
              </option>
            ))}
          </select>
          <button
            onClick={exportAnalytics}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors text-sm sm:text-base"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap gap-2">
          {metrics.map(metric => (
            <button
              key={metric.value}
              onClick={() => setSelectedMetric(metric.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedMetric === metric.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Metrics */}
      {selectedMetric === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview?.totalStudents?.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +5.2%
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview?.completionRate}%</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +2.1%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview?.averageScore}%</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +1.8%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Study Hours</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview?.totalStudyHours?.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +8.3%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trends Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Growth */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Growth Trend</h3>
              <div className="space-y-4">
                {analytics.trends?.studentGrowth?.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{data.month}</span>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold">{data.students}</p>
                        <p className="text-xs text-gray-500">{data.active} active</p>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(data.students / 1300) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Trends */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
              <div className="space-y-4">
                {analytics.trends?.completionRates?.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{data.month}</span>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold">{data.rate}%</p>
                        <p className="text-xs text-gray-500">completion</p>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${data.rate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Course Performance */}
      {selectedMetric === 'courses' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Course Performance</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Time (hrs)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropouts</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.coursePerformance?.map((course) => (
                  <tr key={course.courseId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{course.courseName}</div>
                        <div className="text-sm text-gray-500">{course.courseId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {course.enrollments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-semibold text-gray-900 mr-2">{course.completionRate}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${course.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {course.averageScore}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.averageTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-red-600 font-semibold">{course.dropouts}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Engagement */}
      {selectedMetric === 'engagement' && (
        <div className="space-y-6">
          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Daily Active</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.studentEngagement?.dailyActive}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Weekly Active</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.studentEngagement?.weeklyActive}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Session Time</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.studentEngagement?.averageTimePerSession}m</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sessions/Week</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.studentEngagement?.averageSessionsPerWeek}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Engaged Courses */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Engaged Courses</h3>
            <div className="space-y-4">
              {analytics.studentEngagement?.topEngagedCourses?.map((course, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{course.course}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-semibold text-gray-900">{course.engagement}%</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${course.engagement}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {selectedMetric === 'performance' && (
        <div className="space-y-6">
          {/* Performance Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analytics.performanceMetrics?.highPerformers}
                </div>
                <div className="text-sm text-gray-600">High Performers</div>
                <div className="text-xs text-gray-500">({'>'}90% average)</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {analytics.performanceMetrics?.averagePerformers}
                </div>
                <div className="text-sm text-gray-600">Average Performers</div>
                <div className="text-xs text-gray-500">(70-90% average)</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {analytics.performanceMetrics?.needsImprovement}
                </div>
                <div className="text-sm text-gray-600">Needs Improvement</div>
                  <div className="text-xs text-gray-500">({ '<'}70% average)</div>
              </div>
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {Object.entries(analytics.performanceMetrics?.gradeDistribution || {}).map(([grade, count]) => {
                const colors = gradeColors[grade] || gradeColors.F;

                return (
                  <div key={grade} className="text-center">
                    <div className={`text-xl sm:text-2xl font-bold mb-2 ${colors.text}`}>
                      {count}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Grade {grade}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${colors.bg}`}
                        style={{ width: `${(count / 1250) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningAnalytics;
