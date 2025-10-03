import React, { useState, useEffect } from 'react';
import {
  Folder, File, Image, Video, Music, FileText, Archive,
  Search, Filter, Grid, List, Download, Share, Trash2,
  Edit, MoreVertical, ChevronRight, ChevronDown, Home,
  Upload, Plus, Eye, Copy, Move
} from 'lucide-react';

const FileBrowser = ({ organizationId, onFileSelect, onFolderSelect }) => {
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Mock data for demonstration
  useEffect(() => {
    const mockFolders = [
      { id: 1, name: 'Documents', type: 'folder', size: null, modified: '2024-01-28T10:30:00Z', path: '/Documents' },
      { id: 2, name: 'Images', type: 'folder', size: null, modified: '2024-01-27T15:45:00Z', path: '/Images' },
      { id: 3, name: 'Videos', type: 'folder', size: null, modified: '2024-01-26T09:20:00Z', path: '/Videos' },
      { id: 4, name: 'Assignments', type: 'folder', size: null, modified: '2024-01-25T14:10:00Z', path: '/Assignments' }
    ];

    const mockFiles = [
      { id: 5, name: 'lesson_plan.pdf', type: 'file', fileType: 'application/pdf', size: 2457600, modified: '2024-01-28T08:15:00Z', path: '/lesson_plan.pdf' },
      { id: 6, name: 'math_homework.docx', type: 'file', fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 512000, modified: '2024-01-27T16:30:00Z', path: '/math_homework.docx' },
      { id: 7, name: 'science_presentation.pptx', type: 'file', fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', size: 15728640, modified: '2024-01-26T11:45:00Z', path: '/science_presentation.pptx' },
      { id: 8, name: 'class_photo.jpg', type: 'file', fileType: 'image/jpeg', size: 2048000, modified: '2024-01-25T13:20:00Z', path: '/class_photo.jpg' },
      { id: 9, name: 'welcome_video.mp4', type: 'file', fileType: 'video/mp4', size: 104857600, modified: '2024-01-24T10:00:00Z', path: '/welcome_video.mp4' },
      { id: 10, name: 'background_music.mp3', type: 'file', fileType: 'audio/mpeg', size: 5242880, modified: '2024-01-23T15:30:00Z', path: '/background_music.mp3' },
      { id: 11, name: 'student_data.xlsx', type: 'file', fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 1024000, modified: '2024-01-22T09:45:00Z', path: '/student_data.xlsx' },
      { id: 12, name: 'archive.zip', type: 'file', fileType: 'application/zip', size: 20971520, modified: '2024-01-21T14:15:00Z', path: '/archive.zip' }
    ];

    setTimeout(() => {
      setFolders(mockFolders);
      setFiles(mockFiles);
      setLoading(false);
    }, 1000);
  }, [currentPath]);

  useEffect(() => {
    const allItems = [...folders, ...files];

    const filtered = allItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' ||
        (filterType === 'folder' && item.type === 'folder') ||
        (filterType === 'file' && item.type === 'file') ||
        (filterType !== 'folder' && filterType !== 'file' && item.fileType?.includes(filterType));

      return matchesSearch && matchesType;
    });

    // Sort items
    const sorted = filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'size':
          aValue = a.size || 0;
          bValue = b.size || 0;
          break;
        case 'modified':
          aValue = new Date(a.modified);
          bValue = new Date(b.modified);
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredItems(sorted);
  }, [folders, files, searchTerm, filterType, sortBy, sortOrder]);

  const getFileIcon = (item) => {
    if (item.type === 'folder') {
      return <Folder className="w-8 h-8 text-blue-500" />;
    }

    if (item.fileType?.startsWith('image/')) return <Image className="w-8 h-8 text-green-500" />;
    if (item.fileType?.startsWith('video/')) return <Video className="w-8 h-8 text-red-500" />;
    if (item.fileType?.startsWith('audio/')) return <Music className="w-8 h-8 text-purple-500" />;
    if (item.fileType?.includes('pdf')) return <FileText className="w-8 h-8 text-red-600" />;
    if (item.fileType?.includes('document') || item.fileType?.includes('word')) return <FileText className="w-8 h-8 text-blue-600" />;
    if (item.fileType?.includes('presentation') || item.fileType?.includes('powerpoint')) return <FileText className="w-8 h-8 text-orange-600" />;
    if (item.fileType?.includes('spreadsheet') || item.fileType?.includes('excel')) return <FileText className="w-8 h-8 text-green-600" />;
    if (item.fileType?.includes('zip') || item.fileType?.includes('rar')) return <Archive className="w-8 h-8 text-yellow-600" />;

    return <File className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString();
  };

  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      setCurrentPath(item.path);
      if (onFolderSelect) onFolderSelect(item);
    } else {
      if (onFileSelect) onFileSelect(item);
    }
  };

  const handleItemSelect = (item, event) => {
    event.stopPropagation();

    setSelectedItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const navigateToPath = (path) => {
    setCurrentPath(path);
  };

  const getBreadcrumbs = () => {
    const parts = currentPath.split('/').filter(p => p);
    const breadcrumbs = [{ name: 'Home', path: '/' }];

    let currentPathBuild = '';
    parts.forEach(part => {
      currentPathBuild += `/${part}`;
      breadcrumbs.push({ name: part, path: currentPathBuild });
    });

    return breadcrumbs;
  };

  const downloadSelected = () => {
    // Mock download functionality
    selectedItems.forEach(item => {
      if (item.type === 'file') {
        // In real app, this would trigger actual download
        console.log(`Downloading ${item.name}`);
      }
    });
  };

  const deleteSelected = () => {
    // Mock delete functionality
    setFiles(prev => prev.filter(file => !selectedItems.some(selected => selected.id === file.id)));
    setFolders(prev => prev.filter(folder => !selectedItems.some(selected => selected.id === folder.id)));
    setSelectedItems([]);
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
          <h1 className="text-3xl font-bold text-gray-900">File Browser</h1>
          <p className="text-gray-600 mt-1">Browse and manage your files</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Folder</span>
          </button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm">
        {getBreadcrumbs().map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            <button
              onClick={() => navigateToPath(crumb.path)}
              className={`hover:text-blue-600 transition-colors ${
                index === getBreadcrumbs().length - 1 ? 'text-gray-900 font-medium' : 'text-gray-600'
              }`}
            >
              {crumb.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="folder">Folders</option>
              <option value="image/">Images</option>
              <option value="video/">Videos</option>
              <option value="audio/">Audio</option>
              <option value="pdf">PDFs</option>
              <option value="document">Documents</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="size">Size</option>
              <option value="modified">Modified</option>
              <option value="type">Type</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>

          {/* View Mode */}
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="mt-4 flex items-center justify-between bg-blue-50 rounded-lg p-3">
            <span className="text-sm text-blue-700">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={downloadSelected}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Download
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                Share
              </button>
              <button
                onClick={deleteSelected}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* File Grid/List */}
      {filteredItems.length > 0 ? (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'
            : 'space-y-2'
        }>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`
                ${viewMode === 'grid'
                  ? 'bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer'
                  : 'bg-white rounded-lg shadow-sm p-4 hover:bg-gray-50 transition-colors cursor-pointer'
                }
                ${selectedItems.some(selected => selected.id === item.id) ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              {viewMode === 'grid' ? (
                // Grid View
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    {getFileIcon(item)}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {item.type === 'folder' ? 'Folder' : formatFileSize(item.size)}
                  </p>
                  <input
                    type="checkbox"
                    checked={selectedItems.some(selected => selected.id === item.id)}
                    onChange={(e) => handleItemSelect(item, e)}
                    className="mt-2"
                  />
                </div>
              ) : (
                // List View
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedItems.some(selected => selected.id === item.id)}
                      onChange={(e) => handleItemSelect(item, e)}
                    />
                    {getFileIcon(item)}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(item.modified)} • {item.type === 'folder' ? 'Folder' : formatFileSize(item.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600" title="Download">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600" title="Share">
                      <Share className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600" title="More">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No files found</h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'This folder is empty'
            }
          </p>
        </div>
      )}

      {/* Storage Info */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Used Storage</span>
              <span>2.4 GB of 10 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '24%' }}></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">1,247</p>
              <p className="text-sm text-gray-600">Files</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">89</p>
              <p className="text-sm text-gray-600">Folders</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">7.6 GB</p>
              <p className="text-sm text-gray-600">Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Missing ChevronUp import
const ChevronUp = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

export default FileBrowser;
