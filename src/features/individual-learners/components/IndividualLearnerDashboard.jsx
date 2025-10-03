import React, { useState, useEffect } from 'react';
import { Search, Filter, User, Activity, Star, Trophy, CheckCircle, AlertCircle } from 'lucide-react';

const IndividualLearnerDashboard = () => {
  const [learners, setLearners] = useState([]);
  const [filteredLearners, setFilteredLearners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockLearners = [
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice.johnson@email.com',
        status: 'active',
        progress: 85,
        achievements: 5,
        lastActive: '2024-01-25T10:30:00Z'
      },
      {
        id: 2,
        name: 'Bob Smith',
        email: 'bob.smith@email.com',
        status: 'inactive',
        progress: 40,
        achievements: 2,
        lastActive: '2023-12-15T14:15:00Z'
      },
      {
        id: 3,
        name: 'Charlie Brown',
        email: 'charlie.brown@email.com',
        status: 'active',
        progress: 95,
        achievements: 8,
        lastActive: '2024-01-28T09:45:00Z'
      },
      {
        id: 4,
        name: 'Diana Wilson',
        email: 'diana.wilson@email.com',
        status: 'active',
        progress: 70,
        achievements: 3,
        lastActive: '2024-01-20T11:20:00Z'
      }
    ];

    setTimeout(() => {
      setLearners(mockLearners);
      setFilteredLearners(mockLearners);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = learners.filter(learner => {
      const matchesSearch = learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            learner.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || learner.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
    setFilteredLearners(filtered);
  }, [learners, searchTerm, filterStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Individual Learners Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of learner progress and achievements</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search learners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Learners List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achievements</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLearners.map(learner => (
                <tr key={learner.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-500" />
                    <span>{learner.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{learner.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(learner.status)}`}>
                      {learner.status.charAt(0).toUpperCase() + learner.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{learner.progress}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 flex items-center space-x-1">
                    <Star className="w-5 h-5" />
                    <span>{learner.achievements}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(learner.lastActive).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLearners.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No learners found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndividualLearnerDashboard;
