import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, Video, Music, FileText, Archive, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const FileUploader = ({ onUploadSuccess, maxFileSize = 10, allowedTypes = [], multiple = true }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image className="w-8 h-8 text-blue-500" />;
    if (fileType.startsWith('video/')) return <Video className="w-8 h-8 text-red-500" />;
    if (fileType.startsWith('audio/')) return <Music className="w-8 h-8 text-green-500" />;
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="w-8 h-8 text-orange-500" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="w-8 h-8 text-purple-500" />;
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
    const errors = [];

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      errors.push(`File size exceeds ${maxFileSize}MB limit`);
    }

    // Check file type
    if (allowedTypes.length > 0) {
      const isAllowed = allowedTypes.some(type => {
        if (type.includes('*')) {
          return file.type.startsWith(type.replace('*', ''));
        }
        return file.type === type;
      });

      if (!isAllowed) {
        errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      }
    }

    return errors;
  };

  const handleFiles = useCallback((fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      errors: validateFile(file),
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, [maxFileSize, allowedTypes]);

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
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const uploadFiles = async () => {
    const validFiles = files.filter(f => f.errors.length === 0);
    if (validFiles.length === 0) return;

    setUploading(true);

    for (const fileData of validFiles) {
      try {
        // Update status to uploading
        setFiles(prev => prev.map(f =>
          f.id === fileData.id ? { ...f, status: 'uploading' } : f
        ));

        // Mock upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress(prev => ({
            ...prev,
            [fileData.id]: progress
          }));
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Mock successful upload
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update status to completed
        setFiles(prev => prev.map(f =>
          f.id === fileData.id ? { ...f, status: 'completed' } : f
        ));

        // Call success callback
        if (onUploadSuccess) {
          onUploadSuccess({
            id: fileData.id,
            name: fileData.name,
            size: fileData.size,
            type: fileData.type,
            url: `https://example.com/files/${fileData.id}`,
            uploadedAt: new Date().toISOString()
          });
        }

      } catch (error) {
        setFiles(prev => prev.map(f =>
          f.id === fileData.id ? { ...f, status: 'error', errors: ['Upload failed'] } : f
        ));
      }
    }

    setUploading(false);
    setUploadProgress({});
  };

  const clearCompleted = () => {
    setFiles(prev => prev.filter(f => f.status !== 'completed'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">File Upload</h1>
          <p className="text-gray-600 mt-1">Upload files to your workspace</p>
        </div>
        {files.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={clearCompleted}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Completed
            </button>
            <button
              onClick={uploadFiles}
              disabled={uploading || files.filter(f => f.errors.length === 0).length === 0}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Upload Files'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Upload className={`w-8 h-8 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
        </div>

        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-900">
            {dragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-gray-600">
            or{' '}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              browse files
            </button>
          </p>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>Maximum file size: {maxFileSize}MB</p>
          {allowedTypes.length > 0 && (
            <p>Allowed types: {allowedTypes.join(', ')}</p>
          )}
          {multiple && <p>Multiple files allowed</p>}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={allowedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Files to Upload ({files.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {files.map((fileData) => (
              <div key={fileData.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getFileIcon(fileData.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileData.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(fileData.size)}
                      </p>

                      {/* Progress Bar */}
                      {fileData.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress[fileData.id] || 0}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {uploadProgress[fileData.id] || 0}% uploaded
                          </p>
                        </div>
                      )}

                      {/* Errors */}
                      {fileData.errors.length > 0 && (
                        <div className="mt-2">
                          {fileData.errors.map((error, index) => (
                            <p key={index} className="text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {error}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Status */}
                    {fileData.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {fileData.status === 'uploading' && (
                      <Loader className="w-5 h-5 text-blue-500 animate-spin" />
                    )}
                    {fileData.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(fileData.id)}
                      disabled={fileData.status === 'uploading'}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Summary */}
      {files.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{files.length}</p>
              <p className="text-sm text-gray-600">Total Files</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {files.filter(f => f.errors.length === 0).length}
              </p>
              <p className="text-sm text-gray-600">Valid Files</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {files.filter(f => f.errors.length > 0).length}
              </p>
              <p className="text-sm text-gray-600">Invalid Files</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {files.filter(f => f.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Uploaded</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
