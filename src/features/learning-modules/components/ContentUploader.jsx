import React, { useState, useCallback } from 'react';
import { Upload, File, Video, Image, FileText, X, CheckCircle, AlertCircle, Loader, Plus } from 'lucide-react';

const ContentUploader = ({ moduleId, onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragActive, setDragActive] = useState(false);

  const acceptedFileTypes = {
    'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'text/plain': ['.txt'],
    'application/zip': ['.zip'],
    'application/x-rar-compressed': ['.rar']
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('video/')) return <Video className="w-8 h-8 text-red-500" />;
    if (fileType.startsWith('image/')) return <Image className="w-8 h-8 text-green-500" />;
    if (fileType === 'application/pdf') return <FileText className="w-8 h-8 text-red-600" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = Object.keys(acceptedFileTypes);

    if (file.size > maxSize) {
      return { valid: false, error: 'File size exceeds 100MB limit' };
    }

    const isAllowedType = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isAllowedType) {
      return { valid: false, error: 'File type not supported' };
    }

    return { valid: true };
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = (selectedFiles) => {
    const validFiles = [];
    const errors = [];

    selectedFiles.forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push({
          id: Date.now() + Math.random(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'pending',
          progress: 0,
          error: null
        });
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }

    if (errors.length > 0) {
      // Show error notification
      console.error('File validation errors:', errors);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const uploadFile = async (fileId) => {
    const fileIndex = files.findIndex(f => f.id === fileId);
    if (fileIndex === -1) return;

    const fileData = files[fileIndex];

    // Update status to uploading
    setFiles(prev => prev.map(f =>
      f.id === fileId ? { ...f, status: 'uploading', progress: 0 } : f
    ));

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === fileId && f.progress < 100) {
            const newProgress = Math.min(f.progress + Math.random() * 20, 100);
            setUploadProgress(prevProgress => ({
              ...prevProgress,
              [fileId]: newProgress
            }));
            return { ...f, progress: newProgress };
          }
          return f;
        }));
      }, 200);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      clearInterval(progressInterval);

      // Update status to completed
      setFiles(prev => prev.map(f =>
        f.id === fileId ? { ...f, status: 'completed', progress: 100 } : f
      ));

      // Call completion callback
      if (onUploadComplete) {
        onUploadComplete(fileData);
      }

    } catch (error) {
      // Update status to error
      setFiles(prev => prev.map(f =>
        f.id === fileId ? { ...f, status: 'error', error: 'Upload failed' } : f
      ));
    }
  };

  const uploadAllFiles = async () => {
    setUploading(true);
    const pendingFiles = files.filter(f => f.status === 'pending');

    for (const file of pendingFiles) {
      await uploadFile(file.id);
    }

    setUploading(false);
  };

  const clearCompleted = () => {
    setFiles(prev => prev.filter(f => f.status !== 'completed'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Uploader</h1>
          <p className="text-gray-600 mt-1">Upload learning materials and resources for modules</p>
        </div>
        {files.length > 0 && (
          <div className="flex space-x-3">
            <button
              onClick={uploadAllFiles}
              disabled={uploading || files.filter(f => f.status === 'pending').length === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
            >
              {uploading ? <Loader className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              <span>{uploading ? 'Uploading...' : 'Upload All'}</span>
            </button>
            <button
              onClick={clearCompleted}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Clear Completed
            </button>
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {dragActive ? 'Drop files here' : 'Upload Learning Content'}
        </h3>
        <p className="text-gray-600 mb-6">
          Drag and drop files here, or click to browse
        </p>

        <input
          type="file"
          multiple
          accept={Object.keys(acceptedFileTypes).join(',')}
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors inline-block"
        >
          Choose Files
        </label>

        <div className="mt-4 text-sm text-gray-500">
          <p>Supported formats: Videos, Images, PDFs, Documents, Presentations, Spreadsheets</p>
          <p>Maximum file size: 100MB per file</p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Files ({files.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {files.map((fileData) => (
              <div key={fileData.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getFileIcon(fileData.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{fileData.name}</h4>
                      <p className="text-sm text-gray-600">{formatFileSize(fileData.size)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Status */}
                    <div className="flex items-center space-x-2">
                      {fileData.status === 'pending' && (
                        <div className="flex items-center space-x-1 text-gray-500">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">Pending</span>
                        </div>
                      )}
                      {fileData.status === 'uploading' && (
                        <div className="flex items-center space-x-1 text-blue-600">
                          <Loader className="w-4 h-4 animate-spin" />
                          <span className="text-sm">{Math.round(fileData.progress)}%</span>
                        </div>
                      )}
                      {fileData.status === 'completed' && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Completed</span>
                        </div>
                      )}
                      {fileData.status === 'error' && (
                        <div className="flex items-center space-x-1 text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">Error</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {fileData.status === 'uploading' && (
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${fileData.progress}%` }}
                        ></div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {fileData.status === 'pending' && (
                        <button
                          onClick={() => uploadFile(fileData.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Upload file"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeFile(fileData.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {fileData.error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{fileData.error}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Statistics */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{files.length}</div>
            <div className="text-sm text-gray-600">Total Files</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {files.filter(f => f.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Uploaded</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {files.filter(f => f.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-red-600">
              {files.filter(f => f.status === 'error').length}
            </div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentUploader;
