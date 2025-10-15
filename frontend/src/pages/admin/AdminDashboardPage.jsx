import { useState } from 'react';
import { Users, Calendar, MessageSquare, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const AdminDashboardPage = () => {
  const stats = {
    totalUsers: 156,
    activeUsers: 89,
    totalSessions: 342,
    completedSessions: 298,
    pendingReviews: 12,
    reportedIssues: 3
  };

  const recentActivity = [
    { id: 1, type: 'user_joined', user: 'Alice Johnson', time: '5 minutes ago' },
    { id: 2, type: 'session_completed', session: 'React Advanced Patterns', time: '15 minutes ago' },
    { id: 3, type: 'review_submitted', user: 'Bob Smith', time: '1 hour ago' },
    { id: 4, type: 'issue_reported', issue: 'Video quality problem', time: '2 hours ago' }
  ];

  const topTeachers = [
    { id: 1, name: 'John Doe', sessions: 45, rating: 4.9 },
    { id: 2, name: 'Jane Smith', sessions: 38, rating: 4.8 },
    { id: 3, name: 'Mike Johnson', sessions: 32, rating: 4.7 }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-200 mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Users</p>
              <p className="text-3xl font-bold text-gray-200 mt-2">{stats.totalUsers}</p>
              <p className="text-sm text-green-400 mt-1">↑ 12% from last month</p>
            </div>
            <div className="p-3 bg-primary-400/20 rounded-lg">
              <Users className="w-8 h-8 text-primary-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active Users</p>
              <p className="text-3xl font-bold text-gray-200 mt-2">{stats.activeUsers}</p>
              <p className="text-sm text-green-400 mt-1">↑ 8% from last month</p>
            </div>
            <div className="p-3 bg-secondary-400/20 rounded-lg">
              <TrendingUp className="w-8 h-8 text-secondary-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Sessions</p>
              <p className="text-3xl font-bold text-gray-200 mt-2">{stats.totalSessions}</p>
              <p className="text-sm text-green-400 mt-1">↑ 15% from last month</p>
            </div>
            <div className="p-3 bg-accent-400/20 rounded-lg">
              <Calendar className="w-8 h-8 text-accent-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Completed Sessions</p>
              <p className="text-3xl font-bold text-gray-200 mt-2">{stats.completedSessions}</p>
              <p className="text-sm text-gray-400 mt-1">87% completion rate</p>
            </div>
            <div className="p-3 bg-green-400/20 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Pending Reviews</p>
              <p className="text-3xl font-bold text-gray-200 mt-2">{stats.pendingReviews}</p>
              <p className="text-sm text-yellow-400 mt-1">Needs attention</p>
            </div>
            <div className="p-3 bg-yellow-400/20 rounded-lg">
              <MessageSquare className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Reported Issues</p>
              <p className="text-3xl font-bold text-gray-200 mt-2">{stats.reportedIssues}</p>
              <p className="text-sm text-red-400 mt-1">Requires action</p>
            </div>
            <div className="p-3 bg-red-400/20 rounded-lg">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    {activity.type === 'user_joined' && `${activity.user} joined the platform`}
                    {activity.type === 'session_completed' && `Session "${activity.session}" completed`}
                    {activity.type === 'review_submitted' && `${activity.user} submitted a review`}
                    {activity.type === 'issue_reported' && `Issue reported: ${activity.issue}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
                <Badge variant={
                  activity.type === 'user_joined' ? 'success' :
                  activity.type === 'session_completed' ? 'primary' :
                  activity.type === 'review_submitted' ? 'warning' :
                  'error'
                }>
                  {activity.type.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Teachers */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Top Teachers</h3>
          <div className="space-y-4">
            {topTeachers.map((teacher, index) => (
              <div key={teacher.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{teacher.name}</p>
                    <p className="text-xs text-gray-400">{teacher.sessions} sessions</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-medium text-gray-200">{teacher.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;



