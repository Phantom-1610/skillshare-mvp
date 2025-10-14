import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Set authentication
      setAuth: (user, token) => {
        // Set axios default header
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });

        console.log('✅ Auth set:', user?.email);
      },

      // Clear authentication
      clearAuth: () => {
        // Remove axios header
        delete api.defaults.headers.common['Authorization'];

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });

        console.log('🔓 Auth cleared');
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true });

        try {
          const response = await api.post('/auth/register', userData);
          const { user, token } = response.data.data;

          get().setAuth(user, token);

          toast.success(`Welcome to SkillShare, ${user.firstName}!`);
          return { success: true, user };
        } catch (error) {
          console.error('Registration error:', error);
          const message = error.response?.data?.error || 'Registration failed';
          toast.error(message);
          set({ isLoading: false });
          return { success: false, error: message };
        }
      },

      // Login
      login: async (credentials) => {
        set({ isLoading: true });

        try {
          const response = await api.post('/auth/login', credentials);
          const { user, token } = response.data.data;

          get().setAuth(user, token);

          toast.success(`Welcome back, ${user.firstName}!`);
          return { success: true, user };
        } catch (error) {
          console.error('Login error:', error);
          const message = error.response?.data?.error || 'Login failed';
          toast.error(message);
          set({ isLoading: false });
          return { success: false, error: message };
        }
      },

      // Logout
      logout: async () => {
        try {
          // Call logout endpoint
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          get().clearAuth();
          toast.success('Logged out successfully');
        }
      },

      // Check authentication on app load
      checkAuth: async () => {
        const { token } = get();

        if (!token) {
          get().clearAuth();
          return;
        }

        // Set token in axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        try {
          const response = await api.get('/auth/me');
          const { user } = response.data.data;

          set({
            user,
            isAuthenticated: true
          });

          console.log('✅ Auth verified:', user.email);
        } catch (error) {
          console.error('Auth check failed:', error);
          get().clearAuth();
        }
      },

      // Initialize auth (call on app start)
      initAuth: () => {
        const { token, user } = get();

        if (token && user) {
          // Set token in axios
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          set({ isAuthenticated: true });
          console.log('🔄 Auth restored from storage:', user.email);
        }
      }
    }),
    {
      name: 'skillshare-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

