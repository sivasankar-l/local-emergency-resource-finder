import React, { useState } from 'react';
import {
  MapPin,
  Crosshair,
  Search,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';

export const LocationSearch = ({ onSearchComplete }) => {
  const {
    coords,
    radius,
    setRadius,
    isLocating,
    locationError,
    permissionStatus,
    detectLocation,
    searchManualLocation
  } = useLocationContext();

  const { t } = useLanguage();
  const [manualQuery, setManualQuery] = useState('');
  const [showRadiusMenu, setShowRadiusMenu] = useState(false);

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualQuery.trim()) return;
    const ok = await searchManualLocation(manualQuery);
    if (ok && onSearchComplete) {
      onSearchComplete();
    }
  };

  const handleGpsClick = () => {
    detectLocation();
  };

  const radiusOptions = [5, 10, 25, 50, 100];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Bar: GPS detect & Current location status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emergency-50 border border-emergency-100 flex items-center justify-center text-emergency-600">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">Current Search Center:</span>
              <span className="text-xs font-semibold text-emergency-700 bg-emergency-50 px-2 py-0.5 rounded">
                {coords?.displayName || 'VIT Katpadi, Vellore'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Coordinates: {coords?.latitude?.toFixed(4)}, {coords?.longitude?.toFixed(4)}
            </p>
          </div>
        </div>

        {/* GPS Button */}
        <button
          type="button"
          onClick={handleGpsClick}
          disabled={isLocating}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emergency-600 hover:bg-emergency-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95 disabled:opacity-60"
        >
          <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? t('location_detecting') : t('btn_find_near_me')}</span>
        </button>
      </div>

      {/* Permission or Error notice */}
      {locationError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-emergency-600 shrink-0 mt-0.5" />
          <span>{locationError}</span>
        </div>
      )}

      {permissionStatus === 'granted' && !locationError && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t('location_success')} (High Accuracy GPS Active)</span>
        </div>
      )}

      {/* Search Input and Radius Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <form onSubmit={handleManualSubmit} className="relative flex-1 flex">
          <div className="relative w-full">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={manualQuery}
              onChange={(e) => setManualQuery(e.target.value)}
              placeholder={t('location_enter_placeholder')}
              className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emergency-500 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={isLocating || !manualQuery.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition disabled:opacity-40"
            >
              {t('btn_search')}
            </button>
          </div>
        </form>

        {/* Radius selector */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shrink-0 justify-between">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-medium text-slate-600">{t('location_radius')}:</span>
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="text-xs font-bold text-slate-900 bg-transparent border-none focus:outline-none cursor-pointer"
          >
            {radiusOptions.map((r) => (
              <option key={r} value={r}>
                {r} km
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default LocationSearch;
