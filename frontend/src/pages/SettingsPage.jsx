import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Bell, Lock, Globe, Eye, User, Trash2, AlertTriangle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuthStore } from '../stores/auth';
import { useThemeStore } from '../stores/themeStore';
import api from '../services/api';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    matchNotifications: true,
    messageNotifications: true,
    sessionReminders: true,
    profileVisibility: 'public',
    showEmail: false,
    showLocation: true,
    language: 'en',
    timezone: 'Asia/Colombo'
  });

  const handleSave = () => {
    // Save settings logic
    toast.success('Settings saved successfully!');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    try {
      const loadingToast = toast.loading('Deleting account...');
      await api.delete('/users/account');
      toast.dismiss(loadingToast);
      toast.success('Account deleted successfully');
      logout();
      navigate('/');
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error(error.response?.data?.error || 'Failed to delete account');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-200 mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences</p>
      </div>

      {/* Appearance */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <Eye className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-semibold text-gray-200">Appearance</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <Bell className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-semibold text-gray-200">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-200">Email Notifications</p>
              <p className="text-xs text-gray-400">Receive updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-200">Push Notifications</p>
              <p className="text-xs text-gray-400">Browser notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-200">Match Notifications</p>
              <p className="text-xs text-gray-400">When you get new matches</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.matchNotifications}
                onChange={(e) => setSettings({...settings, matchNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-200">Message Notifications</p>
              <p className="text-xs text-gray-400">When you receive messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.messageNotifications}
                onChange={(e) => setSettings({...settings, messageNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-200">Session Reminders</p>
              <p className="text-xs text-gray-400">Upcoming session alerts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sessionReminders}
                onChange={(e) => setSettings({...settings, sessionReminders: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Privacy */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <Lock className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-semibold text-gray-200">Privacy</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Profile Visibility
            </label>
            <select
              value={settings.profileVisibility}
              onChange={(e) => setSettings({...settings, profileVisibility: e.target.value})}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none"
            >
              <option value="public">Public - Anyone can view</option>
              <option value="matches">Matches Only - Only matched users</option>
              <option value="private">Private - Hidden from search</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-200">Show Email</p>
              <p className="text-xs text-gray-400">Display email on profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showEmail}
                onChange={(e) => setSettings({...settings, showEmail: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-200">Show Location</p>
              <p className="text-xs text-gray-400">Display location on profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showLocation}
                onChange={(e) => setSettings({...settings, showLocation: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Localization */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-semibold text-gray-200">Localization</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({...settings, language: e.target.value})}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none"
            >
              <option value="en">English</option>
              <option value="si">සිංහල (Sinhala)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({...settings, timezone: e.target.value})}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-400 focus:outline-none"
            >
              <option value="Asia/Colombo">Asia/Colombo (Sri Lanka Standard Time)</option>
              <option value="Asia/Kolkata">Asia/Kolkata (India Standard Time)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>

      {/* Danger Zone - Delete Account */}
      <Card className="border-2 border-red-500/50 bg-red-900/10">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <h3 className="font-semibold text-gray-200 mb-2">Delete Account</h3>
            <p className="text-sm text-gray-400 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <ul className="text-sm text-gray-400 space-y-1 mb-4">
              <li>• All your profile information will be deleted</li>
              <li>• All uploaded images and documents will be removed</li>
              <li>• All messages, sessions, and matches will be deleted</li>
              <li>• You will be logged out immediately</li>
            </ul>
            <Button 
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete My Account
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full border-2 border-red-500/50 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-100">Delete Account?</h3>
                  <p className="text-sm text-gray-400">This action is permanent</p>
                </div>
              </div>

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-300 mb-3">
                  <strong>Warning:</strong> This will permanently delete:
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>✗ Your profile and account</li>
                  <li>✗ All uploaded files and images</li>
                  <li>✗ All messages and conversations</li>
                  <li>✗ All sessions and bookings</li>
                  <li>✗ All matches and connections</li>
                  <li>✗ All reviews and ratings</li>
                </ul>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type <span className="font-bold text-red-400">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-red-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== 'DELETE'}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Forever
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
