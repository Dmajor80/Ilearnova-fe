import React, { useState, useEffect } from 'react';
import {
  Clock, Wifi, WifiOff, Database, Upload, Download,
  AlertTriangle, CheckCircle, XCircle, RefreshCw,
  Trash2, Play, Pause, Settings, Activity
} from 'lucide-react';

const OfflineQueue = ({ organizationId }) => {
  const [queueItems, setQueueItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [queueStats, setQueueStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockQueueItems = [
      {
        id: 1,
        type: 'upload',
        entityType: 'assignment_submission',
        entityId: 123,
        data: { fileName: 'math_homework.pdf', size: 2048000 },
        status: 'pending',
        priority: 'high',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        retryCount: 0,
        maxRetries: 3,
        error: null,
        estimatedSize: 2048000
      },
      {
        id: 2,
        type: 'sync',
        entityType: 'student_progress',
        entityId: 456,
        data: { moduleId: 789, progress: 85, completedAt: new Date().toISOString() },
        status: 'processing',
        priority: 'medium',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
        retryCount: 1,
        maxRetries: 3,
        error: null,
        estimatedSize: 1024
      },
      {
        id: 3,
        type: 'download',
        entityType: 'learning_material',
        entityId: 101,
        data: { materialId: 202, fileName: 'physics_notes.pdf' },
        status: 'completed',
        priority: 'low',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        retryCount: 0,
        maxRetries: 3,
        error: null,
        estimatedSize: 1572864
      },
      {
        id: 4,
        type: 'upload',
        entityType: 'exam_submission',
        entityId: 303,
        data: { examId: 404, answers: { q1: 'A', q2: 'B', q3: 'C' } },
        status: 'failed',
        priority: 'high',
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
        retryCount: 3,
        maxRetries: 3,
        error: 'Network timeout - connection lost',
        estimatedSize: 5120
      },
      {
        id: 5,
        type: 'sync',
        entityType: 'attendance',
        entityId: 505,
        data: { classId: 606, studentId: 707, timestamp: new Date().toISOString() },
        status: 'pending',
        priority: 'medium',
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        retryCount: 0,
        maxRetries: 3,
        error: null,
        estimatedSize: 256
      }
    ];

    setTimeout(() => {
      setQueueItems(mockQueueItems);
      updateQueueStats(mockQueueItems);
    }, 1000);

    // Simulate online/offline status changes
    const interval = setInterval(() => {
      setIsOnline(prev => !prev);
    }, 30000); // Toggle every 30 seconds for demo

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = queueItems.filter(item => {
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      const matchesType = filterType === 'all' || item.type === filterType;
      return matchesStatus && matchesType;
    });
    setFilteredItems(filtered);
  }, [queueItems, filterStatus, filterType]);

  const updateQueueStats = (items) => {
    const stats = items.reduce((acc, item) => {
      acc.total++;
      acc[item.status]++;
      return acc;
    }, { total: 0, pending: 0, processing: 0, completed: 0, failed: 0 });

    setQueueStats(stats);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'upload':
        return <Upload className="w-4 h-4 text-blue-500" />;
      case 'download':
        return <Download className="w-4 h-4 text-green-500" />;
      case 'sync':
        return <RefreshCw className="w-4 h-4 text-purple-500" />;
      default:
        return <Database className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleRetry = (itemId) => {
    setQueueItems(prev => prev.map(item =>
      item.id === itemId && item.retryCount < item.maxRetries
        ? { ...item, status: 'pending', retryCount: item.retryCount + 1, error: null }
        : item
    ));
  };

  const handleDelete = (itemId) => {
    setQueueItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleProcessQueue = async () => {
    if (!isOnline || processing) return;

    setProcessing(true);

    // Process pending items
    const pendingItems = queueItems.filter(item => item.status === 'pending');

    for (const item of pendingItems) {
      // Update status to processing
      setQueueItems(prev => prev.map(i =>
        i.id === item.id ? { ...i, status: 'processing' } : i
      ));

      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Randomly succeed or fail for demo
      const success = Math.random() > 0.3;

      setQueueItems(prev => prev.map(i =>
        i.id === item.id
          ? {
              ...i,
              status: success ? 'completed' : 'failed',
              error: success ? null : 'Simulated network error'
            }
          : i
      ));
    }

    setProcessing(false);
  };

  const clearCompleted = () => {
    setQueueItems(prev => prev.filter(item => item.status !== 'completed'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Offline Queue</h1>
          <p className="text-gray-600 mt-1">Manage offline data synchronization</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <button
            onClick={handleProcessQueue}
            disabled={!isOnline || processing || queueStats.pending === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
          >
            {processing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{processing ? 'Processing...' : 'Process Queue'}</span>
          </button>
        </div>
      </div>

      {/* Connection Status Alert */}
      {!isOnline && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
            <div>
              <p className="text-sm text-yellow-800">
                You are currently offline. Changes will be queued and synced when connection is restored.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Database className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{queueStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{queueStats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900">{queueStats.processing}</p>
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
              <p className="text-2xl font-bold text-gray-900">{queueStats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">{queueStats.failed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">▼</div>
            </div>

            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="upload">Upload</option>
                <option value="download">Download</option>
                <option value="sync">Sync</option>
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">▼</div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={clearCompleted}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Completed
            </button>
          </div>
        </div>
      </div>

      {/* Queue Items */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTypeIcon(item.type)}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {item.entityType.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {item.entityId}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize text-sm text-gray-900">{item.type}</span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(item.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      {item.retryCount > 0 && (
                        <span className="text-xs text-gray-500">
                          ({item.retryCount}/{item.maxRetries})
                        </span>
                      )}
                    </div>
                    {item.error && (
                      <p className="text-xs text-red-600 mt-1">{item.error}</p>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(item.estimatedSize)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTimeAgo(item.createdAt)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {item.status === 'failed' && item.retryCount < item.maxRetries && (
                        <button
                          onClick={() => handleRetry(item.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Retry"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Queue is empty</h3>
            <p className="text-gray-600">
              {filterStatus === 'all' && filterType === 'all'
                ? 'No items in the offline queue'
                : 'No items match your current filters'
              }
            </p>
          </div>
        )}
      </div>

      {/* Queue Summary */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Queue Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Data Pending Sync</h4>
            <p className="text-2xl font-bold text-blue-600">
              {formatFileSize(filteredItems
                .filter(item => item.status === 'pending')
                .reduce((total, item) => total + item.estimatedSize, 0)
              )}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Estimated Sync Time</h4>
            <p className="text-2xl font-bold text-green-600">
              {Math.ceil(filteredItems.filter(item => item.status === 'pending').length * 2)}s
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Failed Items</h4>
            <p className="text-2xl font-bold text-red-600">
              {filteredItems.filter(item => item.status === 'failed').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineQueue;
