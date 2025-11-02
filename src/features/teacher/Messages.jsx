import React, { useState } from "react";
import CoursesComponent from "./components/CourseComponents";
import { Search, Send, Paperclip, Smile, MoreVertical, Phone, Video, User, Clock, Check, CheckCheck } from "lucide-react";

const Messages = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "John Doe",
      role: "Student",
      class: "Grade 8A",
      lastMessage: "Thank you for the feedback on my assignment",
      timestamp: "2 min ago",
      unread: 2,
      online: true,
      avatar: "JD"
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Parent",
      class: "Grade 7B",
      lastMessage: "Regarding the parent-teacher meeting",
      timestamp: "1 hour ago",
      unread: 0,
      online: false,
      avatar: "JS"
    },
    {
      id: 3,
      name: "Alice Johnson",
      role: "Student",
      class: "Grade 9B",
      lastMessage: "Can I get an extension for the project?",
      timestamp: "3 hours ago",
      unread: 1,
      online: true,
      avatar: "AJ"
    },
    {
      id: 4,
      name: "Bob Lee",
      role: "Parent",
      class: "Grade 6A",
      lastMessage: "Thank you for your concern about my child",
      timestamp: "Yesterday",
      unread: 0,
      online: false,
      avatar: "BL"
    },
    {
      id: 5,
      name: "Mathematics Department",
      role: "Group",
      class: "All Grades",
      lastMessage: "New curriculum updates available",
      timestamp: "2 days ago",
      unread: 5,
      online: true,
      avatar: "MD"
    }
  ];

  const messages = {
    1: [
      {
        id: 1,
        sender: "John Doe",
        content: "Hi Mr. Johnson, I wanted to thank you for the detailed feedback on my mathematics assignment. It really helped me understand where I went wrong.",
        timestamp: "10:30 AM",
        isMe: false,
        read: true
      },
      {
        id: 2,
        sender: "Me",
        content: "You're welcome, John! I'm glad the feedback was helpful. Keep up the good work on your algebra practice.",
        timestamp: "10:32 AM",
        isMe: true,
        read: true
      },
      {
        id: 3,
        sender: "John Doe",
        content: "I'll make sure to review the quadratic equations more carefully next time. Do you have any additional resources I can use?",
        timestamp: "10:35 AM",
        isMe: false,
        read: false
      },
      {
        id: 4,
        sender: "John Doe",
        content: "Also, when is the next test scheduled?",
        timestamp: "10:36 AM",
        isMe: false,
        read: false
      }
    ],
    2: [
      {
        id: 1,
        sender: "Jane Smith",
        content: "Hello, I wanted to discuss the upcoming parent-teacher meeting. Is there a specific time that works better for you?",
        timestamp: "9:15 AM",
        isMe: false,
        read: true
      }
    ]
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const currentMessages = messages[selectedConversation] || [];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <>
      <CoursesComponent page="Messages" />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
              <div className="flex items-center space-x-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
                  <Send className="w-5 h-5" />
                  <span>New Message</span>
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1">
              {["inbox", "sent", "drafts", "archived"].map((tab) => (
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Search */}
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Conversations */}
                <div className="max-h-96 overflow-y-auto">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation === conversation.id ? "bg-blue-50 border-r-4 border-r-blue-500" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">{conversation.avatar}</span>
                          </div>
                          {conversation.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate">{conversation.name}</h3>
                            <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{conversation.role} • {conversation.class}</p>
                          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        </div>

                        {conversation.unread > 0 && (
                          <div className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unread}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden h-96 flex flex-col">
                {/* Chat Header */}
                {selectedConv && (
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">{selectedConv.avatar}</span>
                          </div>
                          {selectedConv.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{selectedConv.name}</h3>
                          <p className="text-xs text-gray-600">{selectedConv.role} • {selectedConv.class}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Video className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isMe
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center justify-end mt-1 space-x-1 ${
                          message.isMe ? "text-blue-200" : "text-gray-500"
                        }`}>
                          <span className="text-xs">{message.timestamp}</span>
                          {message.isMe && (
                            message.read ? (
                              <CheckCheck className="w-3 h-3" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>

                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                      />
                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>

                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {conversations.filter(c => c.unread > 0).length}
                </div>
                <div className="text-sm text-gray-600">Unread Messages</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {conversations.filter(c => c.online).length}
                </div>
                <div className="text-sm text-gray-600">Online Contacts</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {conversations.length}
                </div>
                <div className="text-sm text-gray-600">Total Conversations</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {conversations.reduce((sum, c) => sum + c.unread, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Unread</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
