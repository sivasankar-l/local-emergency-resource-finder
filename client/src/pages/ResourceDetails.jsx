import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Calendar,
  Database,
  Building,
  Layers,
  PhoneCall
} from 'lucide-react';
import { fetchResourceById } from '../services/resourceService';
import { useLanguage } from '../context/LanguageContext';
import ResourceMap from '../components/ResourceMap';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../components/EmergencyCategoryCard';

export const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadResource = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchResourceById(id);
        if (res && res.data) {
          setResource(res.data);
        } else {
          setError('Resource not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load resource details');
      } finally {
        setLoading(false);
      }
    };

    loadResource();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <LoadingSpinner label="Loading emergency resource details..." />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ErrorMessage message={error || 'Emergency resource not found'} />
        <button
          onClick={() => navigate('/resources')}
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('btn_back')}</span>
        </button>
      </div>
    );
  }

  const IconComponent = CATEGORY_ICONS[resource.category] || Building;
  const colors = CATEGORY_COLORS[resource.category] || {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200'
  };

  const hasPhone = Boolean(resource.phone && resource.phone.trim());
  const hasCoords = Boolean(resource.latitude && resource.longitude);
  const directionsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${resource.latitude},${resource.longitude}`
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Back Action */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('btn_back')}</span>
      </button>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-8">
        {/* Header Title & Badges */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text} border ${colors.border}`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{resource.category}</span>
              </span>

              {resource.verificationStatus === 'verified' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('status_verified')}</span>
                </span>
              )}

              {resource.verificationStatus === 'pending' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('status_pending')}</span>
                </span>
              )}

              {resource.verificationStatus === 'unverified' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  <span>{t('status_unverified')}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {resource.name}
            </h1>

            {resource.description && (
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                {resource.description}
              </p>
            )}
          </div>

          {/* Quick Contact & Action Buttons */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            {hasPhone && (
              <a
                href={`tel:${resource.phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{t('btn_call_now')}</span>
              </a>
            )}

            {directionsUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-95"
              >
                <Navigation className="w-4 h-4 text-emergency-400" />
                <span>{t('btn_get_directions')}</span>
              </a>
            )}
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {/* Left Column: Address & Contacts */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Contact & Location Information
            </h3>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase block">Address</span>
                <p className="text-slate-800 font-medium">
                  {resource.address}, {resource.city}, {resource.state} {resource.postalCode || ''}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase block">Emergency Phone</span>
                <p className="text-slate-800 font-medium">
                  {resource.phone || t('info_unavailable')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase block">Official Email</span>
                <p className="text-slate-800 font-medium">
                  {resource.email || t('info_unavailable')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Navigation className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase block">Geographic Coordinates</span>
                <p className="text-slate-800 font-mono text-xs">
                  {resource.latitude && resource.longitude
                    ? `${resource.latitude.toFixed(6)}, ${resource.longitude.toFixed(6)}`
                    : t('info_unavailable')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Operations & Status */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Operational & Verification Status
            </h3>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase block">{t('operating_hours')}</span>
                <p className="text-slate-800 font-medium">
                  {resource.operatingHours || t('info_unavailable')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Database className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase block">{t('data_source')}</span>
                <p className="text-slate-800 font-medium">
                  {resource.dataSource || 'Demonstration Seed Data'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase block">{t('last_updated')}</span>
                <p className="text-slate-800 font-medium">
                  {resource.lastUpdated
                    ? new Date(resource.lastUpdated).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : t('info_unavailable')}
                </p>
              </div>
            </div>

            {resource.verificationStatus === 'verified' && resource.verifiedAt && (
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase block">Verification Timestamp</span>
                  <p className="text-emerald-700 font-medium text-xs">
                    Verified on {new Date(resource.verifiedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Services Provided Section */}
        {resource.services && resource.services.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              {t('services_offered')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {resource.services.map((srv, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  ✓ {srv}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Dedicated Map Location View */}
        {hasCoords && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emergency-600" />
              <span>Exact Geographic Location</span>
            </h3>
            <div className="h-[320px] rounded-2xl overflow-hidden border border-slate-200">
              <ResourceMap
                resources={[resource]}
                selectedResource={resource}
                height="100%"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceDetails;
