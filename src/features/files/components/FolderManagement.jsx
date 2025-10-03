import React, { useState, useEffect } from 'react';
import {
  Folder, FolderPlus, Edit, Trash2, Share, Lock, Unlock,
  Users, User, Settings, Search, Filter, MoreVertical,
  ChevronRight, Home, Move, Copy
} from 'lucide-react';

const FolderManagement = ({ organizationId }) => {
  const [folders, setFolders] = useState([]);
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockFolders = [
      {
        id: 1,
        name: 'Class Materials',
        description: 'Shared learning materials for all classes',
        path: '/Class Materials',
        parentId: null,
        permissions: {
          type: 'public',
          allowedUsers: [],
          allowedRoles: ['teacher', 'student']
        },
        createdBy: 'Admin User',
        createdAt: '2024-01-15T10:00:00Z',
        modifiedAt: '2024-01-28T14:30:00Z',
        fileCount: 45,
        totalSize: 524288000, // 500MB
        subfolders: 8
      },
      {
        id: 2,
        name: 'Assignments',
        description: 'Student assignments and submissions',
        path: '/Assignments',
        parentId: null,
        permissions: {
          type: 'role_based',
          allowedUsers: [],
          allowedRoles: ['teacher', 'student']
        },
        createdBy: 'Admin User',
        createdAt: '2024-01-10T08:00:00Z',
        modifiedAt: '2024-01-27T16:45:00Z',
        fileCount: 156,
        totalSize: 1073741824, // 1GB
        subfolders: 12
      },
      {
        id: 3,
        name: 'Private Documents',
        description: 'Confidential documents for administrators only',
        path: '/Private Documents',
        parentId: null,
        permissions: {
          type: 'private',
          allowedUsers: [1, 2, 3], // Admin user IDs
          allowedRoles: ['admin']
        },
        createdBy: 'Super Admin',
        createdAt: '2024-01-05T12:00:00Z',
        modifiedAt: '2024-01-26T11:20:00Z',
        fileCount: 23,
        totalSize: 104857600, // 100MB
        subfolders: 3
      },
      {
        id: 4,
        name: 'Math Resources',
        description: 'Mathematics learning resources and worksheets',
        path: '/Class Materials/Math Resources',
        parentId: 1,
        permissions: {
          type: 'public',
          allowedUsers: [],
          allowedRoles: ['teacher', 'student']
        },
        createdBy: 'Math Teacher',
        createdAt: '2024-01-20T09:30:00Z',
        modifiedAt: '2024-01-25T13:15:00Z',
        fileCount: 67,
        totalSize: 209715200, // 200MB
        subfolders: 4
      },
      {
        id: 5,
        name: 'Science Labs',
        description: 'Laboratory experiments and procedures',
        path: '/Class Materials/Science Labs',
        parentId: 1,
        permissions: {
          type: 'role_based',
          allowedUsers: [],
          allowedRoles: ['teacher', 'student']
        },
        createdBy: 'Science Teacher',
        createdAt: '2024-01-18T14:20:00Z',
        modifiedAt: '2024-01-24T10:45:00Z',
        fileCount: 34,
        totalSize: 157286400, // 150MB
        subfolders: 2
      }
    ];

    setTimeout(() => {
      setFolders(mockFolders);
      setFilteredFolders(mockFolders);
      setLoading(false);
    }, 1000);
  }, [organizationId]);

  useEffect(() => {
    const filtered = folders.filter(folder => {
      const matchesSearch = folder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           folder.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || folder.permissions.type === filterType;

      return matchesSearch && matchesType;
    });

    setFilteredFolders(filtered);
  }, [folders, searchTerm, filterType]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPermissionIcon = (permissions) => {
    switch (permissions.type) {
      case 'public':
        return <Unlock className="w-4 h-4 text-green-500" />;
      case 'private':
        return <Lock className="w-4 h-4 text-red-500" />;
      case 'role_based':
        return <Users className="w-4 h-4 text-blue-500" />;
      default:
        return <Lock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPermissionLabel = (permissions) => {
    switch (permissions.type) {
      case 'public':
        return 'Public';
      case 'private':
        return 'Private';
      case 'role_based':
        return 'Role-based';
      default:
        return 'Unknown';
    }
  };

  const handleCreateFolder = (folderData) => {
    const newFolder = {
      id: Date.now(),
      ...folderData,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      fileCount: 0,
      totalSize: 0,
      subfolders: 0
    };

    setFolders(prev => [...prev, newFolder]);
    setShowCreateModal(false);
  };

  const handleEditFolder = (folderData) => {
    setFolders(prev => prev.map(folder =>
      folder.id === selectedFolder.id
        ? { ...folder, ...folderData, modifiedAt: new Date().toISOString() }
        : folder
    ));
    setShowEditModal(false);
    setSelectedFolder(null);
  };

  const handleDeleteFolder = (folderId) => {
    if (window.confirm('Are you sure you want to delete this folder? This action cannot be undone.')) {
      setFolders(prev => prev.filter(folder => folder.id !== folderId));
    }
  };

  const FolderModal = ({ isOpen, onClose, onSave, folder, title }) => {
    const [formData, setFormData] = useState({
      name: folder?.name || '',
      description: folder?.description || '',
      parentId: folder?.parentId || null,
      permissions: folder?.permissions || {
        type: 'public',
        allowedUsers: [],
        allowedRoles: ['teacher', 'student']
      }
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <Trash2 className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Folder Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
              <select
                value={formData.permissions.type}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  permissions: { ...prev.permissions, type: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="public">Public - Accessible to all users</option>
                <option value="role_based">Role-based - Specific roles only</option>
                <option value="private">Private - Specific users only</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                {folder ? 'Update' : 'Create'} Folder
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">Folder Management</h1>
          <p className="text-gray-600 mt-1">Organize and manage your folder structure</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Create Folder</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Folder className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Folders</p>
              <p className="text-2xl font-bold text-gray-900">{folders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Unlock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Public Folders</p>
              <p className="text-2xl font-bold text-gray-900">
                {folders.filter(f => f.permissions.type === 'public').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Private Folders</p>
              <p className="text-2xl font-bold text-gray-900">
                {folders.filter(f => f.permissions.type === 'private').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Role-based</p>
              <p className="text-2xl font-bold text-gray-900">
                {folders.filter(f => f.permissions.type === 'role_based').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Permissions</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="role_based">Role-based</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Folder Tree/List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folder</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFolders.map((folder) => (
                <tr key={folder.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Folder className="w-8 h-8 text-blue-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{folder.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{folder.description}</div>
                        <div className="text-xs text-gray-400">{folder.path}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPermissionIcon(folder.permissions)}
                      <span className="ml-2 text-sm text-gray-900">
                        {getPermissionLabel(folder.permissions)}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{folder.fileCount} files</div>
                    <div>{folder.subfolders} folders</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(folder.totalSize)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(folder.modifiedAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedFolder(folder);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Share">
                        <Share className="w-4 h-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900" title="Settings">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFolder(folder.id)}
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

        {filteredFolders.length === 0 && (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No folders found</h3>
            <p className="text-gray-600">Try adjusting your search or create a new folder</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <FolderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateFolder}
        title="Create New Folder"
      />

      <FolderModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedFolder(null);
        }}
        onSave={handleEditFolder}
        folder={selectedFolder}
        title="Edit Folder"
      />
    </div>
  );
};

export default FolderManagement;
