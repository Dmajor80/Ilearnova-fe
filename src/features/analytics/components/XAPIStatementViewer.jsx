import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Download, Eye, Calendar, User, Target, CheckCircle, XCircle, AlertTriangle, Play, Pause, SkipForward } from 'lucide-react';

const XAPIStatementViewer = ({ userId, courseId }) => {
  const [statements, setStatements] = useState([]);
  const [filteredStatements, setFilteredStatements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerb, setFilterVerb] = useState('all');
  const [filterObject, setFilterObject] = useState('all');
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock xAPI statements data
  useEffect(() => {
    const mockStatements = [
      {
        id: 'statement-1',
        timestamp: '2024-01-15T10:30:00Z',
        actor: {
          name: 'Alice Johnson',
          mbox: 'alice@example.com',
          objectType: 'Agent'
        },
        verb: {
          id: 'http://adlnet.gov/expapi/verbs/completed',
          display: { 'en-US': 'completed' }
        },
        object: {
          id: 'http://example.com/courses/math101/module1',
          definition: {
            name: { 'en-US': 'Introduction to Algebra' },
            description: { 'en-US': 'Basic algebra concepts and operations' },
            type: 'http://adlnet.gov/expapi/activities/module'
          },
          objectType: 'Activity'
        },
        result: {
          success: true,
          score: { scaled: 0.95, raw: 95, min: 0, max: 100 },
          completion: true,
          duration: 'PT2H30M'
        },
        context: {
          registration: 'course-enrollment-123',
          contextActivities: {
            parent: [{ id: 'http://example.com/courses/math101' }],
            grouping: [{ id: 'http://example.com/school/district1' }]
          }
        }
      },
      {
        id: 'statement-2',
        timestamp: '2024-01-15T11:15:00Z',
        actor: {
          name: 'Alice Johnson',
          mbox: 'alice@example.com',
          objectType: 'Agent'
        },
        verb: {
          id: 'http://adlnet.gov/expapi/verbs/attempted',
          display: { 'en-US': 'attempted' }
        },
        object: {
          id: 'http://example.com/courses/math101/quiz1',
          definition: {
            name: { 'en-US': 'Algebra Quiz 1' },
            description: { 'en-US': 'Assessment of basic algebra skills' },
            type: 'http://adlnet.gov/expapi/activities/assessment'
          },
          objectType: 'Activity'
        },
        result: {
          success: false,
          score: { scaled: 0.75, raw: 15, min: 0, max: 20 },
          completion: true,
          duration: 'PT45M'
        },
        context: {
          registration: 'course-enrollment-123'
        }
      },
      {
        id: 'statement-3',
        timestamp: '2024-01-15T14:20:00Z',
        actor: {
          name: 'Bob Smith',
          mbox: 'bob@example.com',
          objectType: 'Agent'
        },
        verb: {
          id: 'http://adlnet.gov/expapi/verbs/experienced',
          display: { 'en-US': 'experienced' }
        },
        object: {
          id: 'http://example.com/courses/eng201/video1',
          definition: {
            name: { 'en-US': 'Shakespeare Overview Video' },
            description: { 'en-US': 'Introduction to Shakespeare\'s works' },
            type: 'http://adlnet.gov/expapi/activities/media'
          },
          objectType: 'Activity'
        },
        result: {
          completion: true,
          duration: 'PT25M'
        },
        context: {
          registration: 'course-enrollment-456'
        }
      },
      {
        id: 'statement-4',
        timestamp: '2024-01-15T16:45:00Z',
        actor: {
          name: 'Alice Johnson',
          mbox: 'alice@example.com',
          objectType: 'Agent'
        },
        verb: {
          id: 'http://adlnet.gov/expapi/verbs/answered',
          display: { 'en-US': 'answered' }
        },
        object: {
          id: 'http://example.com/courses/math101/question5',
          definition: {
            name: { 'en-US': 'Quadratic Equations Question' },
            description: { 'en-US': 'Solve the quadratic equation' },
            type: 'http://adlnet.gov/expapi/activities/question'
          },
          objectType: 'Activity'
        },
        result: {
          success: true,
          response: 'x = -2, 3',
          duration: 'PT3M'
        },
        context: {
          registration: 'course-enrollment-123'
        }
      },
      {
        id: 'statement-5',
        timestamp: '2024-01-16T09:10:00Z',
        actor: {
          name: 'Alice Johnson',
          mbox: 'alice@example.com',
          objectType: 'Agent'
        },
        verb: {
          id: 'http://adlnet.gov/expapi/verbs/launched',
          display: { 'en-US': 'launched' }
        },
        object: {
          id: 'http://example.com/courses/math101',
          definition: {
            name: { 'en-US': 'Introduction to Mathematics' },
            description: { 'en-US': 'Complete mathematics course' },
            type: 'http://adlnet.gov/expapi/activities/course'
          },
          objectType: 'Activity'
        },
        context: {
          registration: 'course-enrollment-123'
        }
      }
    ];

    setTimeout(() => {
      setStatements(mockStatements);
      setFilteredStatements(mockStatements);
      setLoading(false);
    }, 1000);
  }, [userId, courseId]);

  useEffect(() => {
    const filtered = statements.filter(statement => {
      const matchesSearch = statement.actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           statement.object.definition?.name?.['en-US']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           statement.verb.display?.['en-US']?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVerb = filterVerb === 'all' || statement.verb.display?.['en-US'] === filterVerb;
      const matchesObject = filterObject === 'all' || statement.object.definition?.type?.includes(filterObject);
      return matchesSearch && matchesVerb && matchesObject;
    });
    setFilteredStatements(filtered);
  }, [statements, searchTerm, filterVerb, filterObject]);

  const getVerbIcon = (verbId) => {
    switch (verbId) {
      case 'http://adlnet.gov/expapi/verbs/completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'http://adlnet.gov/expapi/verbs/attempted':
        return <Target className="w-5 h-5 text-blue-500" />;
      case 'http://adlnet.gov/expapi/verbs/experienced':
        return <Eye className="w-5 h-5 text-purple-500" />;
      case 'http://adlnet.gov/expapi/verbs/answered':
        return <FileText className="w-5 h-5 text-orange-500" />;
      case 'http://adlnet.gov/expapi/verbs/launched':
        return <Play className="w-5 h-5 text-indigo-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getVerbColor = (verbId) => {
    switch (verbId) {
      case 'http://adlnet.gov/expapi/verbs/completed':
        return 'bg-green-100 text-green-800';
      case 'http://adlnet.gov/expapi/verbs/attempted':
        return 'bg-blue-100 text-blue-800';
      case 'http://adlnet.gov/expapi/verbs/experienced':
        return 'bg-purple-100 text-purple-800';
      case 'http://adlnet.gov/expapi/verbs/answered':
        return 'bg-orange-100 text-orange-800';
      case 'http://adlnet.gov/expapi/verbs/launched':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniqueVerbs = () => {
    return ['all', ...new Set(statements.map(s => s.verb.display?.['en-US']))];
  };

  const getUniqueObjectTypes = () => {
    return ['all', ...new Set(statements.map(s => s.object.definition?.type))];
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    // Simple ISO 8601 duration parser
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;

    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const exportStatements = () => {
    const csvContent = [
      ['Timestamp', 'Actor', 'Verb', 'Object', 'Success', 'Score', 'Duration'],
      ...filteredStatements.map(statement => [
        new Date(statement.timestamp).toLocaleString(),
        statement.actor.name,
        statement.verb.display?.['en-US'] || '',
        statement.object.definition?.name?.['en-US'] || '',
        statement.result?.success ? 'Yes' : 'No',
        statement.result?.score?.scaled ? `${(statement.result.score.scaled * 100).toFixed(1)}%` : '',
        formatDuration(statement.result?.duration)
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'xapi-statements.csv';
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
          <h1 className="text-3xl font-bold text-gray-900">xAPI Statements</h1>
          <p className="text-gray-600 mt-1">Track and analyze learning experiences and activities</p>
        </div>
        <button
          onClick={exportStatements}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Statements</p>
              <p className="text-2xl font-bold text-gray-900">{statements.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-gray-900">
                {statements.filter(s => s.result?.success).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Unique Actors</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(statements.map(s => s.actor.mbox)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Activities</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(statements.map(s => s.object.id)).size}
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
              placeholder="Search statements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Verb Filter */}
          <div className="relative">
            <select
              value={filterVerb}
              onChange={(e) => setFilterVerb(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {getUniqueVerbs().map(verb => (
                <option key={verb} value={verb}>
                  {verb === 'all' ? 'All Verbs' : verb}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Object Type Filter */}
          <div className="relative">
            <select
              value={filterObject}
              onChange={(e) => setFilterObject(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {getUniqueObjectTypes().map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.split('/').pop()}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Statements List */}
      <div className="space-y-4">
        {filteredStatements.map((statement) => (
          <div key={statement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getVerbIcon(statement.verb.id)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">{statement.actor.name}</span>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getVerbColor(statement.verb.id)}`}>
                        {statement.verb.display?.['en-US']}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{statement.object.definition?.name?.['en-US']}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {new Date(statement.timestamp).toLocaleString()}
                    </p>
                    {statement.result?.score?.scaled && (
                      <p className="text-sm font-semibold text-gray-900">
                        Score: {(statement.result.score.scaled * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedStatement(selectedStatement?.id === statement.id ? null : statement)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
                  >
                    {selectedStatement?.id === statement.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>
            </div>

            {/* Details */}
            {selectedStatement?.id === statement.id && (
              <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Actor Details */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Actor</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {statement.actor.name}</p>
                      <p><span className="font-medium">Email:</span> {statement.actor.mbox}</p>
                      <p><span className="font-medium">Type:</span> {statement.actor.objectType}</p>
                    </div>
                  </div>

                  {/* Object Details */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Activity</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {statement.object.definition?.name?.['en-US']}</p>
                      <p><span className="font-medium">Description:</span> {statement.object.definition?.description?.['en-US']}</p>
                      <p><span className="font-medium">Type:</span> {statement.object.definition?.type?.split('/').pop()}</p>
                      <p><span className="font-medium">ID:</span> <span className="text-xs text-gray-600 break-all">{statement.object.id}</span></p>
                    </div>
                  </div>

                  {/* Result Details */}
                  {statement.result && (
                    <div className="md:col-span-2">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Result</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Success</p>
                          <p className="font-semibold">{statement.result.success ? 'Yes' : 'No'}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Completion</p>
                          <p className="font-semibold">{statement.result.completion ? 'Yes' : 'No'}</p>
                        </div>
                        {statement.result.score && (
                          <>
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Scaled Score</p>
                              <p className="font-semibold">{(statement.result.score.scaled * 100).toFixed(1)}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Raw Score</p>
                              <p className="font-semibold">{statement.result.score.raw}/{statement.result.score.max}</p>
                            </div>
                          </>
                        )}
                        <div className="text-center md:col-span-4">
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="font-semibold">{formatDuration(statement.result.duration)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Context Details */}
                  {statement.context && (
                    <div className="md:col-span-2">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Context</h4>
                      <div className="space-y-2">
                        {statement.context.registration && (
                          <p><span className="font-medium">Registration:</span> {statement.context.registration}</p>
                        )}
                        {statement.context.contextActivities?.parent?.length > 0 && (
                          <p><span className="font-medium">Parent Activity:</span> {statement.context.contextActivities.parent[0].id}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredStatements.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No statements found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default XAPIStatementViewer;
