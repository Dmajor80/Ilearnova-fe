import React, { useState, useEffect } from 'react';
import { Calendar, Gift, Bell, Users, Cake, Heart, Star } from 'lucide-react';
import { http } from '../../api/baseClient';

const BirthdayDashboard = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const data = await http.get('/api/birthdays');
        setBirthdays(data?.data || data || []);
      } catch (err) {
        setError('Failed to load birthdays');
      } finally {
        setLoading(false);
      }
    };
    fetchBirthdays();
  }, []);

  const today = new Date();
  const todayBirthdays = birthdays.filter(birthday => {
    const birthdayDate = new Date(birthday.date);
    return birthdayDate.getDate() === today.getDate() && birthdayDate.getMonth() === today.getMonth();
  });

  const upcomingBirthdays = birthdays.filter(birthday => {
    const birthdayDate = new Date(birthday.date);
    const diffTime = birthdayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7;
  });

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading birthdays...</div>
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
          <h1 className="text-5xl font-bold text-white mb-4">Birthday Celebrations</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Celebrate the special moments! Join us in wishing our community members a happy birthday.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Today's Birthdays */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6">
            <div className="flex items-center mb-4">
              <Cake className="w-8 h-8 text-pink-500 mr-3" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Today's Birthdays</h3>
                <p className="text-sm text-gray-500">Celebrate with us!</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{todayBirthdays.length} birthdays today</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Join the celebration</span>
            </div>
          </div>

          {/* Upcoming Birthdays */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Upcoming Birthdays</h3>
                <p className="text-sm text-gray-500">This week</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{upcomingBirthdays.length} birthdays coming up</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Don't miss them</span>
            </div>
          </div>

          {/* Recent Birthdays */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6">
            <div className="flex items-center mb-4">
              <Heart className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Recent Celebrations</h3>
                <p className="text-sm text-gray-500">Past birthdays</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">Celebrated recently</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Memories made</span>
            </div>
          </div>
        </div>

        {birthdays.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No birthdays available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayDashboard;
