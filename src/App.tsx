import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { NotificationProvider } from './components/notifications/NotificationProvider';
import { ErrorBoundaryProvider } from './components/ErrorBoundary';
import AppLayout from './components/layout/AppLayout';
import { useSettingsStore } from './stores/settingsStore';

function App() {
  const { settings } = useSettingsStore();

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', settings.colors.primary);
    document.documentElement.style.setProperty('--color-secondary', settings.colors.secondary);
    document.title = settings.name;
    
    // Update favicon
    const favicon = document.querySelector("link[rel*='icon']");
    if (favicon) {
      favicon.setAttribute('href', settings.favicon);
    } else {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.type = 'image/jpeg';
      newFavicon.href = settings.favicon;
      document.head.appendChild(newFavicon);
    }
  }, [settings]);

  return (
    <ErrorBoundaryProvider>
      <Router>
        <NotificationProvider>
          <AppLayout />
        </NotificationProvider>
      </Router>
    </ErrorBoundaryProvider>
  );
}

export default App;