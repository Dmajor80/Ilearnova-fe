import React from 'react';
import { Mic, MicOff, Video, VideoOff, Hand, MoreVertical, Crown } from 'lucide-react';

const ParticipantControls = ({ participant, isLocalUser = false, onToggleMic, onToggleVideo, onRaiseHand }) => {
  const handleMicToggle = () => {
    if (onToggleMic) onToggleMic(participant.id);
  };

  const handleVideoToggle = () => {
    if (onToggleVideo) onToggleVideo(participant.id);
  };

  const handleRaiseHand = () => {
    if (onRaiseHand) onRaiseHand(participant.id);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Host Indicator */}
      {participant.isHost && (
        <div className="flex items-center text-yellow-500" title="Host">
          <Crown className="w-4 h-4" />
        </div>
      )}

      {/* Hand Raised Indicator */}
      {participant.isHandRaised && (
        <div className="flex items-center text-orange-500" title="Hand Raised">
          <Hand className="w-4 h-4" />
        </div>
      )}

      {/* Audio Control */}
      {isLocalUser && (
        <button
          onClick={handleMicToggle}
          className={`p-2 rounded-full transition-colors ${
            participant.isMuted
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-slate-700 text-white hover:bg-slate-600'
          }`}
          title={participant.isMuted ? 'Unmute' : 'Mute'}
        >
          {participant.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      )}

      {/* Video Control */}
      {isLocalUser && (
        <button
          onClick={handleVideoToggle}
          className={`p-2 rounded-full transition-colors ${
            !participant.isVideoOn
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-slate-700 text-white hover:bg-slate-600'
          }`}
          title={participant.isVideoOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {participant.isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        </button>
      )}

      {/* Raise Hand */}
      {isLocalUser && (
        <button
          onClick={handleRaiseHand}
          className={`p-2 rounded-full transition-colors ${
            participant.isHandRaised
              ? 'bg-orange-500 text-white hover:bg-orange-600'
              : 'bg-slate-700 text-white hover:bg-slate-600'
          }`}
          title="Raise hand"
        >
          <Hand className="w-4 h-4" />
        </button>
      )}

      {/* More Options */}
      <div className="relative">
        <button
          className="p-2 bg-slate-700 text-white rounded-full hover:bg-slate-600 transition-colors"
          title="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        {/* Dropdown menu would go here */}
      </div>
    </div>
  );
};

export default ParticipantControls;
