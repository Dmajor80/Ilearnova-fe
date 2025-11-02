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

  // Enhanced mock data with realistic transcripts
  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        setLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1200));

        const mockTranscripts = [
          {
            id: 'TR-2024-001',
            courseId: 'MATH101',
            courseName: 'Advanced Algebra & Calculus',
            studentId: 'STU-2024-0456',
            studentName: 'Emma Rodriguez',
            enrollmentDate: '2024-01-15T08:00:00Z',
            completionDate: '2024-05-20T16:30:00Z',
            status: 'completed',
            grade: 'A',
            score: 94.5,
            totalModules: 12,
            completedModules: 12,
            totalHours: 156.5,
            certificateUrl: '/certificates/math101-emma-rodriguez.pdf',
            modules: [
              {
                id: 'M1',
                title: 'Linear Equations and Inequalities',
                status: 'completed',
                score: 96,
                completionDate: '2024-01-28T10:15:00Z',
                attempts: 1
              },
              {
                id: 'M2',
                title: 'Quadratic Functions',
                status: 'completed',
                score: 92,
                completionDate: '2024-02-10T14:20:00Z',
                attempts: 2
              },
              {
                id: 'M3',
                title: 'Polynomial Operations',
                status: 'completed',
                score: 95,
                completionDate: '2024-02-25T09:45:00Z',
                attempts: 1
              },
              {
                id: 'M4',
                title: 'Rational Expressions',
                status: 'completed',
                score: 91,
                completionDate: '2024-03-12T11:30:00Z',
                attempts: 1
              },
              {
                id: 'M5',
                title: 'Exponential and Logarithmic Functions',
                status: 'completed',
                score: 97,
                completionDate: '2024-03-28T15:10:00Z',
                attempts: 1
              },
              {
                id: 'M6',
                title: 'Trigonometric Functions',
                status: 'completed',
                score: 93,
                completionDate: '2024-04-15T13:25:00Z',
                attempts: 2
              },
              {
                id: 'M7',
                title: 'Analytic Geometry',
                status: 'completed',
                score: 96,
                completionDate: '2024-04-30T10:50:00Z',
                attempts: 1
              },
              {
                id: 'M8',
                title: 'Limits and Continuity',
                status: 'completed',
                score: 89,
                completionDate: '2024-05-08T12:15:00Z',
                attempts: 3
              },
              {
                id: 'M9',
                title: 'Derivatives and Differentiation',
                status: 'completed',
                score: 95,
                completionDate: '2024-05-15T14:40:00Z',
                attempts: 2
              },
              {
                id: 'M10',
                title: 'Applications of Derivatives',
                status: 'completed',
                score: 94,
                completionDate: '2024-05-18T11:20:00Z',
                attempts: 1
              },
              {
                id: 'M11',
                title: 'Integration Techniques',
                status: 'completed',
                score: 92,
                completionDate: '2024-05-19T16:05:00Z',
                attempts: 2
              },
              {
                id: 'M12',
                title: 'Final Project: Mathematical Modeling',
                status: 'completed',
                score: 98,
                completionDate: '2024-05-20T16:30:00Z',
                attempts: 1
              }
            ],
            transcriptText: `Emma Rodriguez successfully completed the Advanced Algebra & Calculus course with outstanding performance. Throughout the 12-week program, Emma demonstrated exceptional understanding of complex mathematical concepts, consistently achieving scores above 90% in all modules. Her final project on mathematical modeling received a perfect score and showcased advanced problem-solving skills. Emma's dedication to mastering calculus fundamentals and her ability to apply mathematical principles to real-world scenarios were particularly noteworthy.`,
            language: 'English',
            keyPoints: [
              'Mastered advanced calculus concepts including derivatives and integration',
              'Excelled in mathematical modeling and real-world applications',
              'Demonstrated strong analytical thinking and problem-solving skills',
              'Completed all coursework with minimal attempts, showing deep understanding',
              'Achieved perfect score on final project presentation'
            ]
          },
          {
            id: 'TR-2024-002',
            courseId: 'ENG201',
            courseName: 'English Literature: Modern Classics',
            studentId: 'STU-2024-0321',
            studentName: 'Marcus Johnson',
            enrollmentDate: '2024-02-01T09:00:00Z',
            completionDate: '2024-05-25T17:45:00Z',
            status: 'completed',
            grade: 'B+',
            score: 87.2,
            totalModules: 10,
            completedModules: 10,
            totalHours: 124.0,
            certificateUrl: '/certificates/eng201-marcus-johnson.pdf',
            modules: [
              {
                id: 'M1',
                title: 'Introduction to Modern Literature',
                status: 'completed',
                score: 89,
                completionDate: '2024-02-15T12:30:00Z',
                attempts: 1
              },
              {
                id: 'M2',
                title: 'The Great Gatsby Analysis',
                status: 'completed',
                score: 85,
                completionDate: '2024-02-28T14:15:00Z',
                attempts: 2
              },
              {
                id: 'M3',
                title: 'To Kill a Mockingbird Themes',
                status: 'completed',
                score: 91,
                completionDate: '2024-03-15T10:45:00Z',
                attempts: 1
              },
              {
                id: 'M4',
                title: '1984: Dystopian Literature',
                status: 'completed',
                score: 82,
                completionDate: '2024-03-30T16:20:00Z',
                attempts: 3
              },
              {
                id: 'M5',
                title: 'Literary Criticism Methods',
                status: 'completed',
                score: 88,
                completionDate: '2024-04-12T11:10:00Z',
                attempts: 1
              },
              {
                id: 'M6',
                title: 'Poetry Analysis: Contemporary Poets',
                status: 'completed',
                score: 86,
                completionDate: '2024-04-25T13:35:00Z',
                attempts: 2
              },
              {
                id: 'M7',
                title: 'The Catcher in the Rye',
                status: 'completed',
                score: 90,
                completionDate: '2024-05-05T15:50:00Z',
                attempts: 1
              },
              {
                id: 'M8',
                title: 'Comparative Literature Studies',
                status: 'completed',
                score: 84,
                completionDate: '2024-05-12T09:25:00Z',
                attempts: 2
              },
              {
                id: 'M9',
                title: 'Writing Literary Essays',
                status: 'completed',
                score: 89,
                completionDate: '2024-05-20T14:40:00Z',
                attempts: 1
              },
              {
                id: 'M10',
                title: 'Final Research Project',
                status: 'completed',
                score: 87,
                completionDate: '2024-05-25T17:45:00Z',
                attempts: 2
              }
            ],
            transcriptText: `Marcus Johnson completed the English Literature: Modern Classics course with a strong performance, earning a B+ grade. Throughout the course, Marcus showed particular strength in thematic analysis and essay writing, though he faced some challenges with dystopian literature concepts. His final research project on comparative themes in modern American literature was well-researched and demonstrated good analytical skills. Marcus actively participated in class discussions and showed improvement in his writing throughout the semester.`,
            language: 'English',
            keyPoints: [
              'Strong performance in thematic analysis and essay writing',
              'Completed comprehensive analysis of 7 major literary works',
              'Developed research skills through final project',
              'Active participation in literary discussions',
              'Improved writing skills and critical thinking abilities'
            ]
          },
          {
            id: 'TR-2024-003',
            courseId: 'SCI301',
            courseName: 'Physics: Mechanics and Thermodynamics',
            studentId: 'STU-2024-0789',
            studentName: 'Sophia Chen',
            enrollmentDate: '2024-01-20T10:00:00Z',
            status: 'in_progress',
            grade: null,
            score: 76.8,
            totalModules: 14,
            completedModules: 8,
            totalHours: 89.5,
            modules: [
              {
                id: 'M1',
                title: 'Newtonian Mechanics Fundamentals',
                status: 'completed',
                score: 82,
                completionDate: '2024-02-05T11:20:00Z',
                attempts: 1
              },
              {
                id: 'M2',
                title: 'Kinematics and Motion',
                status: 'completed',
                score: 79,
                completionDate: '2024-02-18T13:45:00Z',
                attempts: 2
              },
              {
                id: 'M3',
                title: 'Forces and Newton\'s Laws',
                status: 'completed',
                score: 85,
                completionDate: '2024-03-03T15:30:00Z',
                attempts: 1
              },
              {
                id: 'M4',
                title: 'Work, Energy, and Power',
                status: 'completed',
                score: 74,
                completionDate: '2024-03-20T10:15:00Z',
                attempts: 3
              },
              {
                id: 'M5',
                title: 'Momentum and Collisions',
                status: 'completed',
                score: 78,
                completionDate: '2024-04-02T14:25:00Z',
                attempts: 2
              },
              {
                id: 'M6',
                title: 'Rotational Mechanics',
                status: 'completed',
                score: 71,
                completionDate: '2024-04-18T12:40:00Z',
                attempts: 4
              },
              {
                id: 'M7',
                title: 'Simple Harmonic Motion',
                status: 'completed',
                score: 80,
                completionDate: '2024-05-01T16:55:00Z',
                attempts: 2
              },
              {
                id: 'M8',
                title: 'Thermodynamics Introduction',
                status: 'completed',
                score: 75,
                completionDate: '2024-05-15T11:10:00Z',
                attempts: 3
              },
              {
                id: 'M9',
                title: 'Heat Transfer Mechanisms',
                status: 'in_progress',
                score: null,
                completionDate: null,
                attempts: 0
              },
              {
                id: 'M10',
                title: 'Laws of Thermodynamics',
                status: 'pending',
                score: null,
                completionDate: null,
                attempts: 0
              }
            ],
            transcriptText: `Sophia Chen is currently enrolled in the Physics: Mechanics and Thermodynamics course. She has completed 8 out of 14 modules with a current average score of 76.8%. Sophia shows strength in fundamental concepts and practical applications but has faced challenges with rotational mechanics and some thermodynamics principles. She has been working diligently to improve her understanding and has sought additional help through office hours. With continued effort, Sophia is expected to successfully complete the course.`,
            language: 'English',
            keyPoints: [
              'Strong foundation in Newtonian mechanics and kinematics',
              'Good understanding of forces and energy concepts',
              'Facing challenges with rotational mechanics',
              'Working on thermodynamics fundamentals',
              'Seeking additional academic support when needed'
            ]
          },
          {
            id: 'TR-2024-004',
            courseId: 'HIST101',
            courseName: 'World History: 20th Century',
            studentId: 'STU-2024-0567',
            studentName: 'Alexander Kim',
            enrollmentDate: '2024-03-01T08:30:00Z',
            completionDate: '2024-06-10T18:20:00Z',
            status: 'completed',
            grade: 'A-',
            score: 91.3,
            totalModules: 11,
            completedModules: 11,
            totalHours: 142.0,
            certificateUrl: '/certificates/hist101-alexander-kim.pdf',
            modules: [
              {
                id: 'M1',
                title: 'World War I: Causes and Consequences',
                status: 'completed',
                score: 94,
                completionDate: '2024-03-15T12:45:00Z',
                attempts: 1
              },
              {
                id: 'M2',
                title: 'The Interwar Period',
                status: 'completed',
                score: 89,
                completionDate: '2024-03-28T14:20:00Z',
                attempts: 2
              },
              {
                id: 'M3',
                title: 'World War II: Global Impact',
                status: 'completed',
                score: 95,
                completionDate: '2024-04-12T10:35:00Z',
                attempts: 1
              },
              {
                id: 'M4',
                title: 'The Cold War Era',
                status: 'completed',
                score: 92,
                completionDate: '2024-04-28T16:50:00Z',
                attempts: 1
              },
              {
                id: 'M5',
                title: 'Decolonization Movements',
                status: 'completed',
                score: 88,
                completionDate: '2024-05-10T11:25:00Z',
                attempts: 2
              },
              {
                id: 'M6',
                title: 'Civil Rights and Social Movements',
                status: 'completed',
                score: 93,
                completionDate: '2024-05-22T13:40:00Z',
                attempts: 1
              },
              {
                id: 'M7',
                title: 'The Space Race and Technology',
                status: 'completed',
                score: 90,
                completionDate: '2024-05-28T15:15:00Z',
                attempts: 1
              },
              {
                id: 'M8',
                title: 'Economic Globalization',
                status: 'completed',
                score: 91,
                completionDate: '2024-06-02T09:30:00Z',
                attempts: 1
              },
              {
                id: 'M9',
                title: 'Contemporary Global Issues',
                status: 'completed',
                score: 89,
                completionDate: '2024-06-05T14:55:00Z',
                attempts: 2
              },
              {
                id: 'M10',
                title: 'Research Methodology',
                status: 'completed',
                score: 92,
                completionDate: '2024-06-08T11:40:00Z',
                attempts: 1
              },
              {
                id: 'M11',
                title: 'Final Research Thesis',
                status: 'completed',
                score: 94,
                completionDate: '2024-06-10T18:20:00Z',
                attempts: 1
              }
            ],
            transcriptText: `Alexander Kim excelled in the World History: 20th Century course, achieving an A- grade with a final score of 91.3%. His research thesis on "The Impact of Decolonization on Modern Global Politics" was particularly outstanding, earning a perfect score. Alexander demonstrated exceptional analytical skills and a deep understanding of complex historical events and their interconnections. His participation in class discussions was consistently thoughtful and well-informed, contributing significantly to the learning environment.`,
            language: 'English',
            keyPoints: [
              'Exceptional research and analytical skills demonstrated in final thesis',
              'Deep understanding of 20th-century global events and their impacts',
              'Strong performance in connecting historical events to contemporary issues',
              'Active and insightful participation in class discussions',
              'Consistent high performance across all modules and assessments'
            ]
          },
          {
            id: 'TR-2024-005',
            courseId: 'CS201',
            courseName: 'Introduction to Computer Science',
            studentId: 'STU-2024-0890',
            studentName: 'Isabella Martinez',
            enrollmentDate: '2024-02-10T09:15:00Z',
            status: 'in_progress',
            grade: null,
            score: 82.5,
            totalModules: 13,
            completedModules: 9,
            totalHours: 98.5,
            modules: [
              {
                id: 'M1',
                title: 'Programming Fundamentals',
                status: 'completed',
                score: 88,
                completionDate: '2024-02-25T13:30:00Z',
                attempts: 1
              },
              {
                id: 'M2',
                title: 'Variables and Data Types',
                status: 'completed',
                score: 85,
                completionDate: '2024-03-08T15:45:00Z',
                attempts: 2
              },
              {
                id: 'M3',
                title: 'Control Structures',
                status: 'completed',
                score: 90,
                completionDate: '2024-03-22T11:20:00Z',
                attempts: 1
              },
              {
                id: 'M4',
                title: 'Functions and Methods',
                status: 'completed',
                score: 87,
                completionDate: '2024-04-05T14:10:00Z',
                attempts: 1
              },
              {
                id: 'M5',
                title: 'Arrays and Lists',
                status: 'completed',
                score: 79,
                completionDate: '2024-04-20T10:35:00Z',
                attempts: 3
              },
              {
                id: 'M6',
                title: 'Object-Oriented Programming',
                status: 'completed',
                score: 84,
                completionDate: '2024-05-03T16:50:00Z',
                attempts: 2
              },
              {
                id: 'M7',
                title: 'File I/O Operations',
                status: 'completed',
                score: 81,
                completionDate: '2024-05-18T12:25:00Z',
                attempts: 2
              },
              {
                id: 'M8',
                title: 'Error Handling',
                status: 'completed',
                score: 83,
                completionDate: '2024-05-28T14:40:00Z',
                attempts: 1
              },
              {
                id: 'M9',
                title: 'Database Fundamentals',
                status: 'completed',
                score: 80,
                completionDate: '2024-06-08T11:15:00Z',
                attempts: 2
              },
              {
                id: 'M10',
                title: 'Web Development Basics',
                status: 'in_progress',
                score: null,
                completionDate: null,
                attempts: 0
              }
            ],
            transcriptText: `Isabella Martinez is making excellent progress in the Introduction to Computer Science course with a current average of 82.5%. She has successfully completed 9 out of 13 modules, showing particular strength in programming fundamentals and object-oriented concepts. Isabella has demonstrated good problem-solving skills and has been actively participating in coding exercises. She is currently working on web development basics and is expected to complete the course successfully with her current trajectory.`,
            language: 'English',
            keyPoints: [
              'Strong foundation in programming fundamentals and logic',
              'Good understanding of object-oriented programming concepts',
              'Developing skills in data structures and algorithms',
              'Active participation in coding exercises and projects',
              'Working on integrating multiple programming concepts'
            ]
          }
        ];

        setTranscripts(mockTranscripts);
        setFilteredTranscripts(mockTranscripts);
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
