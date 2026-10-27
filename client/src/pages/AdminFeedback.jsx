import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  User,
  Calendar,
  Check
} from 'lucide-react';
import { fetchAdminFeedback, updateFeedbackStatus } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export const AdminFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminFeedback({
        status: statusFilter === 'All' ? undefined : statusFilter,
        page: 1,
        limit: 50
      });
      if (res && res.data) {
        setFeedbackList(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, [statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateFeedbackStatus(id, newStatus);
      setFeedbackList((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            User Feedback & Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review community notifications, corrections, and emergency resource suggestions
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="All">All Inquiries</option>
            <option value="new">New / Unread</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading feedback inquiries..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadFeedback} />
      ) : feedbackList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
          No feedback inquiries found for the selected status.
        </div>
      ) : (
        <div className="space-y-3">
          {feedbackList.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      item.status === 'new'
                        ? 'bg-red-50 text-emergency-700 border border-red-200'
                        : item.status === 'reviewed'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {item.status}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">{item.subject}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>

                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                    className="text-xs font-semibold px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none cursor-pointer"
                  >
                    <option value="new">Mark as New</option>
                    <option value="reviewed">Mark as Reviewed</option>
                    <option value="resolved">Mark as Resolved</option>
                  </select>
                </div>
              </div>

              <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                {item.message}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700">{item.name}</span>
                </span>

                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`mailto:${item.email}`} className="text-blue-600 hover:underline">
                    {item.email}
                  </a>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
