import React from 'react';
import {
  HeartPulse,
  Truck,
  ShieldCheck,
  Flame,
  Pill,
  Droplet,
  Home,
  CheckCircle2
} from 'lucide-react';

export const CATEGORY_ICONS = {
  'Hospitals': HeartPulse,
  'Ambulance Services': Truck,
  'Police Stations': ShieldCheck,
  'Fire Stations': Flame,
  'Pharmacies': Pill,
  'Blood Banks': Droplet,
  'Emergency Shelters': Home
};

export const CATEGORY_COLORS = {
  'Hospitals': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', active: 'border-red-600 bg-red-100/50' },
  'Ambulance Services': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', active: 'border-amber-600 bg-amber-100/50' },
  'Police Stations': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', active: 'border-blue-600 bg-blue-100/50' },
  'Fire Stations': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', active: 'border-orange-600 bg-orange-100/50' },
  'Pharmacies': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', active: 'border-emerald-600 bg-emerald-100/50' },
  'Blood Banks': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', active: 'border-rose-600 bg-rose-100/50' },
  'Emergency Shelters': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', active: 'border-purple-600 bg-purple-100/50' }
};

export const EmergencyCategoryCard = ({
  category,
  title,
  description,
  count,
  isSelected,
  onClick
}) => {
  const IconComponent = CATEGORY_ICONS[category] || HeartPulse;
  const colors = CATEGORY_COLORS[category] || {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    active: 'border-slate-900 bg-slate-100'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative text-left p-5 rounded-2xl border-2 transition-all duration-200 w-full flex flex-col justify-between ${
        isSelected
          ? `${colors.active} shadow-md scale-[1.02] ring-2 ring-slate-900/10`
          : `bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:shadow-sm`
      }`}
    >
      <div className="flex items-start justify-between w-full mb-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.bg} ${colors.text} ${colors.border} border shadow-xs transition group-hover:scale-105`}
        >
          <IconComponent className="w-6 h-6" />
        </div>
        {count !== undefined && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {count} {count === 1 ? 'service' : 'services'}
          </span>
        )}
      </div>

      <div>
        <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center justify-between">
          <span>{title || category}</span>
          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
};

export default EmergencyCategoryCard;
