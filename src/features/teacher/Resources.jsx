import React, { useState } from "react";
import CoursesComponent from "./components/CourseComponents";
import { Search, Filter, Plus, Download, Upload, Eye, Edit, Trash2, FileText, Video, Image, Music, BookOpen, Link, Folder } from "lucide-react";

const Resources = () => {
  const [activeTab, setActiveTab] = useState("library");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const categories = ["all", "documents", "videos", "images", "audio", "links"];
  const subjects = ["all", "Mathematics", "Physics", "Chemistry", "English", "Biology", "History"];

  const resources = [
    {
      id: 1,
      title: "Algebra Fundamentals PDF",
      type: "document",
      subject: "Mathematics",
      description: "Comprehensive guide to basic algebraic concepts",
      size: "2.5 MB",
      uploadedBy: "Mr. Johnson",
      uploadDate: "2024-01-10",
      downloads: 45,
      tags: ["algebra", "equations", "basics"]
    },
    {
      id: 2,
      title: "Newton's Laws Video Lecture",
      type: "video",
      subject: "Physics",
      description: "Complete explanation of Newton's three laws of motion",
      size: "156 MB",
      uploadedBy: "Ms. Davis",
      uploadDate: "2024-01-12",
      downloads: 78,
      tags: ["physics", "newton", "motion"]
    },
    {
      id: 3,
      title: "Periodic Table Chart",
      type: "image",
      subject: "Chemistry",
      description: "High-resolution periodic table with element details",
      size: "1.2 MB",
      uploadedBy: "Mr. Brown",
      uploadDate: "2024-01-08",
      downloads: 92,
      tags: ["chemistry", "periodic table", "elements"]
    },
    {
      id: 4,
      title: "Shakespeare Sonnets Audio",
      type: "audio",
      subject: "English",
      description: "Professional recordings of famous Shakespeare sonnets",
      size: "45 MB",
      uploadedBy: "Mrs. Wilson",
      uploadDate: "2024-01-15",
      downloads: 23,
      tags: ["english", "shakespeare", "poetry"]
    },
    {
      id: 5,
      title: "Khan Academy Links",
      type: "link",
      subject: "Mathematics",
      description: "Curated collection of Khan Academy math tutorials",
      size: "N/A",
      uploadedBy: "Mr. Johnson",
      uploadDate: "2024-01-05",
      downloads: 156,
      tags: ["khan academy", "tutorials", "math"]
    },
    {
      id: 6,
      title: "Biology Lab Safety Guidelines",
      type: "document",
      subject: "Biology",
      description: "Essential safety protocols for biology laboratory work",
      size: "890 KB",
      uploadedBy: "Ms. Green",
      uploadDate: "2024-01-18",
      downloads: 67,
      tags: ["biology", "safety", "lab"]
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || resource.type === selectedCategory;
    const matchesSubject = selectedSubject === "all" || resource.subject === selectedSubject;
    return matchesSearch && matchesCategory && matchesSubject;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case "document":
        return <FileText className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "image":
        return <Image className="w-5 h-5" />;
      case "audio":
        return <Music className="w-5 h-5" />;
      case "link":
        return <Link className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "document":
        return "bg-blue-100 text-blue-800";
      case "video":
        return "bg-red-100 text-red-800";
      case "image":
        return "bg-green-100 text-green-800";
      case "audio":
        return "bg-purple-100 text-purple-800";
      case "link":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <CoursesComponent page="Resources" />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Resource Library</h2>
              <div className="flex items-center space-x-3">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
                  <Upload className="w-5 h-5" />
                  <span>Upload Resource</span>
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
                  <Plus className="w-5 h-5" />
                  <span>Create Folder</span>
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1">
              {["library", "shared", "favorites"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                  ))}
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Subjects</option>
                  {subjects.slice(1).map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors">
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {resources.length}
                </div>
                <div className="text-sm text-gray-600">Total Resources</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {resources.filter(r => r.type === 'document').length}
                </div>
                <div className="text-sm text-gray-600">Documents</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {resources.filter(r => r.type === 'video').length}
                </div>
                <div className="text-sm text-gray-600">Videos</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {resources.filter(r => r.type === 'image').length}
                </div>
                <div className="text-sm text-gray-600">Images</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {resources.reduce((sum, r) => sum + r.downloads, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Downloads</div>
              </div>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                        {getTypeIcon(resource.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{resource.title}</h3>
                        <p className="text-xs text-gray-500">{resource.subject}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Size: {resource.size}</span>
                    <span>{resource.downloads} downloads</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <div>By {resource.uploadedBy}</div>
                      <div>{new Date(resource.uploadDate).toLocaleDateString()}</div>
                    </div>

                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-colors">
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Recent Activity */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {resources.slice(0, 5).map((resource) => (
                <div key={resource.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1 rounded ${getTypeColor(resource.type)}`}>
                      {getTypeIcon(resource.type)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                      <div className="text-xs text-gray-500">Downloaded by {resource.downloads} students</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(resource.uploadDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Resources;
