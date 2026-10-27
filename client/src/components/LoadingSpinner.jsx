import React from 'react';

export const LoadingSpinner = ({ label = 'Loading emergency resources...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3" role="status" aria-live="polite">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-emergency-600 rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
