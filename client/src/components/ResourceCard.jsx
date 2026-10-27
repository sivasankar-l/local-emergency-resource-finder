import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORY_ICONS, CATEGORY_COLORS } from './EmergencyCategoryCard';

export const ResourceCard = ({ resource, onSelect, isSelected }) => {
  const { t } = useLanguage();
  const IconComponent = CATEGORY_ICONS[resource.category] || ShieldCheck;
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
    <article
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between p-5 ${
        isSelected
          ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-lg'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div>
        {/* Top Header: Category badge & Verification */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} border ${colors.border}`}
          >
            <IconComponent className="w-3.5 h-3.5" />
            <span>{resource.category}</span>
          </span>

          {resource.verificationStatus === 'verified' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span>Verified</span>
            </span>
          )}

          {resource.verificationStatus === 'pending' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              <span>Pending</span>
            </span>
          )}

          {resource.verificationStatus === 'unverified' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              <span>Demo / Unverified</span>
            </span>
          )}
        </div>

        {/* Title & Distance */}
        <div className="mb-3">
          <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
            <Link
              to={`/resources/${resource._id}`}
              className="hover:text-emergency-700 focus:outline-none focus:underline transition-colors"
            >
              {resource.name}
            </Link>
          </h3>

          {resource.distance !== null && resource.distance !== undefined && (
            <p className="text-xs font-semibold text-emergency-700 mt-1 flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              <span>{resource.distance} km away from your location</span>
            </p>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-xs text-slate-600 mb-2">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="line-clamp-2">
            {resource.address}, {resource.city}, {resource.state} {resource.postalCode}
          </p>
        </div>

        {/* Operating Hours */}
        {resource.operatingHours && (
          <div className="flex items-center gap-2 text-xs text-slate-600 mb-3">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700">{resource.operatingHours}</span>
          </div>
        )}

        {/* Services tags */}
        {resource.services && resource.services.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.services.slice(0, 3).map((srv, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium"
              >
                {srv}
              </span>
            ))}
            {resource.services.length > 3 && (
              <span className="text-[10px] text-slate-400 font-semibold self-center">
                +{resource.services.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        {hasPhone ? (
          <a
            href={`tel:${resource.phone.replace(/[^0-9+]/g, '')}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs tracking-wide shadow-sm transition active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{t('btn_call_now')}</span>
          </a>
        ) : (
          <span className="flex-1 text-center py-2 px-2 text-[11px] text-slate-400 font-medium bg-slate-50 rounded-xl">
            No phone listed
          </span>
        )}

        {directionsUrl ? (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-2 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 transition"
            title="Open Turn-by-Turn Directions"
            aria-label="Get Directions in Google Maps"
          >
            <Navigation className="w-4 h-4 text-slate-700" />
          </a>
        ) : null}

        <Link
          to={`/resources/${resource._id}`}
          className="inline-flex items-center justify-center py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs transition"
        >
          <span>{t('btn_view_details')}</span>
        </Link>
      </div>
    </article>
  );
};

export default ResourceCard;
