import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  MessageCircle, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Zap,
  Globe,
  Shield
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuthStore } from '../stores/auth';

const HomePage = () => {
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: Users,
      title: 'Find Your Perfect Match',
      description: 'Connect with peers who have the skills you want to learn and can teach what you know.'
    },
    {
      icon: Calendar,
      title: 'Schedule Learning Sessions',
      description: 'Book one-on-one or group sessions at times that work for both of you.'
    },
    {
      icon: MessageCircle,
      title: 'Real-time Communication',
      description: 'Chat with your learning partners and get instant feedback on your progress.'
    },
    {
      icon: Star,
      title: 'Build Your Reputation',
      description: 'Earn ratings and reviews as you teach and learn, building trust in the community.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Learners' },
    { number: '500+', label: 'Skills Available' },
    { number: '50K+', label: 'Sessions Completed' },
    { number: '4.8', label: 'Average Rating' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Computer Science Student',
      content: 'SkillShare helped me learn Python from a peer who was also learning React from me. It\'s a win-win!',
      avatar: 'SC'
    },
    {
      name: 'Marcus Johnson',
      role: 'Business Student',
      content: 'I found an amazing mentor for data analysis and was able to teach someone else marketing strategies.',
      avatar: 'MJ'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Design Student',
      content: 'The community is so supportive. I\'ve learned so much and made great friends along the way.',
      avatar: 'ER'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">SkillShare</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link to="/app/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
            Learn Together,<br />
            Grow Together
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with peers to exchange skills, share knowledge, and build meaningful learning relationships in a supportive community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/app/explore">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Skills
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Learning
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-200 mb-4">
              Why Choose SkillShare?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our platform makes skill exchange simple, effective, and enjoyable for everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} hover className="text-center">
                  <div className="w-12 h-12 bg-primary-400/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-200 mb-4">
              What Our Community Says
            </h2>
            <p className="text-lg text-gray-400">
              Real stories from real learners
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} hover>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-400 rounded-full flex items-center justify-center mr-4">
                    <span className="text-sm font-medium text-white">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-200">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300">
                  "{testimonial.content}"
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-200 mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already exchanging skills and building their knowledge network.
          </p>
          {!isAuthenticated && (
            <Link to="/auth/register">
              <Button size="lg">
                Join SkillShare Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold gradient-text">SkillShare</h3>
              </div>
              <p className="text-gray-400">
                Connecting learners worldwide through peer-to-peer skill exchange.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-200 mb-4">Get Started</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/auth/register" className="hover:text-gray-200">Create Account</Link></li>
                <li><Link to="/auth/login" className="hover:text-gray-200">Sign In</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-200 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/support" className="hover:text-gray-200">Help Center</Link></li>
                <li><Link to="/guidelines" className="hover:text-gray-200">Community Guidelines</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-200 mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/terms" className="hover:text-gray-200">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-gray-200">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="hover:text-gray-200">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SkillShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
