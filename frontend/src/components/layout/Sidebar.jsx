import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Users, 
  Calendar, 
  MessageCircle, 
  User, 
  Settings,
  Shield,
  BarChart3,
  UserCheck,
  FileText,
  BookOpen
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth';
import { clsx } from 'clsx';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const userNavItems = [
    { to: '/app/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/app/explore', icon: Search, label: 'Explore' },
    { to: '/app/matches', icon: Users, label: 'Matches' },
    { to: '/app/sessions', icon: Calendar, label: 'Sessions' },
    { to: '/app/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/app/resources', icon: BookOpen, label: 'Resources' },
    { to: '/app/profile', icon: User, label: 'Profile' },
  ];

  const adminNavItems = [
    { to: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/admin/users', icon: UserCheck, label: 'Users' },
    { to: '/admin/sessions', icon: Calendar, label: 'Sessions' },
    { to: '/admin/reviews', icon: FileText, label: 'Reviews' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gray-900 border-r border-gray-700 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold gradient-text">SkillShare</h1>
          </div>
          
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      'nav-link',
                      isActive && 'nav-link-active'
                    )
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
          
          {/* User info */}
          <div className="flex-shrink-0 p-4 border-t border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.firstName?.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-200">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-400">
                  {isAdmin ? 'Administrator' : 'Student'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={clsx(
        'lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-700 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between flex-shrink-0 px-4 py-5">
            <h1 className="text-xl font-bold gradient-text">SkillShare</h1>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx(
                      'nav-link',
                      isActive && 'nav-link-active'
                    )
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
          
          {/* User info */}
          <div className="flex-shrink-0 p-4 border-t border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.firstName?.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-200">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-400">
                  {isAdmin ? 'Administrator' : 'Student'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
