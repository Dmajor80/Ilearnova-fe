import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Trophy, Calendar, AlertTriangle, Save, RotateCcw } from 'lucide-react';

const NotificationSettings = ({ userId }) => {
  const [settings, setSettings] = useState({
    email: {
      enabled: true,
      achievements: true,
      assignments: true,
      messages: true,
      announcements: true,
      reminders: true,
      weeklyDigest: true,
      marketing: false
    },
    push: {
      enabled: true,
      achievements: true,
      assignments: true,
      messages: true,
      announcements: false,
      reminders: true,
      systemAlerts: true
    },
    sms: {
      enabled: false,
      urgentAlerts: true,
      securityAlerts: true
    },
    inApp: {
      enabled: true,
      achievements: true,
      assignments: true,
      messages: true,
      announcements: true,
      systemAlerts: true,
      socialActivity: false
    }
  });

  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState({});

  useEffect(() => {
    // Mock loading of user settings
    setTimeout(() => {
      setOriginalSettings(JSON.parse(JSON.stringify(settings)));
    }, 500);
  }, []);

  useEffect(() => {
    const hasChanged = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(hasChanged);
  }, [settings, originalSettings]);

  const updateSetting = (channel, category, value) => {
    setSettings(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [category]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOriginalSettings(JSON.parse(JSON.stringify(settings)));
    setHasChanges(false);
    setLoading(false);
    // Show success message
  };

  const handleReset = () => {
    setSettings(JSON.parse(JSON.stringify(originalSettings)));
  };

  const NotificationCategory = ({ title, description, icon, channel, category, checked, onChange }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
            checked ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              checked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );

  const ChannelSection = ({ title, icon, channel, data }) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">Configure your {title.toLowerCase()} notification preferences</p>
        </div>
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => updateSetting(channel, 'enabled', !data.enabled)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
              data.enabled ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                data.enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className={`space-y-1 ${!data.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
        {channel === 'email' && (
          <>
            <NotificationCategory
              title="Achievements & Badges"
              description="Get notified when you earn new achievements or badges"
              icon={<Trophy className="w-5 h-5 text-yellow-500" />}
              channel={channel}
              category="achievements"
              checked={data.achievements}
              onChange={(value) => updateSetting(channel, 'achievements', value)}
            />
            <NotificationCategory
              title="Assignments & Deadlines"
              description="Reminders for upcoming assignments and due dates"
              icon={<Calendar className="w-5 h-5 text-blue-500" />}
              channel={channel}
              category="assignments"
              checked={data.assignments}
              onChange={(value) => updateSetting(channel, 'assignments', value)}
            />
            <NotificationCategory
              title="Messages"
              description="New messages from teachers, parents, or other students"
              icon={<MessageSquare className="w-5 h-5 text-green-500" />}
              channel={channel}
              category="messages"
              checked={data.messages}
              onChange={(value) => updateSetting(channel, 'messages', value)}
            />
            <NotificationCategory
              title="Announcements"
              description="Important announcements from teachers and administrators"
              icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
              channel={channel}
              category="announcements"
              checked={data.announcements}
              onChange={(value) => updateSetting(channel, 'announcements', value)}
            />
            <NotificationCategory
              title="Reminders"
              description="Class reminders and schedule notifications"
              icon={<Bell className="w-5 h-5 text-purple-500" />}
              channel={channel}
              category="reminders"
              checked={data.reminders}
              onChange={(value) => updateSetting(channel, 'reminders', value)}
            />
            <NotificationCategory
              title="Weekly Digest"
              description="Weekly summary of your learning progress and activities"
              icon={<Mail className="w-5 h-5 text-indigo-500" />}
              channel={channel}
              category="weeklyDigest"
              checked={data.weeklyDigest}
              onChange={(value) => updateSetting(channel, 'weeklyDigest', value)}
            />
            <NotificationCategory
              title="Marketing & Updates"
              description="Product updates, tips, and promotional content"
              icon={<Mail className="w-5 h-5 text-gray-500" />}
              channel={channel}
              category="marketing"
              checked={data.marketing}
              onChange={(value) => updateSetting(channel, 'marketing', value)}
            />
          </>
        )}

        {channel === 'push' && (
          <>
            <NotificationCategory
              title="Achievements & Badges"
              description="Instant notifications for new achievements"
              icon={<Trophy className="w-5 h-5 text-yellow-500" />}
              channel={channel}
              category="achievements"
              checked={data.achievements}
              onChange={(value) => updateSetting(channel, 'achievements', value)}
            />
            <NotificationCategory
              title="Assignments & Deadlines"
              description="Urgent assignment reminders"
              icon={<Calendar className="w-5 h-5 text-blue-500" />}
              channel={channel}
              category="assignments"
              checked={data.assignments}
              onChange={(value) => updateSetting(channel, 'assignments', value)}
            />
            <NotificationCategory
              title="Messages"
              description="Real-time message notifications"
              icon={<MessageSquare className="w-5 h-5 text-green-500" />}
              channel={channel}
              category="messages"
              checked={data.messages}
              onChange={(value) => updateSetting(channel, 'messages', value)}
            />
            <NotificationCategory
              title="Announcements"
              description="Important announcements"
              icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
              channel={channel}
              category="announcements"
              checked={data.announcements}
              onChange={(value) => updateSetting(channel, 'announcements', value)}
            />
            <NotificationCategory
              title="Reminders"
              description="Schedule and class reminders"
              icon={<Bell className="w-5 h-5 text-purple-500" />}
              channel={channel}
              category="reminders"
              checked={data.reminders}
              onChange={(value) => updateSetting(channel, 'reminders', value)}
            />
            <NotificationCategory
              title="System Alerts"
              description="Important system notifications and maintenance alerts"
              icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
              channel={channel}
              category="systemAlerts"
              checked={data.systemAlerts}
              onChange={(value) => updateSetting(channel, 'systemAlerts', value)}
            />
          </>
        )}

        {channel === 'sms' && (
          <>
            <NotificationCategory
              title="Urgent Alerts"
              description="Critical alerts that require immediate attention"
              icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
              channel={channel}
              category="urgentAlerts"
              checked={data.urgentAlerts}
              onChange={(value) => updateSetting(channel, 'urgentAlerts', value)}
            />
            <NotificationCategory
              title="Security Alerts"
              description="Account security and login notifications"
              icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
              channel={channel}
              category="securityAlerts"
              checked={data.securityAlerts}
              onChange={(value) => updateSetting(channel, 'securityAlerts', value)}
            />
          </>
        )}

        {channel === 'inApp' && (
          <>
            <NotificationCategory
              title="Achievements & Badges"
              description="In-app achievement notifications"
              icon={<Trophy className="w-5 h-5 text-yellow-500" />}
              channel={channel}
              category="achievements"
              checked={data.achievements}
              onChange={(value) => updateSetting(channel, 'achievements', value)}
            />
            <NotificationCategory
              title="Assignments & Deadlines"
              description="Assignment notifications within the app"
              icon={<Calendar className="w-5 h-5 text-blue-500" />}
              channel={channel}
              category="assignments"
              checked={data.assignments}
              onChange={(value) => updateSetting(channel, 'assignments', value)}
            />
            <NotificationCategory
              title="Messages"
              description="New message notifications"
              icon={<MessageSquare className="w-5 h-5 text-green-500" />}
              channel={channel}
              category="messages"
              checked={data.messages}
              onChange={(value) => updateSetting(channel, 'messages', value)}
            />
            <NotificationCategory
              title="Announcements"
              description="In-app announcements"
              icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
              channel={channel}
              category="announcements"
              checked={data.announcements}
              onChange={(value) => updateSetting(channel, 'announcements', value)}
            />
            <NotificationCategory
              title="System Alerts"
              description="System notifications and updates"
              icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
              channel={channel}
              category="systemAlerts"
              checked={data.systemAlerts}
              onChange={(value) => updateSetting(channel, 'systemAlerts', value)}
            />
            <NotificationCategory
              title="Social Activity"
              description="Likes, comments, and social interactions"
              icon={<MessageSquare className="w-5 h-5 text-pink-500" />}
              channel={channel}
              category="socialActivity"
              checked={data.socialActivity}
              onChange={(value) => updateSetting(channel, 'socialActivity', value)}
            />
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
          <p className="text-gray-600 mt-1">Customize how and when you receive notifications</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const newSettings = JSON.parse(JSON.stringify(settings));
              Object.keys(newSettings).forEach(channel => {
                Object.keys(newSettings[channel]).forEach(category => {
                  newSettings[channel][category] = true;
                });
              });
              setSettings(newSettings);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Enable All
          </button>
          <button
            onClick={() => {
              const newSettings = JSON.parse(JSON.stringify(settings));
              Object.keys(newSettings).forEach(channel => {
                Object.keys(newSettings[channel]).forEach(category => {
                  newSettings[channel][category] = false;
                });
              });
              setSettings(newSettings);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Disable All
          </button>
          <button
            onClick={() => {
              const newSettings = JSON.parse(JSON.stringify(settings));
              // Set reasonable defaults
              newSettings.email = { enabled: true, achievements: true, assignments: true, messages: true, announcements: true, reminders: true, weeklyDigest: true, marketing: false };
              newSettings.push = { enabled: true, achievements: true, assignments: true, messages: true, announcements: false, reminders: true, systemAlerts: true };
              newSettings.sms = { enabled: false, urgentAlerts: true, securityAlerts: true };
              newSettings.inApp = { enabled: true, achievements: true, assignments: true, messages: true, announcements: true, systemAlerts: true, socialActivity: false };
              setSettings(newSettings);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Channel Settings */}
      <ChannelSection
        title="Email Notifications"
        icon={<Mail className="w-6 h-6 text-blue-600" />}
        channel="email"
        data={settings.email}
      />

      <ChannelSection
        title="Push Notifications"
        icon={<Bell className="w-6 h-6 text-green-600" />}
        channel="push"
        data={settings.push}
      />

      <ChannelSection
        title="SMS Notifications"
        icon={<MessageSquare className="w-6 h-6 text-purple-600" />}
        channel="sms"
        data={settings.sms}
      />

      <ChannelSection
        title="In-App Notifications"
        icon={<Bell className="w-6 h-6 text-orange-600" />}
        channel="inApp"
        data={settings.inApp}
      />

      {/* Save Actions */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-center space-x-3">
          <div className="text-sm text-gray-600">
            You have unsaved changes
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleReset}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Notification Frequency */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Frequency</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Digest Frequency</label>
            <select className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="never">Never</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quiet Hours</label>
            <div className="flex space-x-2">
              <input
                type="time"
                defaultValue="22:00"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="flex items-center text-gray-500">to</span>
              <input
                type="time"
                defaultValue="08:00"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
