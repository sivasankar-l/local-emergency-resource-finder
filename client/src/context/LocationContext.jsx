import React, { createContext, useContext, useState, useEffect } from 'react';
import { geocodeAddress } from '../services/resourceService';

const LocationContext = createContext(null);

// Default center: Vellore Institute of Technology (Katpadi, Vellore)
const DEFAULT_COORDS = {
  latitude: 12.9698,
  longitude: 79.1559,
  displayName: 'Vellore Institute of Technology (VIT), Katpadi',
  source: 'default'
};

export const LocationProvider = ({ children }) => {
  const [coords, setCoords] = useState(() => {
    const saved = localStorage.getItem('emergency_user_coords');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_COORDS;
      }
    }
    return DEFAULT_COORDS;
  });

  const [radius, setRadius] = useState(25); // km
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt'); // prompt, granted, denied

  useEffect(() => {
    if (coords) {
      localStorage.setItem('emergency_user_coords', JSON.stringify(coords));
    }
  }, [coords]);

  const detectLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by your current browser. Please enter your location manually.');
      setIsLocating(false);
      setPermissionStatus('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          latitude: Number(position.coords.latitude.toFixed(5)),
          longitude: Number(position.coords.longitude.toFixed(5)),
          displayName: 'Current GPS Location',
          source: 'gps'
        };
        setCoords(userLocation);
        setIsLocating(false);
        setPermissionStatus('granted');
        setLocationError(null);
      },
      (error) => {
        setIsLocating(false);
        setPermissionStatus('denied');
        let errMsg = 'Unable to retrieve location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errMsg = 'Location permission denied. Please enter your location or landmark manually below.';
            break;
          case error.POSITION_UNAVAILABLE:
            errMsg = 'Location information is unavailable. Falling back to manual entry.';
            break;
          case error.TIMEOUT:
            errMsg = 'Location request timed out. Please try again or search manually.';
            break;
          default:
            errMsg = error.message;
        }
        setLocationError(errMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    );
  };

  const searchManualLocation = async (queryText) => {
    if (!queryText || !queryText.trim()) return false;
    setIsLocating(true);
    setLocationError(null);

    try {
      const res = await geocodeAddress(queryText);
      if (res && res.data) {
        const manualCoords = {
          latitude: res.data.latitude,
          longitude: res.data.longitude,
          displayName: res.data.displayName,
          source: 'geocoded'
        };
        setCoords(manualCoords);
        setIsLocating(false);
        return true;
      }
      throw new Error('Could not find coordinates for this area');
    } catch (err) {
      setIsLocating(false);
      setLocationError(`Could not find "${queryText}". Try a broader city or landmark name (e.g. Katpadi, Vellore, CMC).`);
      return false;
    }
  };

  const resetToDefault = () => {
    setCoords(DEFAULT_COORDS);
    setLocationError(null);
  };

  return (
    <LocationContext.Provider
      value={{
        coords,
        setCoords,
        radius,
        setRadius,
        isLocating,
        locationError,
        permissionStatus,
        detectLocation,
        searchManualLocation,
        resetToDefault,
        defaultCoords: DEFAULT_COORDS
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};
