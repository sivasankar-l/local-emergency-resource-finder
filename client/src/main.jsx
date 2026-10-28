import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { LanguageProvider } from './context/LanguageContext';
import { LocationProvider } from './context/LocationContext';
import { AuthProvider } from './context/AuthContext';
import { ConnectivityProvider } from './context/ConnectivityContext';

// Register Service Worker for offline emergency resource caching using dynamic base URL
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const swPath = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker
      .register(swPath)
      .then((reg) => {
        console.log('[PWA] Service Worker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LanguageProvider>
        <LocationProvider>
          <AuthProvider>
            <ConnectivityProvider>
              <App />
            </ConnectivityProvider>
          </AuthProvider>
        </LocationProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
