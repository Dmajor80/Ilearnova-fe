import React, { useState, useEffect } from 'react';
import { Bell, Search, Filter, Calendar, AlertCircle, CheckCircle, Info, XCircle, Clock } from 'lucide-react';
import { getAnnouncements } from '../../../api/announcementApi';

function Announcement() {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        // If no data from API, use sample data
        const announcementsData = data && data.length > 0 ? data : getSampleAnnouncements();
        setAnnouncements(announcementsData);
        setFilteredAnnouncements(announcementsData);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        // Use sample data on error
        const sampleData = getSampleAnnouncements();
        setAnnouncements(sampleData);
        setFilteredAnnouncements(sampleData);
      } finally {
        setAnnouncementsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const getSampleAnnouncements = () => {
    return [
      {
        id: 1,
        title: "Mid-Term Examination Schedule Released",
        description: "The mid-term examination schedule for all classes has been finalized. Students are advised to prepare accordingly and check the detailed timetable on the student portal. Remember to bring all necessary materials and arrive 15 minutes early.",
        type: "Event",
        date: new Date().toISOString(),
        color: "bg-blue-100 text-blue-800",
        buttonColor: "bg-blue-500 hover:bg-blue-600",
        buttonText: "View Schedule"
      },
      {
        id: 2,
        title: "Parent-Teacher Conference Next Week",
        description: "We invite all parents to join us for the quarterly Parent-Teacher Conference on December 15th, 2024. This is an excellent opportunity to discuss your child's progress, academic performance, and future goals. Please schedule your appointment through the parent portal.",
        type: "Event",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        color: "bg-green-100 text-green-800",
        buttonColor: "bg-green-500 hover:bg-green-600",
        buttonText: "Schedule Meeting"
      },
      {
        id: 3,
        title: "School Fee Payment Deadline Extended",
        description: "Due to popular request, the deadline for the third term school fees has been extended to December 20th, 2024. Late payment penalties will be waived for payments made before this date. Please ensure timely payment to avoid any inconvenience.",
        type: "Payment",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        color: "bg-yellow-100 text-yellow-800",
        buttonColor: "bg-yellow-500 hover:bg-yellow-600",
        buttonText: "Pay Now"
      },
      {
        id: 4,
        title: "URGENT: School Closure Due to Weather",
        description: "Due to the severe weather forecast, all classes will be suspended tomorrow, December 10th, 2024. Students should stay home and follow safety guidelines. Online classes will be conducted if conditions improve. Stay tuned for updates.",
        type: "Urgent",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        color: "bg-red-100 text-red-800",
        buttonColor: "bg-red-500 hover:bg-red-600",
        buttonText: "Acknowledge"
      },
      {
        id: 5,
        title: "New Library Books Available",
        description: "We're excited to announce the arrival of new books in our school library! The collection includes latest novels, science fiction, educational materials, and reference books. Students can borrow books during library hours. Check the library catalog for availability.",
        type: "General",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        color: "bg-purple-100 text-purple-800",
        buttonColor: "bg-purple-500 hover:bg-purple-600",
        buttonText: "Browse Books"
      },
      {
        id: 6,
        title: "Sports Day Registration Open",
        description: "Registration for the Annual Sports Day is now open! Events include track and field, team sports, and individual competitions. All students from grades 1-12 are eligible to participate. Early registration ensures better preparation time.",
        type: "Event",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        color: "bg-indigo-100 text-indigo-800",
        buttonColor: "bg-indigo-500 hover:bg-indigo-600",
        buttonText: "Register Now"
      },
      {
        id: 7,
        title: "COVID-19 Vaccination Drive",
        description: "A vaccination drive will be conducted at the school premises next Saturday. All eligible students and staff are encouraged to participate. Parents' consent is required for students under 18. Bring your vaccination cards and ID proof.",
        type: "General",
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        color: "bg-teal-100 text-teal-800",
        buttonColor: "bg-teal-500 hover:bg-teal-600",
        buttonText: "Get Details"
      },
      {
        id: 8,
        title: "Academic Excellence Awards Ceremony",
        description: "Congratulations to all our high achievers! The Academic Excellence Awards Ceremony will be held on December 22nd, 2024. Certificates and medals will be distributed to students who excelled in their examinations. Parents are cordially invited.",
        type: "Success",
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        color: "bg-emerald-100 text-emerald-800",
        buttonColor: "bg-emerald-500 hover:bg-emerald-600",
        buttonText: "View Winners"
      },
      {
        id: 9,
        title: "New Online Learning Platform",
        description: "We're introducing a new online learning platform to enhance digital education. All students will receive login credentials via email. The platform includes interactive lessons, quizzes, and progress tracking. Training sessions will be conducted next week.",
        type: "General",
        date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        color: "bg-cyan-100 text-cyan-800",
        buttonColor: "bg-cyan-500 hover:bg-cyan-600",
        buttonText: "Access Platform"
      }
    ];
  };

  useEffect(() => {
    let filtered = announcements.filter(announcement =>
      announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedType !== 'All') {
      filtered = filtered.filter(announcement => announcement.type === selectedType);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'type') {
        return (a.type || '').localeCompare(b.type || '');
      }
      return 0;
    });

    setFilteredAnnouncements(filtered);
  }, [announcements, searchTerm, selectedType, sortBy]);

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'urgent':
        return <AlertCircle className="w-4 h-4" />;
      case 'event':
        return <Calendar className="w-4 h-4" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'event':
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAnnouncementAction = (index) => {
    const announcement = filteredAnnouncements[index];
    const actions = {
      'Registration': 'Registration submitted!',
      'Payment': 'Payment initiated!',
      'Event': 'Added to calendar!',
      'General': 'Details viewed!',
      'Urgent': 'Acknowledged!',
    };
    alert(actions[announcement.type] || 'Action completed!');
  };

  const uniqueTypes = ['All', ...new Set(announcements.map(a => a.type).filter(Boolean))];

  if (announcementsLoading) {
    return (
      <div className="m-4 md:m-6 mt-0">
        <div className="mb-6 mt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">School Announcements</h2>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 md:m-6 mt-0">
        <div className="mb-6 mt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">School Announcements</h2>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Announcements</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="m-4 md:m-6 mt-0">
      <div className="mb-6 mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <Bell className="w-8 h-8 mr-3 text-blue-600" />
              School Announcements
            </h2>
            <p className="text-gray-600 mt-2">Stay updated with the latest school news and important information</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="type">Sort by Type</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Announcements Grid */}
        {filteredAnnouncements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.map((announcement, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getTypeColor(announcement.type)}`}>
                    {getTypeIcon(announcement.type)}
                    {announcement.type || 'General'}
                  </span>
                  <div className="flex items-center text-xs text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {announcement.date ? new Date(announcement.date).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight">{announcement.title || 'Untitled Announcement'}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">{announcement.description || 'No description available.'}</p>
                <button
                  onClick={() => handleAnnouncementAction(index)}
                  className={`w-full ${announcement.buttonColor || 'bg-blue-500 hover:bg-blue-600'} text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2`}
                >
                  {announcement.buttonText || 'View Details'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Announcements Found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Announcements</p>
                <p className="text-2xl font-bold">{announcements.length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">This Month</p>
                <p className="text-2xl font-bold">
                  {announcements.filter(a => {
                    const date = new Date(a.date);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Urgent</p>
                <p className="text-2xl font-bold">
                  {announcements.filter(a => a.type?.toLowerCase() === 'urgent').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Important Notes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-500" />
                Stay Informed
              </h4>
              <p className="text-sm text-gray-600">Regularly check this page for updates on school events, policy changes, and important deadlines.</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Contact Support
              </h4>
              <p className="text-sm text-gray-600">If you have questions about any announcement, please contact the school administration.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Announcement;
