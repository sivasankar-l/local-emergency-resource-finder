import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Layers,
  MapPin,
  List,
  Map as MapIcon,
  SlidersHorizontal,
  RefreshCw,
  Compass,
  X
} from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { useConnectivity } from '../context/ConnectivityContext';
import { fetchNearbyResources } from '../services/resourceService';
import LocationSearch from '../components/LocationSearch';
import ResourceCard from '../components/ResourceCard';
import ResourceMap from '../components/ResourceMap';
import ResourceList from '../components/ResourceList';
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

export const FindResources = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const { t } = useLanguage();
  const { coords, radius } = useLocationContext();
  const { isOnline, cachedResources, saveToOfflineCache } = useConnectivity();

  const [category, setCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nearest');
  const [viewMode, setViewMode] = useState('split'); // 'split', 'list', 'map'
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync category param with URL
  useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat && urlCat !== category) {
      setCategory(urlCat);
    }
  }, [searchParams]);

  // Load resources
  const loadResources = async () => {
    setLoading(true);
    setError(null);

    // If offline, use cached resources
    if (!navigator.onLine) {
      let filtered = cachedResources || [];
      if (category && category !== 'All') {
        filtered = filtered.filter((r) => r.category === category);
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        filtered = filtered.filter((r) =>
          r.name?.toLowerCase().includes(q) || r.address?.toLowerCase().includes(q)
        );
      }
      setResources(filtered);
      setLoading(false);
      return;
    }

    try {
      const res = await fetchNearbyResources({
        latitude: coords?.latitude || 12.9698,
        longitude: coords?.longitude || 79.1559,
        radius,
        category: category === 'All' ? undefined : category,
        q: searchTerm.trim() || undefined,
        limit: 50
      });

      if (res && res.resources) {
        let sortedList = [...res.resources];
        if (sortBy === 'name') {
          sortedList.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'newest') {
          sortedList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        }
        setResources(sortedList);
        saveToOfflineCache(sortedList);
      } else {
        setResources([]);
      }
    } catch (err) {
      // If network fails, fallback to cached resources
      if (cachedResources && cachedResources.length > 0) {
        setResources(cachedResources);
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load resources');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, [coords, radius, category, sortBy]);

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    if (newCat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', newCat);
    }
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadResources();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & View Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('nav_find_resources')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time proximity matching around {coords?.displayName || 'Katpadi, Vellore'}
          </p>
        </div>

        {/* View toggle */}
        <div className="inline-flex items-center bg-slate-200/80 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              viewMode === 'split' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split View</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List Only</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map Only</span>
          </button>
        </div>
      </div>

      {/* Location Search Bar */}
      <LocationSearch onSearchComplete={loadResources} />

      {/* Category Pills Bar */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                category === cat
                  ? 'bg-emergency-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'All' ? t('cat_all') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Text search & quick filter */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emergency-500 transition"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                loadResources();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
        >
          {t('btn_search')}
        </button>
      </form>

      {/* MAIN VIEW AREA */}
      {viewMode === 'map' ? (
        <div className="h-[600px]">
          <ResourceMap
            resources={resources}
            selectedResource={selectedResource}
            onSelectResource={setSelectedResource}
            height="100%"
          />
        </div>
      ) : viewMode === 'list' ? (
        <ResourceList
          resources={resources}
          loading={loading}
          error={error}
          onRetry={loadResources}
          sortBy={sortBy}
          onSortChange={setSortBy}
          radius={radius}
          category={category}
          selectedResourceId={selectedResource?._id}
          onSelectResource={setSelectedResource}
        />
      ) : (
        /* Split view */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <ResourceList
              resources={resources}
              loading={loading}
              error={error}
              onRetry={loadResources}
              sortBy={sortBy}
              onSortChange={setSortBy}
              radius={radius}
              category={category}
              selectedResourceId={selectedResource?._id}
              onSelectResource={setSelectedResource}
            />
          </div>

          <div className="lg:col-span-5 sticky top-20 h-[560px]">
            <ResourceMap
              resources={resources}
              selectedResource={selectedResource}
              onSelectResource={setSelectedResource}
              height="100%"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FindResources;
