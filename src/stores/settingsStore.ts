import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings } from '../types/settings';

interface SettingsState {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  id: '1',
  name: 'Red de Innovación FP',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Logotipo_del_Gobierno_de_Canarias.svg/1200px-Logotipo_del_Gobierno_de_Canarias.svg.png',
  favicon: 'https://pbs.twimg.com/profile_images/1634182493648691204/sY2uIjHE_400x400.jpg',
  colors: {
    primary: '#2563eb',
    secondary: '#1e40af',
    navbar: {
      from: '#1e3a8a',
      to: '#1e40af',
    },
    sidebar: '#ebf5ff',
  },
  updatedAt: new Date().toISOString(),
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
            updatedAt: new Date().toISOString(),
          },
        })),
    }),
    {
      name: 'settings-storage',
    }
  )
);