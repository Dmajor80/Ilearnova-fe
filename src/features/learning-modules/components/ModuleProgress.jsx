import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, TrendingUp, Users, Clock, CheckCircle, AlertCircle, BarChart3, Calendar } from 'lucide-react';

const ModuleProgress = ({ moduleId, curriculumId }) => {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockProgressData = [
      {
        id: 1,
        studentId: 101,
        studentName: 'Alice Johnson',
        studentEmail: 'alice.johnson@email.com',
        grade: 'Grade 1',
        className: 'Grade 1A',
        moduleId: moduleId || 1,
        moduleTitle: 'Introduction to Numbers',
        status: 'completed',
        progress: 100,
        timeSpent: '45 min',
        completedAt: '2024-01-20T10:30:00Z',
        score: 95,
        attempts: 1,
        lastActivity: '2024-01-20T10:30:00Z',
        engagement: 'high'
      },
      {
        id: 2,
        studentId: 102,
        studentName: 'Bob Smith',
        studentEmail: 'bob.smith@email.com',
        grade: 'Grade 1',
        className: 'Grade 1A',
        moduleId: moduleId || 1,
        moduleTitle: 'Introduction to Numbers',
        status: 'in_progress',
        progress: 75,
        timeSpent: '30 min',
        completedAt: null,
        score: null,
        attempts: 2,
        lastActivity: '2024-01-22T14:15:00Z',
        engagement: 'medium'
      },
      {
        id: 3,
        studentId: 103,
        studentName: 'Charlie Brown',
        studentEmail: 'charlie.brown@email.com',
        grade: 'Grade 1',
        className: 'Grade 1B',
        moduleId: moduleId || 1,
        moduleTitle: 'Introduction to Numbers',
        status: 'not_started',
        progress: 0,
        timeSpent: '0 min',
        completedAt: null,
        score: null,
        attempts: 0,
        lastActivity: null,
        engagement: 'low'
      },
      {
        id: 4,
        studentId: 104,
        studentName: 'Diana Wilson',
        studentEmail: 'diana.wilson@email.com',
        grade: 'Grade 1',
        className: 'Grade 1A',
        moduleId: moduleId || 1,
        moduleTitle: 'Introduction to Numbers',
        status: 'completed',
        progress: 100,
        timeSpent: '38 min',
        completedAt: '2024-01-19T09:45:00Z',
        score: 88,
        attempts: 1,
        lastActivity: '2024-01-19T09:45:00Z',
        engagement: 'high'
      },
      {
        id: 5,
        studentId: 105,
        studentName: 'Eva Davis',
        studentEmail: 'eva.davis@email.com',
        grade: 'Grade 1',
        className: 'Grade 1B',
        moduleId: moduleId || 1,
        moduleTitle: 'Introduction to Numbers',
        status: 'in_progress',
        progress: 45,
        timeSpent: '20 min',
        completedAt: null,
        score: null,
        attempts: 1,
        lastActivity: '2024-01-21T11:20:00Z',
        engagement: 'medium'
      }
    ];

    setTimeout(() => {
      setProgressData(mockProgressData);
      setFilteredData(mockProgressData);
      setLoading(false);
    }, 1000);
  }, [moduleId, curriculumId]);

  // Filter data based on search and filters
  useEffect(() => {
    let filtered = progressData.filter(item => {
      const matchesSearch = item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.className.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      const matchesGrade = filterGrade === 'all' || item.grade === filterGrade;

      return matchesSearch && matchesStatus && matchesGrade;
    });

    setFilteredData(filtered);
  }, [progressData, searchTerm, filterStatus, filterGrade]);

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

  const getEngagementColor = (engagement) => {
    switch (engagement) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniqueValues = (key) => {
    return ['all', ...new Set(progressData.map(item => item[key]))];
  };

  const calculateAverageProgress = () => {
    if (filteredData.length === 0) return 0;
    return Math.round(filteredData.reduce((acc, item) => acc + item.progress, 0) / filteredData.length);
  };

  const calculateCompletionRate = () => {
    if (filteredData.length === 0) return 0;
    const completed = filteredData.filter(item => item.status === 'completed').length;
    return Math.round((completed / filteredData.length) * 100);
  };

  const exportData = () => {
    // Mock export functionality
    const csvContent = [
      ['Student Name', 'Email', 'Grade', 'Class', 'Status', 'Progress', 'Time Spent', 'Score', 'Attempts', 'Last Activity'],
      ...filteredData.map(item => [
        item.studentName,
        item.studentEmail,
        item.grade,
        item.className,
        item.status,
        `${item.progress}%`,
        item.timeSpent,
        item.score || 'N/A',
        item.attempts,
        item.lastActivity ? new Date(item.lastActivity).toLocaleDateString() : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'module-progress-report.csv';
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
          <h1 className="text-3xl font-bold text-gray-900">Module Progress</h1>
          <p className="text-gray-600 mt-1">Track student progress and engagement across learning modules</p>
        </div>
        <button
          onClick={exportData}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{calculateCompletionRate()}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Progress</p>
              <p className="text-2xl font-bold text-gray-900">{calculateAverageProgress()}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Learners</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredData.filter(item => item.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {getUniqueValues('status').map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Grade Filter */}
          <div className="relative">
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {getUniqueValues('grade').map(grade => (
                <option key={grade} value={grade}>
                  {grade === 'all' ? 'All Grades' : grade}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Progress Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedStudent(item)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {item.studentName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.studentName}</div>
                        <div className="text-sm text-gray-500">{item.studentEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.className}</div>
                    <div className="text-sm text-gray-500">{item.grade}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span>{item.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.timeSpent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.score ? `${item.score}%` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEngagementColor(item.engagement)}`}>
                      {item.engagement.charAt(0).toUpperCase() + item.engagement.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.lastActivity ? new Date(item.lastActivity).toLocaleDateString() : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Student Progress Details</h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <AlertCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xl font-medium text-gray-700">
                    {selectedStudent.studentName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedStudent.studentName}</h3>
                  <p className="text-gray-600">{selectedStudent.studentEmail}</p>
                  <p className="text-sm text-gray-500">{selectedStudent.className} • {selectedStudent.grade}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Module Progress</label>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{selectedStudent.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${selectedStudent.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedStudent.status)}`}>
                    {getStatusIcon(selectedStudent.status)}
                    <span>{selectedStudent.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Spent</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedStudent.timeSpent}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attempts</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedStudent.attempts}</p>
                </div>

                {selectedStudent.score && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Score</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedStudent.score}%</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Engagement</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getEngagementColor(selectedStudent.engagement)}`}>
                    {selectedStudent.engagement.charAt(0).toUpperCase() + selectedStudent.engagement.slice(1)}
                  </span>
                </div>
              </div>

              {selectedStudent.completedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Completed On</label>
                  <p className="text-gray-900 flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedStudent.completedAt).toLocaleDateString()} at {new Date(selectedStudent.completedAt).toLocaleTimeString()}</span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Activity</label>
                <p className="text-gray-900">
                  {selectedStudent.lastActivity
                    ? `${new Date(selectedStudent.lastActivity).toLocaleDateString()} at ${new Date(selectedStudent.lastActivity).toLocaleTimeString()}`
                    : 'No activity recorded'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleProgress;
