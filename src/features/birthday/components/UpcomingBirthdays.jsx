import { useState } from 'react';
import { Calendar, Clock, Gift, Bell } from 'lucide-react';

function UpcomingBirthdays({ birthdays }) {
  const [reminders, setReminders] = useState({});

  const toggleReminder = (birthdayId) => {
    setReminders(prev => ({
      ...prev,
      [birthdayId]: !prev[birthdayId]
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Upcoming Birthdays
        </h3>
        <button className="text-[#1736a4] hover:text-blue-700 text-sm font-medium">
          View Calendar
        </button>
      </div>

      <div className="space-y-4">
        {birthdays.map((birthday) => (
          <div key={birthday.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-4">
              <img
                src={birthday.image}
                alt={birthday.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div>
                <h4 className="font-semibold text-gray-800">{birthday.name}</h4>
                <p className="text-sm text-gray-600">{birthday.class} • Age {birthday.age}</p>
                <p className="text-xs text-gray-500">{birthday.relationship}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Clock className="w-4 h-4 mr-1" />
                <span>{birthday.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${birthday.daysUntil <= 3
                    ? 'bg-red-100 text-red-800'
                    : birthday.daysUntil <= 7
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-green-100 text-green-800'
                  }
                `}>
                  {birthday.daysUntil} days
                </span>
                <button
                  onClick={() => toggleReminder(birthday.id)}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${reminders[birthday.id]
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                    }
                  `}
                >
                  <Bell className="w-4 h-4" />
                </button>
                <button className="p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                  <Gift className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Birthday Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors font-medium flex items-center justify-center">
          <Gift className="w-5 h-5 mr-2" />
          Add New Birthday
        </button>
      </div>
    </div>
  );
}

export default UpcomingBirthdays;
