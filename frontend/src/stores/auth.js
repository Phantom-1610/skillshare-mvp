import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, token) => {
        if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ user, token, isAuthenticated: true, isLoading: false });
      },

      updateUser: (userData) => {
        set({ user: userData });
      },

      clearAuth: () => {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('auth-storage');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/register', userData);
          const { user, token } = res.data.data;
          get().setAuth(user, token);
          toast.success(`Welcome, ${user.firstName}!`);
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.error || 'Registration failed';
          toast.error(msg);
          set({ isLoading: false });
          return { success: false, error: msg };
        }
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/login', credentials);
          const { user, token } = res.data.data;
          get().setAuth(user, token);
          toast.success(`Welcome back, ${user.firstName}!`);
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.error || 'Login failed';
          toast.error(msg);
          set({ isLoading: false });
          return { success: false, error: msg };
        }
      },

      logout: () => {
        get().clearAuth();
        toast.success('Logged out');
      },

      initAuth: () => {
        const { token, user } = get();
        if (token && user) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          set({ isAuthenticated: true });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated })
    }
  )
);

