import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark', // 'light' | 'dark' | 'system'
      systemTheme: 'dark',

      // Actions
      setTheme: (theme) => {
        set({ theme });
        get().applyTheme(theme);
      },

      setSystemTheme: (systemTheme) => {
        set({ systemTheme });
        
        // If current theme is 'system', apply the new system theme
        if (get().theme === 'system') {
          get().applyTheme('system');
        }
      },

      initTheme: () => {
        // Detect system theme
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        set({ systemTheme });

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
          get().setSystemTheme(e.matches ? 'dark' : 'light');
        };
        
        mediaQuery.addEventListener('change', handleChange);

        // Apply initial theme
        get().applyTheme(get().theme);
      },

      applyTheme: (theme) => {
        const { systemTheme } = get();
        const actualTheme = theme === 'system' ? systemTheme : theme;
        
        const root = document.documentElement;
        
        if (actualTheme === 'dark') {
          root.setAttribute('data-theme', 'dark');
          root.classList.add('dark');
        } else {
          root.setAttribute('data-theme', 'light');
          root.classList.remove('dark');
        }
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },

      // Getters
      getActualTheme: () => {
        const { theme, systemTheme } = get();
        return theme === 'system' ? systemTheme : theme;
      },

      isDark: () => {
        return get().getActualTheme() === 'dark';
      },

      isLight: () => {
        return get().getActualTheme() === 'light';
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);
