import { useState } from 'react';
import { Heart, MessageCircle, Gift, Phone, Video, Star } from 'lucide-react';

function BirthdayCard({ birthday }) {
  const [isWishSent, setIsWishSent] = useState(false);
  const [wishCount, setWishCount] = useState(birthday.wishes);

  const handleSendWish = () => {
    setIsWishSent(true);
    setWishCount(prev => prev + 1);
    // Here you would typically send the wish to the API
    setTimeout(() => setIsWishSent(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100">
      <div className="flex items-start space-x-4">
        {/* Profile Image */}
        <div className="relative">
          <img
            src={birthday.image}
            alt={birthday.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{birthday.name}</h3>
            <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium">
              Age {birthday.age}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-1">{birthday.relationship}</p>
          <p className="text-gray-500 text-sm mb-3">{birthday.class}</p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 mb-3">
            <button
              onClick={handleSendWish}
              disabled={isWishSent}
              className={`
                flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isWishSent
                  ? 'bg-green-100 text-green-800'
                  : 'bg-pink-500 text-white hover:bg-pink-600'
                }
              `}
            >
              <Heart className="w-4 h-4" />
              <span>{isWishSent ? 'Wish Sent!' : 'Send Wish'}</span>
            </button>

            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>

            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Phone className="w-4 h-4" />
            </button>

            <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
              <Video className="w-4 h-4" />
            </button>
          </div>

          {/* Wish Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>{wishCount} wishes</span>
            </div>
            <div className="flex items-center space-x-1">
              <Gift className="w-3 h-3" />
              <span>{birthday.time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-2 right-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
          <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default BirthdayCard;
