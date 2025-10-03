import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Edit, Trash2, BookOpen, Users, Calendar, MoreHorizontal, Eye } from 'lucide-react';
import { getCurriculums, getCurriculumStatistics } from '@/api';

const CurriculumList = () => {
  const [curricula, setCurricula] = useState([]);
  const [filteredCurricula, setFilteredCurricula] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [loading, setLoading] = useState(true);

  // Load curricula from API
  useEffect(() => {
    const loadCurricula = async () => {
      try {
        setLoading(true);
        const response = await getCurriculums();
        if (response.ok) {
          setCurricula(response.data || []);
          setFilteredCurricula(response.data || []);
        } else {
          console.error('Failed to load curricula:', response.error);
          // Fallback to empty array
          setCurricula([]);
          setFilteredCurricula([]);
        }
      } catch (error) {
        console.error('Error loading curricula:', error);
        setCurricula([]);
        setFilteredCurricula([]);
      } finally {
        setLoading(false);
      }
    };

    loadCurricula();
  }, []);

  // Filter curricula based on search and filters
  useEffect(() => {
    let filtered = curricula.filter(curriculum => {
      const matchesSearch = curriculum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          curriculum.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          curriculum.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGrade = filterGrade === 'all' || curriculum.grade === filterGrade;
      const matchesSubject = filterSubject === 'all' || curriculum.subject === filterSubject;

      return matchesSearch && matchesGrade && matchesSubject;
    });

    setFilteredCurricula(filtered);
  }, [curricula, searchTerm, filterGrade, filterSubject]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniqueValues = (key) => {
    return ['all', ...new Set(curricula.map(item => item[key]))];
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
          <h1 className="text-3xl font-bold text-gray-900">Curriculum Management</h1>
          <p className="text-gray-600 mt-1">Manage and organize educational curricula across all grades and subjects</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Create Curriculum</span>
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
              placeholder="Search curricula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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

          {/* Subject Filter */}
          <div className="relative">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {getUniqueValues('subject').map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Curriculum Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCurricula.map((curriculum) => (
          <div key={curriculum.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Thumbnail */}
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">{curriculum.title}</h3>
                <p className="text-sm opacity-90">{curriculum.subject} • {curriculum.grade}</p>
              </div>
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(curriculum.status)}`}>
                  {curriculum.status.charAt(0).toUpperCase() + curriculum.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{curriculum.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">{curriculum.totalModules} Modules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">{curriculum.totalStudents} Students</span>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Updated {curriculum.lastUpdated}</span>
                <span>By {curriculum.createdBy}</span>
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
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCurricula.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No curricula found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Create Your First Curriculum
          </button>
        </div>
      )}
    </div>
  );
};

export default CurriculumList;
