import React, { createContext, useContext, useState, useEffect } from 'react';

const ConnectivityContext = createContext(null);

// Verified official emergency helplines for India / Tamil Nadu
export const ESSENTIAL_EMERGENCY_CONTACTS = [
  { name: 'National Emergency Helpline', number: '112', desc: 'Unified Police, Fire, Ambulance Helpline' },
  { name: 'Medical Ambulance Emergency', number: '108', desc: 'Free 24/7 State Emergency Medical Service' },
  { name: 'Police Control Room', number: '100', desc: 'State Law & Order Emergency Desk' },
  { name: 'Fire & Rescue Service', number: '101', desc: 'Fire Suppression & Disaster Rescue' },
  { name: 'Disaster Helpline (DDMA)', number: '1077', desc: 'District Disaster Management Authority' },
  { name: 'Women Helpline', number: '1091', desc: '24/7 Safety & Immediate Response Desk' },
  { name: 'Child Emergency Helpline', number: '1098', desc: 'National Child Protection & Care Desk' },
  { name: 'VIT Campus Emergency Centre', number: '0416-2202100', desc: 'VIT Health Centre & Campus First Response' }
];

export const ConnectivityProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [cachedResources, setCachedResources] = useState(() => {
    try {
      const saved = localStorage.getItem('emergency_offline_resources_cache');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveToOfflineCache = (resources) => {
    if (Array.isArray(resources) && resources.length > 0) {
      setCachedResources(resources.slice(0, 30));
      try {
        localStorage.setItem(
          'emergency_offline_resources_cache',
          JSON.stringify(resources.slice(0, 30))
        );
      } catch (e) {
        // storage quota
      }
    }
  };

  return (
    <ConnectivityContext.Provider
      value={{
        isOnline,
        cachedResources,
        saveToOfflineCache,
        essentialContacts: ESSENTIAL_EMERGENCY_CONTACTS
      }}
    >
      {children}
    </ConnectivityContext.Provider>
  );
};

export const useConnectivity = () => {
  const context = useContext(ConnectivityContext);
  if (!context) {
    throw new Error('useConnectivity must be used within a ConnectivityProvider');
  }
  return context;
};
