import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Layers,
  CheckCircle2,
  Clock,
  MessageSquare,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  FolderGit2
} from 'lucide-react';
import { fetchAdminStats } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export const AdminDashboard = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminStats();
      if (res && res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load administrative stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <LoadingSpinner label="Compiling system metrics & audit logs..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ErrorMessage message={error} onRetry={loadStats} />
      </div>
    );
  }

  const {
    totalResources = 0,
    categoryCounts = {},
    verificationCounts = {},
    totalFeedback = 0,
    newFeedback = 0,
    recentResources = []
  } = stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-emergency-600 uppercase tracking-wider">
            Administrative Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Emergency Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Logged in as <span className="font-semibold text-slate-700">{admin?.name}</span> ({admin?.email}) • Role: {admin?.role}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/resources"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Manage Resources</span>
          </Link>

          <Link
            to="/admin/feedback"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition"
          >
            <MessageSquare className="w-4 h-4 text-emergency-600" />
            <span>Feedback ({newFeedback})</span>
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Resources */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Total Resources</span>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalResources}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Across 7 emergency categories</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Verified Resources */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Verified Records</span>
            <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">
              {verificationCounts.verified || 0}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Pending: {verificationCounts.pending || 0}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Unverified / Demo */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Demo / Unverified</span>
            <h3 className="text-3xl font-extrabold text-amber-600 mt-1">
              {verificationCounts.unverified || 0}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Requires civic verification</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Community Feedback */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">New Inquiries</span>
            <h3 className="text-3xl font-extrabold text-emergency-600 mt-1">{newFeedback}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Total logs: {totalFeedback}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emergency-50 text-emergency-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Category Breakdown & Recent Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Category breakdown bar cards */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-base text-slate-900">Distribution by Category</h2>
            <span className="text-xs text-slate-400">7 categories</span>
          </div>

          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([catName, count]) => {
              const pct = totalResources > 0 ? Math.round((count / totalResources) * 100) : 0;
              return (
                <div key={catName} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>{catName}</span>
                    <span className="font-bold text-slate-900">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emergency-600 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recently Updated Resources */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-base text-slate-900">Recently Updated Resources</h2>
            <Link
              to="/admin/resources"
              className="text-xs font-bold text-emergency-600 hover:text-emergency-700 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentResources.map((res) => (
              <div key={res._id} className="py-3 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">{res.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    {res.category} • {res.city}, {res.state}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      res.verificationStatus === 'verified'
                        ? 'bg-emerald-50 text-emerald-700'
                        : res.verificationStatus === 'pending'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {res.verificationStatus}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(res.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
