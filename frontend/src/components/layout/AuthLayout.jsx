import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 items-center justify-center">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            SkillShare
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Connect with peers to learn and teach skills in a collaborative environment
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
              <span>Find mentors and peers</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-secondary-400 rounded-full"></div>
              <span>Schedule learning sessions</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
              <span>Build your skill network</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="text-2xl font-bold gradient-text">
              SkillShare
            </Link>
          </div>

          {/* Auth form */}
          <div className="card">
            <Outlet />
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="text-primary-400 hover:text-primary-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-400 hover:text-primary-300">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;



