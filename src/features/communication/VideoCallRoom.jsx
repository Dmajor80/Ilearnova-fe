import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Users,
  MessageSquare, Share, Settings, Maximize, Minimize
} from 'lucide-react';
import { getVideoCall, getVideoCallParticipants, startVideoCall, endVideoCall, joinVideoCall, leaveVideoCall, cancelVideoCall } from '@/api';
import Loader from '@/components/Loader';

/**
 * VideoCallRoom component provides a video calling interface with controls
 * Supports multiple participants, chat, screen sharing, and responsive design
 */
const VideoCallRoom = () => {
  const { callId } = useParams();
  const [call, setCall] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    const fetchCallDetails = async () => {
      try {
        const response = await getVideoCall(callId);
        if (response.ok) {
          setCall(response.data);
        }

        // Fetch participants
        const participantsResponse = await getVideoCallParticipants(callId);
        if (participantsResponse.ok) {
          setParticipants(participantsResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch call details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCallDetails();

    // Set up real-time updates for participants
    const interval = setInterval(async () => {
      try {
        const participantsResponse = await getVideoCallParticipants(callId);
        if (participantsResponse.ok) {
          setParticipants(participantsResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch participants:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [callId]);

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    // In real app: update WebRTC audio track
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    // In real app: update WebRTC video track
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const endCall = () => {
    // In real app: cleanup WebRTC connections
    window.location.href = '/video-calls';
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: 'You',
        content: newMessage.trim(),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  if (loading) return <Loader message="Joining call..." />;

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Video className="w-6 h-6 text-white" />
          <div>
            <h1 className="text-white font-semibold">{call?.title || 'Video Call'}</h1>
            <p className="text-gray-300 text-sm">{participants.length} participants</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex">
        {/* Video Grid */}
        <div className={`flex-1 p-4 ${showChat ? 'mr-80' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="bg-slate-800 rounded-lg overflow-hidden relative"
              >
                {participant.isVideoOn ? (
                  <video
                    ref={participant.id === 1 ? localVideoRef : remoteVideoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted={participant.id === 1}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                    <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {participant.name.charAt(0)}
                    </div>
                  </div>
                )}

                {/* Participant Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
                      {participant.name} {participant.isHost && '(Host)'}
                    </span>
                    <div className="flex space-x-1">
                      {participant.isMuted && (
                        <div className="bg-red-500 text-white p-1 rounded">
                          <MicOff className="w-3 h-3" />
                        </div>
                      )}
                      {!participant.isVideoOn && (
                        <div className="bg-gray-500 text-white p-1 rounded">
                          <VideoOff className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold">Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((message) => (
                <div key={message.id} className="text-white">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-teal-400">{message.sender}</span>
                    <span className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{message.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-slate-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-slate-800 p-3 md:p-4">
        <div className="flex items-center justify-center space-x-2 md:space-x-4 flex-wrap gap-2 md:gap-0">
          <button
            onClick={toggleMic}
            className={`p-3 md:p-4 rounded-full transition-colors ${
              isMicOn
                ? 'bg-slate-700 text-white hover:bg-slate-600'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {isMicOn ? <Mic className="w-5 h-5 md:w-6 md:h-6" /> : <MicOff className="w-5 h-5 md:w-6 md:h-6" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 md:p-4 rounded-full transition-colors ${
              isVideoOn
                ? 'bg-slate-700 text-white hover:bg-slate-600'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {isVideoOn ? <Video className="w-5 h-5 md:w-6 md:h-6" /> : <VideoOff className="w-5 h-5 md:w-6 md:h-6" />}
          </button>

          <button className="p-3 md:p-4 bg-slate-700 text-white rounded-full hover:bg-slate-600 transition-colors">
            <Share className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button className="p-3 md:p-4 bg-slate-700 text-white rounded-full hover:bg-slate-600 transition-colors">
            <Users className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={endCall}
            className="p-3 md:p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <PhoneOff className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallRoom;
