import React, { useState, useEffect } from 'react';
import {
  Smartphone, Monitor, Tablet, Laptop, Wifi, WifiOff,
  Battery, BatteryLow, BatteryMedium, BatteryFull,
  Settings, Trash2, RefreshCw, Shield, ShieldOff,
  Clock, MapPin, HardDrive, Cpu, MemoryStick
} from 'lucide-react';

const DeviceList = ({ organizationId }) => {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockDevices = [
      {
        id: 1,
        name: 'Admin Workstation',
        type: 'desktop',
        model: 'Dell OptiPlex 7090',
        os: 'Windows 11 Pro',
        osVersion: '21H2',
        ipAddress: '192.168.1.100',
        macAddress: '00:1B:44:11:3A:B7',
        status: 'online',
        lastSeen: new Date().toISOString(),
        batteryLevel: null, // Desktop doesn't have battery
        storageUsed: 85, // 85% used
        memoryUsed: 60, // 60% used
        cpuUsage: 25, // 25% used
        location: 'Main Office - Room 101',
        securityStatus: 'secured',
        enrolledDate: '2024-01-15T08:00:00Z',
        lastSync: new Date().toISOString(),
        pendingUpdates: 0,
        installedApps: 45
      },
      {
        id: 2,
        name: 'Teacher Laptop',
        type: 'laptop',
        model: 'MacBook Pro 16"',
        os: 'macOS',
        osVersion: '13.2.1',
        ipAddress: '192.168.1.105',
        macAddress: 'AC:BC:32:15:7F:2A',
        status: 'online',
        lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        batteryLevel: 78,
        storageUsed: 65,
        memoryUsed: 45,
        cpuUsage: 15,
        location: 'Classroom B',
        securityStatus: 'secured',
        enrolledDate: '2024-02-01T10:30:00Z',
        lastSync: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        pendingUpdates: 2,
        installedApps: 38
      },
      {
        id: 3,
        name: 'Student Tablet',
        type: 'tablet',
        model: 'iPad Pro 12.9"',
        os: 'iPadOS',
        osVersion: '16.3',
        ipAddress: '192.168.1.110',
        macAddress: '8C:85:90:AA:BB:CC',
        status: 'online',
        lastSeen: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
        batteryLevel: 92,
        storageUsed: 40,
        memoryUsed: 30,
        cpuUsage: 8,
        location: 'Library',
        securityStatus: 'secured',
        enrolledDate: '2024-01-20T14:15:00Z',
        lastSync: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        pendingUpdates: 1,
        installedApps: 25
      },
      {
        id: 4,
        name: 'Student Phone',
        type: 'mobile',
        model: 'Samsung Galaxy S23',
        os: 'Android',
        osVersion: '13',
        ipAddress: '192.168.1.115',
        macAddress: '02:00:00:00:00:01',
        status: 'offline',
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        batteryLevel: 15,
        storageUsed: 75,
        memoryUsed: 55,
        cpuUsage: null, // Not available when offline
        location: 'Home',
        securityStatus: 'warning',
        enrolledDate: '2024-01-25T09:45:00Z',
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        pendingUpdates: 5,
        installedApps: 42
      },
      {
        id: 5,
        name: 'Lab Computer 01',
        type: 'desktop',
        model: 'HP EliteDesk 800',
        os: 'Windows 10 Pro',
        osVersion: '22H2',
        ipAddress: '192.168.1.120',
        macAddress: '00:50:56:C0:00:01',
        status: 'maintenance',
        lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        batteryLevel: null,
        storageUsed: 90,
        memoryUsed: 70,
        cpuUsage: null,
        location: 'Computer Lab',
        securityStatus: 'critical',
        enrolledDate: '2023-12-01T11:00:00Z',
        lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        pendingUpdates: 12,
        installedApps: 50
      }
    ];

    setTimeout(() => {
      setDevices(mockDevices);
      setFilteredDevices(mockDevices);
      setLoading(false);
    }, 1000);
  }, [organizationId]);

  useEffect(() => {
    const filtered = devices.filter(device => {
      const matchesStatus = filterStatus === 'all' || device.status === filterStatus;
      const matchesType = filterType === 'all' || device.type === filterType;
      return matchesStatus && matchesType;
    });
    setFilteredDevices(filtered);
  }, [devices, filterStatus, filterType]);

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'desktop':
        return <Monitor className="w-6 h-6 text-blue-500" />;
      case 'laptop':
        return <Laptop className="w-6 h-6 text-green-500" />;
      case 'tablet':
        return <Tablet className="w-6 h-6 text-purple-500" />;
      case 'mobile':
        return <Smartphone className="w-6 h-6 text-orange-500" />;
      default:
        return <Monitor className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBatteryIcon = (level) => {
    if (level === null) return null;
    if (level >= 80) return <BatteryFull className="w-4 h-4 text-green-500" />;
    if (level >= 50) return <BatteryMedium className="w-4 h-4 text-yellow-500" />;
    if (level >= 20) return <BatteryLow className="w-4 h-4 text-orange-500" />;
    return <Battery className="w-4 h-4 text-red-500" />;
  };

  const getSecurityIcon = (status) => {
    switch (status) {
      case 'secured':
        return <Shield className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <Shield className="w-4 h-4 text-yellow-500" />;
      case 'critical':
        return <ShieldOff className="w-4 h-4 text-red-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatLastSeen = (lastSeen) => {
    const now = new Date();
    const seen = new Date(lastSeen);
    const diffMs = now - seen;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const handleRemoteAction = (deviceId, action) => {
    // Mock remote actions
    console.log(`Performing ${action} on device ${deviceId}`);
  };

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
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
          <h1 className="text-3xl font-bold text-gray-900">Device Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all connected devices</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh All</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Monitor className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Devices</p>
              <p className="text-2xl font-bold text-gray-900">{devices.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Wifi className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Online</p>
              <p className="text-2xl font-bold text-gray-900">
                {devices.filter(d => d.status === 'online').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <WifiOff className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Offline</p>
              <p className="text-2xl font-bold text-gray-900">
                {devices.filter(d => d.status === 'offline').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Shield className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Security Issues</p>
              <p className="text-2xl font-bold text-gray-900">
                {devices.filter(d => d.securityStatus !== 'secured').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
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
              <option value="desktop">Desktop</option>
              <option value="laptop">Laptop</option>
              <option value="tablet">Tablet</option>
              <option value="mobile">Mobile</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">▼</div>
          </div>
        </div>
      </div>

      {/* Device List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Battery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDevices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleDeviceSelect(device)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getDeviceIcon(device.type)}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{device.name}</div>
                        <div className="text-sm text-gray-500">{device.model}</div>
                        <div className="text-xs text-gray-400">{device.os} {device.osVersion}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getSecurityIcon(device.securityStatus)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(device.status)}`}>
                        {device.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {device.batteryLevel !== null ? (
                      <div className="flex items-center space-x-2">
                        {getBatteryIcon(device.batteryLevel)}
                        <span className="text-sm text-gray-900">{device.batteryLevel}%</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <HardDrive className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{device.storageUsed}% storage</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MemoryStick className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{device.memoryUsed}% memory</span>
                      </div>
                      {device.cpuUsage && (
                        <div className="flex items-center space-x-2">
                          <Cpu className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{device.cpuUsage}% CPU</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{device.location}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatLastSeen(device.lastSeen)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoteAction(device.id, 'restart');
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Remote Restart"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoteAction(device.id, 'lock');
                        }}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Remote Lock"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoteAction(device.id, 'settings');
                        }}
                        className="text-gray-600 hover:text-gray-900"
                        title="Device Settings"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDevices.length === 0 && (
          <div className="text-center py-12">
            <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No devices found</h3>
            <p className="text-gray-600">Try adjusting your filter criteria</p>
          </div>
        )}
      </div>

      {/* Device Detail Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                {getDeviceIcon(selectedDevice.type)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedDevice.name}</h3>
                  <p className="text-sm text-gray-600">{selectedDevice.model}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDevice(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Operating System</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDevice.os} {selectedDevice.osVersion}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">IP Address</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{selectedDevice.ipAddress}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">MAC Address</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{selectedDevice.macAddress}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDevice.location}</p>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Performance</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Storage</span>
                      <span className="text-sm font-medium">{selectedDevice.storageUsed}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${selectedDevice.storageUsed}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Memory</span>
                      <span className="text-sm font-medium">{selectedDevice.memoryUsed}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${selectedDevice.memoryUsed}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">CPU</span>
                      <span className="text-sm font-medium">
                        {selectedDevice.cpuUsage ? `${selectedDevice.cpuUsage}%` : 'N/A'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${selectedDevice.cpuUsage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Enrolled Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedDevice.enrolledDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Sync</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedDevice.lastSync).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Installed Apps</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDevice.installedApps}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pending Updates</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDevice.pendingUpdates}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceList;
