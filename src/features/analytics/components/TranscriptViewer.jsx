import React, { useState, useEffect } from 'react';
import { FileText, Download, Search, Filter, Calendar, User, BookOpen, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getTranscripts } from '@/api/learningApi';
import useNotification from '@/hooks/useNotification';

const TranscriptViewer = ({ userId, courseId }) => {
  const [transcripts, setTranscripts] = useState([]);
  const [filteredTranscripts, setFilteredTranscripts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedTranscript, setSelectedTranscript] = useState(null);

  // Fetch transcripts from API
  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (userId) params.student_id = userId;
        if (courseId) params.module_id = courseId;

        const response = await getTranscripts(params);

        // Transform API data to component format
        const transformedTranscripts = response.data.map(transcript => ({
          id: transcript.id,
          courseId: `MODULE${transcript.session?.module?.id || 'N/A'}`,
          courseName: transcript.session?.module?.title || 'Unknown Module',
          studentId: transcript.session?.student?.id || 'N/A',
          studentName: `${transcript.session?.student?.user?.first_name || ''} ${transcript.session?.student?.user?.last_name || ''}`.trim() || 'Unknown Student',
          enrollmentDate: transcript.created_at,
          completionDate: transcript.session?.status === 'completed' ? transcript.updated_at : null,
          status: transcript.session?.status === 'completed' ? 'completed' : 'in_progress',
          grade: null, // Backend doesn't provide grade directly
          score: transcript.confidence_score || 0,
          totalModules: 1, // Each transcript is for one session/module
          completedModules: transcript.session?.status === 'completed' ? 1 : 0,
          totalHours: transcript.duration ? transcript.duration / 60 : 0, // Convert minutes to hours
          certificateUrl: null, // Backend doesn't provide certificates
          modules: [{
            id: transcript.session?.module?.id || transcript.id,
            title: transcript.session?.module?.title || 'Transcript Session',
            status: transcript.session?.status === 'completed' ? 'completed' : 'in_progress',
            score: transcript.confidence_score || null,
            completionDate: transcript.session?.status === 'completed' ? transcript.updated_at : null,
            attempts: 1
          }],
          transcriptText: transcript.transcript_text,
          language: transcript.language,
          keyPoints: transcript.key_points || []
        }));

        setTranscripts(transformedTranscripts);
        setFilteredTranscripts(transformedTranscripts);
      } catch (error) {
        console.error('Error fetching transcripts:', error);
        useNotification.showError('Failed to load transcripts');
        setTranscripts([]);
        setFilteredTranscripts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTranscripts();
  }, [userId, courseId]);

  useEffect(() => {
    const filtered = transcripts.filter(transcript => {
      const matchesSearch = transcript.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transcript.courseId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || transcript.status === filterStatus;
      const matchesCourse = filterCourse === 'all' || transcript.courseId === filterCourse;
      return matchesSearch && matchesStatus && matchesCourse;
    });
    setFilteredTranscripts(filtered);
  }, [transcripts, searchTerm, filterStatus, filterCourse]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'text-gray-500';
    switch (grade) {
      case 'A': return 'text-green-600 font-bold';
      case 'B': return 'text-blue-600 font-bold';
      case 'C': return 'text-yellow-600 font-bold';
      case 'D': return 'text-orange-600 font-bold';
      case 'F': return 'text-red-600 font-bold';
      default: return 'text-gray-600';
    }
  };

  const getUniqueCourses = () => {
    return ['all', ...new Set(transcripts.map(t => t.courseId))];
  };

  const exportTranscript = (transcript) => {
    const transcriptData = {
      id: transcript.id,
      student: transcript.studentName,
      course: transcript.courseName,
      status: transcript.status,
      score: transcript.score,
      enrollmentDate: transcript.enrollmentDate,
      completionDate: transcript.completionDate,
      transcriptText: transcript.transcriptText,
      language: transcript.language,
      keyPoints: transcript.keyPoints,
      duration: transcript.totalHours,
      confidenceScore: transcript.score
    };

    const blob = new Blob([JSON.stringify(transcriptData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${transcript.courseId}-transcript.json`;
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
          <h1 className="text-3xl font-bold text-gray-900">Learning Transcripts</h1>
          <p className="text-gray-600 mt-1">View detailed course completion records and progress</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{transcripts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {transcripts.filter(t => t.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {transcripts.filter(t => t.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <User className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(transcripts.reduce((sum, t) => sum + (t.score || 0), 0) / transcripts.length)}%
              </p>
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
              placeholder="Search courses..."
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
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="failed">Failed</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Course Filter */}
          <div className="relative">
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {getUniqueCourses().map(courseId => (
                <option key={courseId} value={courseId}>
                  {courseId === 'all' ? 'All Courses' : courseId}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Transcripts List */}
      <div className="space-y-4">
        {filteredTranscripts.map((transcript) => (
          <div key={transcript.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(transcript.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{transcript.courseName}</h3>
                    <p className="text-sm text-gray-600">Course ID: {transcript.courseId}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(transcript.status)}`}>
                    {transcript.status.replace('_', ' ').toUpperCase()}
                  </span>

                  {transcript.grade && (
                    <span className={`text-lg font-bold ${getGradeColor(transcript.grade)}`}>
                      Grade: {transcript.grade}
                    </span>
                  )}

                  <button
                    onClick={() => exportTranscript(transcript)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Enrollment Date</p>
                  <p className="font-semibold">{new Date(transcript.enrollmentDate).toLocaleDateString()}</p>
                </div>

                {transcript.completionDate && (
                  <div>
                    <p className="text-sm text-gray-600">Completion Date</p>
                    <p className="font-semibold">{new Date(transcript.completionDate).toLocaleDateString()}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600">Score</p>
                  <p className="font-semibold">{transcript.score}%</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Study Time</p>
                  <p className="font-semibold">{transcript.totalHours} hours</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{transcript.completedModules} / {transcript.totalModules} modules</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(transcript.completedModules / transcript.totalModules) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Modules */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Module Details</h4>
                <div className="space-y-3">
                  {transcript.modules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(module.status)}
                        <div>
                          <p className="font-medium text-gray-900">{module.title}</p>
                          <p className="text-sm text-gray-600">
                            {module.status === 'completed' && module.completionDate
                              ? `Completed ${new Date(module.completionDate).toLocaleDateString()}`
                              : module.status === 'in_progress'
                              ? 'In Progress'
                              : 'Not Started'
                            }
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        {module.score !== null && (
                          <p className="font-semibold text-gray-900">{module.score}%</p>
                        )}
                        <p className="text-sm text-gray-600">{module.attempts} attempt{module.attempts !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transcript Content */}
              {transcript.transcriptText && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Transcript Content</h4>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{transcript.transcriptText}</p>
                  </div>

                  {transcript.language && (
                    <p className="text-sm text-gray-600 mb-4">
                      <strong>Language:</strong> {transcript.language}
                    </p>
                  )}

                  {transcript.keyPoints && transcript.keyPoints.length > 0 && (
                    <div>
                      <h5 className="text-md font-semibold text-gray-900 mb-2">Key Points</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {transcript.keyPoints.map((point, index) => (
                          <li key={index} className="text-gray-700">{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Certificate */}
              {transcript.certificateUrl && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-gray-900">Certificate Available</span>
                    </div>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                      Download Certificate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTranscripts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No transcripts found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default TranscriptViewer;
