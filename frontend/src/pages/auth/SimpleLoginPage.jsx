import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuthStore } from '../../stores/auth';

const SimpleLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simple demo login - accept any email/password
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: email || 'john@example.com',
        role: 'user',
        isActive: true,
        isVerified: true,
        bio: 'Software developer with 5+ years of experience',
        location: 'New York, NY',
        offeredSkills: [
          { skill: 'JavaScript', level: 'advanced', description: '5+ years experience' },
          { skill: 'React', level: 'intermediate', description: '3+ years experience' }
        ],
        desiredSkills: [
          { skill: 'Python', level: 'beginner', priority: 'high' },
          { skill: 'Machine Learning', level: 'intermediate', priority: 'medium' }
        ],
        stats: {
          sessionsTaught: 10,
          sessionsAttended: 5,
          averageRating: 4.8,
          totalRatings: 15
        }
      };

      const mockToken = 'demo-jwt-token-' + Date.now();
      
      setAuth(mockUser, mockToken);
      navigate('/app/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('john@example.com');
    setPassword('password123');
    handleLogin(new Event('submit'));
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-200 mb-2">
          Welcome back
        </h2>
        <p className="text-gray-400">
          Sign in to your SkillShare account
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:border-primary-400 focus:outline-none"
            required
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:border-primary-400 focus:outline-none pr-10"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-600 bg-gray-700 text-primary-400 focus:ring-primary-400 focus:ring-offset-0"
            />
            <span className="ml-2 text-sm text-gray-400">Remember me</span>
          </label>
          
          <Link
            to="/auth/forgot-password"
            className="text-sm text-primary-400 hover:text-primary-300"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{' '}
          <Link
            to="/auth/register"
            className="text-primary-400 hover:text-primary-300 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700">
        <Button
          onClick={handleDemoLogin}
          variant="outline"
          className="w-full"
        >
          🚀 Quick Demo Login
        </Button>
        <p className="text-xs text-gray-500 text-center mt-2">
          Use this for instant access to the demo
        </p>
      </div>
    </div>
  );
};

export default SimpleLoginPage;
