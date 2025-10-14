import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  LogOut, 
  Settings,
  User
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth';
import api from '../../services/api';
import { socketService } from '../../services/socketService';

const Header = ({ onMenuClick, user }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { logout } = useAuthStore();

  useEffect(() => {
    fetchNotifications();
    
    // Listen for real-time notifications
    if (user?.id) {
      socketService.connect(user.id);
      
      socketService.on('new-notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        // Browser notification
        if (Notification.permission === 'granted') {
          new Notification('SkillShare', {
            body: notification.message,
            icon: '/logo.png'
          });
        }
      });
    }
    
    return () => {
      socketService.off('new-notification');
    };
  }, [user?.id]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data?.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800 relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-strong z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-800">
                  <h3 className="text-sm font-medium text-gray-200">Notifications</h3>
                </div>
                <div className="divide-y divide-gray-700">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div 
                        key={notif._id || notif.id} 
                        className={`p-4 hover:bg-gray-750 cursor-pointer transition-colors ${
                          notif.read ? 'opacity-60' : ''
                        }`}
                        onClick={async () => {
                          if (!notif.read && (notif._id || notif.id)) {
                            try {
                              await api.put(`/notifications/${notif._id || notif.id}/read`);
                              setNotifications(prev => 
                                prev.map(n => 
                                  (n._id || n.id) === (notif._id || notif.id) 
                                    ? { ...n, read: true } 
                                    : n
                                )
                              );
                            } catch (error) {
                              console.error('Failed to mark as read:', error);
                            }
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-gray-200">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notif.createdAt).toLocaleString('en-LK', { 
                                timeZone: 'Asia/Colombo',
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              })}
                            </p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-primary-400 rounded-full ml-2 mt-1"></div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4">
                      <p className="text-sm text-gray-400 text-center">No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            >
              <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.firstName?.charAt(0)}
                </span>
              </div>
              <span className="hidden md:block text-sm font-medium">
                {user?.firstName}
              </span>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-strong z-50">
                <div className="py-1">
                  <Link
                    to="/app/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/app/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                  <hr className="my-1 border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
