import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div
      className="p-5 my-4 bg-red-50 border border-red-200 rounded-xl text-red-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      role="alert"
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-emergency-600 shrink-0" />
        <div>
          <h4 className="font-semibold text-sm text-red-900">Emergency Alert / Request Notice</h4>
          <p className="text-sm text-red-700 mt-0.5">{message || 'An unexpected error occurred while communicating with the emergency server.'}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Request
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
