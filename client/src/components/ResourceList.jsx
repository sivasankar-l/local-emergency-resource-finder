import React from 'react';
import { ShieldAlert, ArrowUpDown, Layers, RefreshCw } from 'lucide-react';
import ResourceCard from './ResourceCard';
import LoadingSpinner from './LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';

export const ResourceList = ({
  resources = [],
  loading = false,
  error = null,
  onRetry,
  sortBy,
  onSortChange,
  radius,
  category,
  selectedResourceId,
  onSelectResource
}) => {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner label="Searching verified emergency response units in your area..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 px-4 bg-white rounded-2xl border border-red-200">
        <ShieldAlert className="w-12 h-12 text-emergency-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 mb-1">Unable to Load Emergency Data</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emergency-600 text-white rounded-xl text-xs font-bold hover:bg-emergency-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('btn_retry')}</span>
          </button>
        )}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200">
        <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 mb-1">{t('no_results_title')}</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-4 leading-relaxed">
          {t('no_results_desc')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* List Header: count & sort selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200">
        <div>
          <p className="text-xs font-semibold text-slate-700">
            {t('results_found')}{' '}
            <span className="font-bold text-emergency-700">{radius} km</span>:
          </p>
          <span className="text-xs font-bold text-slate-900">
            {resources.length} {resources.length === 1 ? 'Emergency Service' : 'Emergency Services'}
            {category && category !== 'All' ? ` in ${category}` : ''}
          </span>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emergency-500 cursor-pointer"
          >
            <option value="nearest">{t('sort_nearest')}</option>
            <option value="newest">{t('sort_newest')}</option>
            <option value="name">{t('sort_name')}</option>
          </select>
        </div>
      </div>

      {/* Grid of resource cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((item) => (
          <ResourceCard
            key={item._id}
            resource={item}
            isSelected={selectedResourceId === item._id}
            onSelect={() => onSelectResource(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default ResourceList;
