import React, { useState, useEffect } from 'react';
import { Video, Calendar, Users, Clock, Play, Plus } from 'lucide-react';
import { getVideoCalls } from '@/api';

const VideoCallList = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await getVideoCalls();
        if (response.ok) {
          setCalls(response.data || []);
        } else {
          setError('Failed to load video calls');
        }
      } catch (err) {
        console.error('Error loading video calls:', err);
        setError('Failed to load video calls');
      } finally {
        setLoading(false);
      }
    };
    fetchCalls();
  }, []);

  const filteredCalls = calls.filter(call => {
    const now = new Date();
    const callTime = new Date(call.scheduled_at);

    if (filter === 'upcoming') return callTime > now;
    if (filter === 'past') return callTime < now;
    return true;
  });

  const getStatusColor = (call) => {
    const now = new Date();
    const callTime = new Date(call.scheduled_at);

    if (callTime > now) return 'text-blue-600 bg-blue-100';
    if (callTime < now) return 'text-gray-600 bg-gray-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusText = (call) => {
    const now = new Date();
    const callTime = new Date(call.scheduled_at);

    if (callTime > now) return 'Upcoming';
    if (callTime < now) return 'Completed';
    return 'Live';
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading video calls...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Video Calls</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect and collaborate through video calls. Schedule meetings and join live sessions.
          </p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' ? 'bg-teal-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Calls
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'upcoming' ? 'bg-teal-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'past' ? 'bg-teal-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Past
            </button>
          </div>
          <button className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Schedule Call</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalls.map((call) => (
            <div
              key={call.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6"
            >
              <div className="flex items-center mb-4">
                <Video className="w-8 h-8 text-teal-500 mr-3" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{call.title}</h3>
                  <p className="text-sm text-gray-500">{call.description}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(call.scheduled_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{new Date(call.scheduled_at).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{call.participants_count || 0} participants</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(call)}`}>
                  {getStatusText(call)}
                </span>
                <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors flex items-center space-x-1">
                  <Play className="w-4 h-4" />
                  <span>Join</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCalls.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No video calls found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallList;
