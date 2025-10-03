import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Edit, Trash2, BookOpen, Users, Clock, Play, CheckCircle, Lock, Eye } from 'lucide-react';

const ModuleList = ({ curriculumId }) => {
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockModules = [
      {
        id: 1,
        title: 'Introduction to Numbers',
        description: 'Basic concepts of counting and number recognition',
        type: 'video',
        status: 'published',
        duration: '15 min',
        totalStudents: 45,
        completedStudents: 32,
        order: 1,
        thumbnail: '/api/placeholder/300/200',
        curriculumId: curriculumId || 1,
        createdAt: '2024-01-15',
        tags: ['numbers', 'counting', 'basic']
      },
      {
        id: 2,
        title: 'Addition Fundamentals',
        description: 'Learn the basics of addition with visual aids',
        type: 'interactive',
        status: 'published',
        duration: '20 min',
        totalStudents: 45,
        completedStudents: 28,
        order: 2,
        thumbnail: '/api/placeholder/300/200',
        curriculumId: curriculumId || 1,
        createdAt: '2024-01-16',
        tags: ['addition', 'math', 'interactive']
      },
      {
        id: 3,
        title: 'Geometry Shapes Quiz',
        description: 'Test your knowledge of basic geometric shapes',
        type: 'quiz',
        status: 'draft',
        duration: '10 min',
        totalStudents: 0,
        completedStudents: 0,
        order: 3,
        thumbnail: '/api/placeholder/300/200',
        curriculumId: curriculumId || 1,
        createdAt: '2024-01-17',
        tags: ['geometry', 'shapes', 'quiz']
      },
      {
        id: 4,
        title: 'Subtraction Practice',
        description: 'Practice subtraction with fun exercises',
        type: 'exercise',
        status: 'published',
        duration: '25 min',
        totalStudents: 45,
        completedStudents: 15,
        order: 4,
        thumbnail: '/api/placeholder/300/200',
        curriculumId: curriculumId || 1,
        createdAt: '2024-01-18',
        tags: ['subtraction', 'practice', 'exercise']
      },
      {
        id: 5,
        title: 'Number Patterns',
        description: 'Understanding sequences and patterns in numbers',
        type: 'video',
        status: 'scheduled',
        duration: '18 min',
        totalStudents: 0,
        completedStudents: 0,
        order: 5,
        thumbnail: '/api/placeholder/300/200',
        curriculumId: curriculumId || 1,
        createdAt: '2024-01-19',
        tags: ['patterns', 'sequences', 'logic']
      }
    ];

    setTimeout(() => {
      setModules(mockModules);
      setFilteredModules(mockModules);
      setLoading(false);
    }, 1000);
  }, [curriculumId]);

  // Filter modules based on search and filters
  useEffect(() => {
    let filtered = modules.filter(module => {
      const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          module.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = filterStatus === 'all' || module.status === filterStatus;
      const matchesType = filterType === 'all' || module.type === filterType;

      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort by order
    filtered.sort((a, b) => a.order - b.order);

    setFilteredModules(filtered);
  }, [modules, searchTerm, filterStatus, filterType]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />;
      case 'interactive': return <BookOpen className="w-4 h-4" />;
      case 'quiz': return <CheckCircle className="w-4 h-4" />;
      case 'exercise': return <Edit className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'interactive': return 'bg-purple-100 text-purple-800';
      case 'quiz': return 'bg-blue-100 text-blue-800';
      case 'exercise': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniqueValues = (key) => {
    return ['all', ...new Set(modules.map(item => item[key]))];
  };

  const calculateCompletionRate = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
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
          <h1 className="text-3xl font-bold text-gray-900">Learning Modules</h1>
          <p className="text-gray-600 mt-1">Manage and organize learning content modules</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Create Module</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search modules..."
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
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {getUniqueValues('type').map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <div key={module.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Thumbnail */}
            <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(module.status)}`}>
                  {module.status.charAt(0).toUpperCase() + module.status.slice(1)}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(module.type)}`}>
                  {getTypeIcon(module.type)}
                  <span>{module.type.charAt(0).toUpperCase() + module.type.slice(1)}</span>
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                <div className="flex items-center space-x-4 text-white text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{module.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{module.totalStudents} students</span>
                  </div>
                </div>
              </div>
              {module.status === 'scheduled' && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{module.description}</p>

              {/* Progress Bar */}
              {module.status === 'published' && module.totalStudents > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Completion</span>
                    <span>{calculateCompletionRate(module.completedStudents, module.totalStudents)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateCompletionRate(module.completedStudents, module.totalStudents)}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>{module.completedStudents} completed</span>
                    <span>{module.totalStudents - module.completedStudents} remaining</span>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {module.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
                {module.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{module.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Order: {module.order}</span>
                <span>Created: {new Date(module.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  {module.status === 'published' ? 'View Module' : 'Edit Draft'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No modules found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Create Your First Module
          </button>
        </div>
      )}

      {/* Module Statistics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{modules.length}</div>
            <div className="text-sm text-gray-600">Total Modules</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {modules.filter(m => m.status === 'published').length}
            </div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {modules.filter(m => m.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-600">Drafts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {Math.round(modules.reduce((acc, m) => acc + (m.completedStudents / Math.max(m.totalStudents, 1)), 0) / modules.length * 100) || 0}%
            </div>
            <div className="text-sm text-gray-600">Avg. Completion</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleList;
