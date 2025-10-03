import React, { useState, useEffect } from 'react';
import { Check, X, Users, BookOpen, Calendar, Search, Filter, Plus, Link, Unlink } from 'lucide-react';

const CurriculumAssignment = () => {
  const [curricula, setCurricula] = useState([]);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockCurricula = [
      {
        id: 1,
        title: 'Mathematics Grade 1',
        subject: 'Mathematics',
        grade: 'Grade 1',
        status: 'active',
        assignedClasses: [1, 3]
      },
      {
        id: 2,
        title: 'English Literature Grade 2',
        subject: 'English',
        grade: 'Grade 2',
        status: 'active',
        assignedClasses: [2, 4]
      },
      {
        id: 3,
        title: 'Science Fundamentals Grade 1',
        subject: 'Science',
        grade: 'Grade 1',
        status: 'draft',
        assignedClasses: []
      }
    ];

    const mockClasses = [
      {
        id: 1,
        name: 'Grade 1A',
        grade: 'Grade 1',
        teacher: 'Ms. Johnson',
        studentCount: 25,
        subject: 'Mathematics'
      },
      {
        id: 2,
        name: 'Grade 2B',
        grade: 'Grade 2',
        teacher: 'Mr. Smith',
        studentCount: 22,
        subject: 'English'
      },
      {
        id: 3,
        name: 'Grade 1B',
        grade: 'Grade 1',
        teacher: 'Mrs. Davis',
        studentCount: 28,
        subject: 'Mathematics'
      },
      {
        id: 4,
        name: 'Grade 2A',
        grade: 'Grade 2',
        teacher: 'Ms. Wilson',
        studentCount: 24,
        subject: 'English'
      },
      {
        id: 5,
        name: 'Grade 1C',
        grade: 'Grade 1',
        teacher: 'Mr. Brown',
        studentCount: 26,
        subject: 'Science'
      }
    ];

    const mockAssignments = [
      { curriculumId: 1, classId: 1, assignedDate: '2024-01-15', status: 'active' },
      { curriculumId: 1, classId: 3, assignedDate: '2024-01-15', status: 'active' },
      { curriculumId: 2, classId: 2, assignedDate: '2024-01-10', status: 'active' },
      { curriculumId: 2, classId: 4, assignedDate: '2024-01-10', status: 'active' }
    ];

    setTimeout(() => {
      setCurricula(mockCurricula);
      setClasses(mockClasses);
      setAssignments(mockAssignments);
      setLoading(false);
    }, 1000);
  }, []);

  const isAssigned = (curriculumId, classId) => {
    return assignments.some(assignment =>
      assignment.curriculumId === curriculumId &&
      assignment.classId === classId &&
      assignment.status === 'active'
    );
  };

  const toggleAssignment = (curriculumId, classId) => {
    const isCurrentlyAssigned = isAssigned(curriculumId, classId);

    if (isCurrentlyAssigned) {
      // Remove assignment
      setAssignments(prev => prev.filter(assignment =>
        !(assignment.curriculumId === curriculumId && assignment.classId === classId)
      ));
    } else {
      // Add assignment
      const newAssignment = {
        curriculumId,
        classId,
        assignedDate: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      setAssignments(prev => [...prev, newAssignment]);
    }
  };

  const getAvailableClasses = (curriculum) => {
    return classes.filter(classItem =>
      classItem.grade === curriculum.grade &&
      classItem.subject === curriculum.subject
    );
  };

  const getAssignedClasses = (curriculumId) => {
    return assignments
      .filter(assignment => assignment.curriculumId === curriculumId && assignment.status === 'active')
      .map(assignment => classes.find(classItem => classItem.id === assignment.classId))
      .filter(Boolean);
  };

  const filteredCurricula = curricula.filter(curriculum => {
    const matchesSearch = curriculum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         curriculum.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || curriculum.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  const getUniqueGrades = () => {
    return ['all', ...new Set(curricula.map(c => c.grade))];
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
          <h1 className="text-3xl font-bold text-gray-900">Curriculum Assignment</h1>
          <p className="text-gray-600 mt-1">Assign curricula to classes and manage curriculum-class relationships</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
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

          <div className="relative">
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {getUniqueGrades().map(grade => (
                <option key={grade} value={grade}>
                  {grade === 'all' ? 'All Grades' : grade}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Curriculum Assignment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCurricula.map((curriculum) => {
          const availableClasses = getAvailableClasses(curriculum);
          const assignedClasses = getAssignedClasses(curriculum.id);

          return (
            <div key={curriculum.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Curriculum Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{curriculum.title}</h3>
                    <p className="text-gray-600 mt-1">{curriculum.subject} • {curriculum.grade}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600">{assignedClasses.length} classes assigned</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        curriculum.status === 'active' ? 'bg-green-100 text-green-800' :
                        curriculum.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {curriculum.status.charAt(0).toUpperCase() + curriculum.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCurriculum(selectedCurriculum?.id === curriculum.id ? null : curriculum)}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {selectedCurriculum?.id === curriculum.id ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Assigned Classes Summary */}
              {assignedClasses.length > 0 && (
                <div className="px-6 py-4 bg-green-50 border-b border-gray-200">
                  <h4 className="font-semibold text-green-800 mb-2">Assigned Classes</h4>
                  <div className="flex flex-wrap gap-2">
                    {assignedClasses.map((classItem) => (
                      <div key={classItem.id} className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        <Users className="w-3 h-3" />
                        <span>{classItem.name}</span>
                        <span className="text-green-600">({classItem.studentCount} students)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Class Assignment Interface */}
              {selectedCurriculum?.id === curriculum.id && (
                <div className="p-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Available Classes</h4>

                  {availableClasses.length === 0 ? (
                    <p className="text-gray-600 text-sm">No classes available for this curriculum's grade and subject.</p>
                  ) : (
                    <div className="space-y-3">
                      {availableClasses.map((classItem) => {
                        const isAssignedToClass = isAssigned(curriculum.id, classItem.id);

                        return (
                          <div key={classItem.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{classItem.name}</h5>
                                <p className="text-sm text-gray-600">
                                  {classItem.teacher} • {classItem.studentCount} students
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => toggleAssignment(curriculum.id, classItem.id)}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                isAssignedToClass
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {isAssignedToClass ? (
                                <>
                                  <Unlink className="w-4 h-4" />
                                  <span>Unassign</span>
                                </>
                              ) : (
                                <>
                                  <Link className="w-4 h-4" />
                                  <span>Assign</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bulk Assignment Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Assignment Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <Plus className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">Assign to All Classes</span>
          </button>

          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">Unassign from All Classes</span>
          </button>

          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">Schedule Assignments</span>
          </button>
        </div>
      </div>

      {/* Assignment Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{curricula.length}</div>
            <div className="text-sm text-gray-600">Total Curricula</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{classes.length}</div>
            <div className="text-sm text-gray-600">Total Classes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{assignments.length}</div>
            <div className="text-sm text-gray-600">Active Assignments</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {Math.round((assignments.length / (curricula.length * classes.length)) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Assignment Coverage</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumAssignment;
