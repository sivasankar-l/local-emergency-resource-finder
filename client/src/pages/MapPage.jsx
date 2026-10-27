import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Layers,
  Crosshair,
  Filter,
  Phone,
  Navigation,
  ExternalLink,
  X
} from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchNearbyResources } from '../services/resourceService';
import ResourceMap from '../components/ResourceMap';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = [
  'All',
  'Hospitals',
  'Ambulance Services',
  'Police Stations',
  'Fire Stations',
  'Pharmacies',
  'Blood Banks',
  'Emergency Shelters'
];

export const MapPage = () => {
  const { coords, radius, detectLocation, isLocating } = useLocationContext();
  const { t } = useLanguage();

  const [category, setCategory] = useState('All');
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMapData = async () => {
      setLoading(true);
      try {
        const res = await fetchNearbyResources({
          latitude: coords?.latitude || 12.9698,
          longitude: coords?.longitude || 79.1559,
          radius: 50,
          category: category === 'All' ? undefined : category,
          limit: 100
        });
        if (res && res.resources) {
          setResources(res.resources);
        }
      } catch (e) {
        // Fallback
      } finally {
        setLoading(false);
      }
    };

    loadMapData();
  }, [coords, category]);

  return (
    <div className="relative h-[calc(100vh-4rem)] flex flex-col">
      {/* Floating Category Filter Bar */}
      <div className="absolute top-4 left-4 right-14 z-[1000] flex items-center gap-2 overflow-x-auto p-1 scrollbar-none pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-md flex items-center gap-1.5 max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setSelectedResource(null);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                category === cat
                  ? 'bg-emergency-600 text-white shadow-xs'
                  : 'bg-transparent text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat === 'All' ? t('cat_all') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map */}
      <div className="flex-1 w-full h-full">
        {loading ? (
          <div className="h-full flex items-center justify-center bg-slate-100">
            <LoadingSpinner label="Loading map resource coordinates..." />
          </div>
        ) : (
          <ResourceMap
            resources={resources}
            selectedResource={selectedResource}
            onSelectResource={setSelectedResource}
            height="100%"
          />
        )}
      </div>

      {/* Slide-Up Bottom Drawer for Selected Resource */}
      {selectedResource && (
        <div className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-[1000] bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 animate-slide-up">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emergency-600 bg-emergency-50 px-2 py-0.5 rounded-full">
              {selectedResource.category}
            </span>
            <button
              onClick={() => setSelectedResource(null)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3 className="font-extrabold text-base text-slate-900 leading-snug mb-1">
            {selectedResource.name}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 mb-2">
            {selectedResource.address}, {selectedResource.city}
          </p>

          {selectedResource.distance !== null && selectedResource.distance !== undefined && (
            <p className="text-xs font-semibold text-emergency-600 mb-3">
              📍 {selectedResource.distance} km from your search location
            </p>
          )}

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            {selectedResource.phone && (
              <a
                href={`tel:${selectedResource.phone}`}
                className="flex-1 py-2 px-3 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs text-center inline-flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            )}

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedResource.latitude},${selectedResource.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs inline-flex items-center justify-center gap-1.5 transition"
            >
              <Navigation className="w-3.5 h-3.5 text-emergency-400" />
              <span>Navigate</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
