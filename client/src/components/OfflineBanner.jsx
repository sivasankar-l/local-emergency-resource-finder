import React, { useState } from 'react';
import { WifiOff, PhoneCall, ChevronDown, ChevronUp } from 'lucide-react';
import { useConnectivity } from '../context/ConnectivityContext';
import { useLanguage } from '../context/LanguageContext';

export const OfflineBanner = () => {
  const { isOnline, essentialContacts } = useConnectivity();
  const { t } = useLanguage();
  const [showContacts, setShowContacts] = useState(false);

  if (isOnline) return null;

  return (
    <div className="bg-amber-600 text-white px-4 py-2.5 shadow-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <WifiOff className="w-5 h-5 text-amber-200 animate-pulse" />
          <span className="font-semibold">{t('offline_notice')}</span>
        </div>

        <button
          onClick={() => setShowContacts(!showContacts)}
          className="inline-flex items-center gap-1.5 text-xs bg-amber-700 hover:bg-amber-800 text-white font-medium px-3 py-1 rounded-md transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Direct Emergency Dialers</span>
          {showContacts ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {showContacts && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-amber-500/50 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {essentialContacts.map((c) => (
            <a
              key={c.name}
              href={`tel:${c.number}`}
              className="p-2 bg-amber-700/80 hover:bg-amber-800 rounded flex flex-col items-start transition"
            >
              <span className="font-bold text-amber-100">{c.name}</span>
              <span className="text-white text-sm font-black mt-0.5">{c.number}</span>
              <span className="text-[10px] text-amber-200 mt-0.5 truncate">{c.desc}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfflineBanner;
