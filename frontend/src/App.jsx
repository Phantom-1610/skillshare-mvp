import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/auth';
import { useThemeStore } from './stores/themeStore';
import { useEffect } from 'react';

// Layout Components
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';

// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import MatchesPage from './pages/MatchesPage';
import SessionsPage from './pages/SessionsPage';
import ChatPage from './pages/ChatPage';
import VideoSessionPage from './pages/VideoSessionPage';
import ResourcesPage from './pages/ResourcesPage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Legal Pages
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsOfServicePage from './pages/legal/TermsOfServicePage';
import CommunityGuidelinesPage from './pages/legal/CommunityGuidelinesPage';
import CookiesPolicyPage from './pages/legal/CookiesPolicyPage';
import SupportPage from './pages/legal/SupportPage';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// PWA Components
import PWAInstallPrompt from './components/pwa/PWAInstallPrompt';
import OfflineIndicator from './components/pwa/OfflineIndicator';

function App() {
  const { user, initAuth } = useAuthStore();
  const { theme, initTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme
    initTheme();
    
    // Initialize authentication from localStorage
    initAuth();
  }, [initTheme, initAuth]);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100">
      <PWAInstallPrompt />
      <OfflineIndicator />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        
        {/* Protected Routes */}
        <Route path="/app" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="matches" element={<MatchesPage />} />
          <Route path="sessions" element={<SessionsPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:userId" element={<ChatPage />} />
          <Route path="video/:sessionId" element={<VideoSessionPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/:userId" element={<ProfilePage />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <Layout />
          </AdminRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
        </Route>
        
        {/* Legal Routes - Public Access */}
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/guidelines" element={<CommunityGuidelinesPage />} />
        <Route path="/cookies" element={<CookiesPolicyPage />} />
        <Route path="/support" element={<SupportPage />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
