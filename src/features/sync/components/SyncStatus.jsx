import React, { useState, useEffect } from 'react';
import {
  Wifi, WifiOff, RefreshCw, CheckCircle, AlertTriangle,
  Clock, Database, Cloud, Smartphone, Monitor,
  Activity, Zap, Server
} from 'lucide-react';

const SyncStatus = ({ organizationId }) => {
  const [syncStatus, setSyncStatus] = useState({
    isOnline: true,
    lastSync: new Date().toISOString(),
    nextSync: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
    syncInProgress: false,
    pendingChanges: 0,
    connectionQuality: 'excellent', // excellent, good, poor, offline
    serverStatus: 'online'
  });

  const [syncHistory, setSyncHistory] = useState([]);
  const [devices, setDevices] = useState([]);
  const [syncStats, setSyncStats] = useState({
    totalSyncs: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
    dataTransferred: 0,
    averageSyncTime: 0
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockDevices = [
      {
        id: 1,
        name: 'Admin Laptop',
        type: 'desktop',
        lastSeen: new Date().toISOString(),
        status: 'online',
        pendingSync: false,
        localChanges: 0
      },
      {
        id: 2,
        name: 'Teacher Tablet',
        type: 'tablet',
        lastSeen: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
        status: 'online',
        pendingSync: true,
        localChanges: 5
      },
      {
        id: 3,
        name: 'Student Phone',
        type: 'mobile',
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        status: 'offline',
        pendingSync: true,
        localChanges: 12
      }
    ];

    const mockHistory = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        type: 'full_sync',
        status: 'success',
        duration: 45000, // 45 seconds
        dataTransferred: 2048000, // 2MB
        changesSynced: 23
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        type: 'incremental_sync',
        status: 'success',
        duration: 12000, // 12 seconds
        dataTransferred: 512000, // 512KB
        changesSynced: 8
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        type: 'full_sync',
        status: 'failed',
        duration: 30000, // 30 seconds
        error: 'Network timeout'
      }
    ];

    setDevices(mockDevices);
    setSyncHistory(mockHistory);
    setSyncStats({
      totalSyncs: 156,
      successfulSyncs: 152,
      failedSyncs: 4,
      dataTransferred: 1073741824, // 1GB
      averageSyncTime: 28000 // 28 seconds
    });
  }, []);

  const getConnectionIcon = (quality) => {
    switch (quality) {
      case 'excellent':
        return <Wifi className="w-5 h-5 text-green-500" />;
      case 'good':
        return <Wifi className="w-5 h-5 text-yellow-500" />;
      case 'poor':
        return <Wifi className="w-5 h-5 text-orange-500" />;
      case 'offline':
        return <WifiOff className="w-5 h-5 text-red-500" />;
      default:
        return <WifiOff className="w-5 h-5 text-gray-500" />;
    }
  };

  const getConnectionLabel = (quality) => {
    switch (quality) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'poor':
        return 'Poor';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'desktop':
        return <Monitor className="w-5 h-5 text-blue-500" />;
      case 'tablet':
        return <Tablet className="w-5 h-5 text-green-500" />;
      case 'mobile':
        return <Smartphone className="w-5 h-5 text-purple-500" />;
      default:
        return <Monitor className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'offline':
        return 'text-red-600 bg-red-100';
      case 'syncing':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDuration = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const formatDataSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleManualSync = async () => {
    setSyncStatus(prev => ({ ...prev, syncInProgress: true }));

    // Mock sync process
    await new Promise(resolve => setTimeout(resolve, 3000));

    setSyncStatus(prev => ({
      ...prev,
      syncInProgress: false,
      lastSync: new Date().toISOString(),
      nextSync: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      pendingChanges: 0
    }));

    // Add to history
    const newSync = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: 'manual_sync',
      status: 'success',
      duration: 3000,
      dataTransferred: 1024000,
      changesSynced: 15
    };

    setSyncHistory(prev => [newSync, ...prev]);
  };

  const SyncStatusCard = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Sync Status</h3>
        <div className="flex items-center space-x-2">
          {getConnectionIcon(syncStatus.connectionQuality)}
          <span className="text-sm text-gray-600">
            {getConnectionLabel(syncStatus.connectionQuality)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <div className="flex items-center space-x-2">
            {syncStatus.isOnline ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(syncStatus.isOnline ? 'online' : 'offline')}`}>
              {syncStatus.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Last Sync</span>
          <span className="text-sm text-gray-900">
            {new Date(syncStatus.lastSync).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Next Sync</span>
          <span className="text-sm text-gray-900">
            {new Date(syncStatus.nextSync).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Pending Changes</span>
          <span className="text-sm font-semibold text-orange-600">
            {syncStatus.pendingChanges}
          </span>
        </div>

        <div className="pt-4">
          <button
            onClick={handleManualSync}
            disabled={syncStatus.syncInProgress || !syncStatus.isOnline}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
          >
            {syncStatus.syncInProgress ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>{syncStatus.syncInProgress ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  const DeviceListCard = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Devices</h3>
      <div className="space-y-3">
        {devices.map((device) => (
          <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {getDeviceIcon(device.type)}
              <div>
                <p className="text-sm font-medium text-gray-900">{device.name}</p>
                <p className="text-xs text-gray-500">
                  Last seen: {new Date(device.lastSeen).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {device.pendingSync && (
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                  {device.localChanges} changes
                </span>
              )}
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(device.status)}`}>
                {device.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SyncHistoryCard = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync History</h3>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {syncHistory.map((sync) => (
          <div key={sync.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {sync.status === 'success' ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {sync.type.replace('_', ' ')}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(sync.timestamp).toLocaleString()}
                </p>
                {sync.error && (
                  <p className="text-xs text-red-600">{sync.error}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-900">
                {formatDuration(sync.duration)}
              </p>
              <p className="text-xs text-gray-500">
                {formatDataSize(sync.dataTransferred || 0)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SyncStatsCard = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{syncStats.totalSyncs}</p>
          <p className="text-sm text-gray-600">Total Syncs</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{syncStats.successfulSyncs}</p>
          <p className="text-sm text-gray-600">Successful</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{syncStats.failedSyncs}</p>
          <p className="text-sm text-gray-600">Failed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {formatDuration(syncStats.averageSyncTime)}
          </p>
          <p className="text-sm text-gray-600">Avg. Time</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Data Transferred</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatDataSize(syncStats.dataTransferred)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sync Status</h1>
          <p className="text-gray-600 mt-1">Monitor data synchronization across devices</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            syncStatus.isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {syncStatus.isOnline ? <Cloud className="w-4 h-4" /> : <Server className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {syncStatus.isOnline ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SyncStatusCard />
        <SyncStatsCard />
      </div>

      {/* Device and History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeviceListCard />
        <SyncHistoryCard />
      </div>

      {/* Network Diagnostics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Diagnostics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Latency</p>
            <p className="text-lg font-bold text-blue-600">45ms</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Zap className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Bandwidth</p>
            <p className="text-lg font-bold text-green-600">25 Mbps</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Database className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Queue Size</p>
            <p className="text-lg font-bold text-purple-600">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Missing Tablet icon
const Tablet = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

export default SyncStatus;
