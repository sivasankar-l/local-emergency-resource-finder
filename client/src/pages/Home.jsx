import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Navigation,
  MapPin,
  PhoneCall,
  Clock,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useLocationContext } from '../context/LocationContext';
import { useConnectivity } from '../context/ConnectivityContext';
import { fetchNearbyResources, fetchCategories } from '../services/resourceService';
import EmergencyCategoryCard from '../components/EmergencyCategoryCard';
import ResourceCard from '../components/ResourceCard';
import ResourceMap from '../components/ResourceMap';
import LocationSearch from '../components/LocationSearch';
import LoadingSpinner from '../components/LoadingSpinner';

const EMERGENCY_CATEGORIES = [
  'Hospitals',
  'Ambulance Services',
  'Police Stations',
  'Fire Stations',
  'Pharmacies',
  'Blood Banks',
  'Emergency Shelters'
];

export const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { coords, radius, detectLocation, isLocating } = useLocationContext();
  const { saveToOfflineCache } = useConnectivity();

  const [categoriesData, setCategoriesData] = useState([]);
  const [nearbyResources, setNearbyResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(true);

  // Load category counts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        if (res && res.data) {
          setCategoriesData(res.data);
        }
      } catch (e) {
        // Fallback default
      }
    };
    loadCategories();
  }, []);

  // Load preview resources near current search center
  useEffect(() => {
    const loadPreview = async () => {
      setLoadingPreview(true);
      try {
        const res = await fetchNearbyResources({
          latitude: coords?.latitude || 12.9698,
          longitude: coords?.longitude || 79.1559,
          radius: 25,
          category: selectedCategory || undefined,
          limit: 4
        });
        if (res && res.resources) {
          setNearbyResources(res.resources);
          saveToOfflineCache(res.resources);
        }
      } catch (e) {
        // Fallback or error handled gracefully
      } finally {
        setLoadingPreview(false);
      }
    };

    loadPreview();
  }, [coords, selectedCategory]);

  const handleFindNearMe = () => {
    detectLocation();
    navigate('/resources');
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/resources?category=${encodeURIComponent(categoryName)}`);
  };

  const getCategoryCount = (categoryName) => {
    const item = categoriesData.find((c) => c.name === categoryName);
    return item ? item.count : undefined;
  };

  return (
    <div className="space-y-12 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs font-semibold text-emergency-400 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emergency-500 animate-ping"></span>
            <span>{t('hero_badge')}</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {t('hero_title')}
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('hero_subtitle')}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleFindNearMe}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-sm shadow-lg shadow-emergency-600/30 transition-all active:scale-95"
            >
              <Navigation className="w-4 h-4" />
              <span>{t('btn_find_near_me')}</span>
            </button>

            <button
              onClick={() => navigate('/resources')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-all"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>{t('btn_explore_services')}</span>
            </button>
          </div>

          {/* Location Search Bar in Hero */}
          <div className="pt-6 max-w-3xl mx-auto text-slate-800 text-left">
            <LocationSearch onSearchComplete={() => navigate('/resources')} />
          </div>
        </div>
      </section>

      {/* EMERGENCY CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('categories_title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('categories_subtitle')}
            </p>
          </div>
          <button
            onClick={() => navigate('/resources')}
            className="text-xs font-bold text-emergency-700 hover:text-emergency-800 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {EMERGENCY_CATEGORIES.map((cat) => {
            const catKeyMap = {
              'Hospitals': 'cat_hospitals',
              'Ambulance Services': 'cat_ambulances',
              'Police Stations': 'cat_police',
              'Fire Stations': 'cat_fire',
              'Pharmacies': 'cat_pharmacies',
              'Blood Banks': 'cat_blood_banks',
              'Emergency Shelters': 'cat_shelters'
            };
            const descKeyMap = {
              'Hospitals': 'cat_hospitals_desc',
              'Ambulance Services': 'cat_ambulances_desc',
              'Police Stations': 'cat_police_desc',
              'Fire Stations': 'cat_fire_desc',
              'Pharmacies': 'cat_pharmacies_desc',
              'Blood Banks': 'cat_blood_banks_desc',
              'Emergency Shelters': 'cat_shelters_desc'
            };

            return (
              <EmergencyCategoryCard
                key={cat}
                category={cat}
                title={t(catKeyMap[cat])}
                description={t(descKeyMap[cat])}
                count={getCategoryCount(cat)}
                isSelected={selectedCategory === cat}
                onClick={() => handleCategoryClick(cat)}
              />
            );
          })}
        </div>
      </section>

      {/* NEARBY RESOURCES PREVIEW & MAP PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Nearby Emergency Services (Vellore & Katpadi Area)
            </h2>
            <p className="text-xs text-slate-500">
              Live distance calculation from your search location
            </p>
          </div>
          <button
            onClick={() => navigate('/map')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
          >
            <MapPin className="w-3.5 h-3.5 text-emergency-400" />
            <span>Open Full Interactive Map</span>
          </button>
        </div>

        {/* 2-Column Split: Map on Left, Quick Resource Cards on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-[360px] sm:h-[420px]">
            <ResourceMap
              resources={nearbyResources}
              height="100%"
            />
          </div>

          <div className="lg:col-span-7 space-y-3">
            {loadingPreview ? (
              <LoadingSpinner label="Fetching nearby emergency services..." />
            ) : nearbyResources.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {nearbyResources.map((item) => (
                  <ResourceCard key={item._id} resource={item} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-500">No emergency resources found nearby. Try expanding radius.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('how_it_works_title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Engineered for simplicity and speed when every second matters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t('step_1_title')}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t('step_1_desc')}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emergency-50 text-emergency-700 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t('step_2_title')}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t('step_2_desc')}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t('step_3_title')}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t('step_3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ACCESSIBILITY & EMERGENCY PREPAREDNESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emergency-500/20 text-emergency-400 text-xs font-semibold border border-emergency-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Accessibility & Public Safety</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Emergency Readiness for Everyone
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Designed according to WCAG contrast standards, touch-friendly tap targets, screen-reader semantics, bilingual English and Tamil localization, and resilient offline emergency contacts for poor connectivity environments.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Tamil & English i18n</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero-delay 1-touch dial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Accurate GPS & Geocoding</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>PWA offline cache</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emergency-400" />
                <span>Immediate Centralized Helplines</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl">
                  <div>
                    <span className="font-bold text-white block">112 Unified Emergency</span>
                    <span className="text-slate-400 text-[10px]">All-in-one Police, Fire, Medical</span>
                  </div>
                  <a href="tel:112" className="px-3 py-1 rounded-lg bg-emergency-600 font-bold text-white">Call 112</a>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl">
                  <div>
                    <span className="font-bold text-white block">108 Medical Ambulance</span>
                    <span className="text-slate-400 text-[10px]">Free 24/7 Government Ambulance</span>
                  </div>
                  <a href="tel:108" className="px-3 py-1 rounded-lg bg-emerald-600 font-bold text-white">Call 108</a>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl">
                  <div>
                    <span className="font-bold text-white block">0416-2202100 VIT Health Centre</span>
                    <span className="text-slate-400 text-[10px]">Campus First Responder & Ambulance</span>
                  </div>
                  <a href="tel:04162202100" className="px-3 py-1 rounded-lg bg-blue-600 font-bold text-white">Call VIT</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
