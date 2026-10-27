import React, { useState } from 'react';
import {
  Mail,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  MapPin,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { sendFeedback } from '../services/resourceService';
import { useLanguage } from '../context/LanguageContext';

export const Contact = () => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please provide your full name.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!formData.subject.trim()) errors.subject = 'Subject is required.';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await sendFeedback(formData);
      if (res && res.success) {
        setSuccessMsg(res.message || t('form_success'));
        setFormData({ name: '', email: '', subject: '', message: '' });
        setFieldErrors({});
      } else {
        setErrorMsg(res.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      const errResponseMsg = err.response?.data?.message || err.message;
      setErrorMsg(errResponseMsg || 'Could not connect to the feedback server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('contact_title')}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {t('contact_subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emergency-600" />
            <h2 className="text-lg font-bold text-slate-900">Send Resource Feedback or Report an Update</h2>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-emergency-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('form_name')} <span className="text-emergency-600">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emergency-500 focus:bg-white transition ${
                  fieldErrors.name ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder="Dr. / Mr. / Ms. Name"
              />
              {fieldErrors.name && (
                <p className="text-[11px] text-red-600 mt-1">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('form_email')} <span className="text-emergency-600">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emergency-500 focus:bg-white transition ${
                  fieldErrors.email ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder="name@organization.com"
              />
              {fieldErrors.email && (
                <p className="text-[11px] text-red-600 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('form_subject')} <span className="text-emergency-600">*</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={`w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emergency-500 focus:bg-white transition ${
                  fieldErrors.subject ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder="e.g., Update operating hours for Katpadi Pharmacy"
              />
              {fieldErrors.subject && (
                <p className="text-[11px] text-red-600 mt-1">{fieldErrors.subject}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('form_message')} <span className="text-emergency-600">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emergency-500 focus:bg-white transition ${
                  fieldErrors.message ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder="Provide details about the emergency resource, phone correction, or new service..."
              />
              {fieldErrors.message && (
                <p className="text-[11px] text-red-600 mt-1">{fieldErrors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? t('form_submitting') : t('form_submit')}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Emergency & Campus Helplines */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-5 border border-slate-800 shadow-md">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emergency-500" />
              <h3 className="font-bold text-base text-white">Emergency Response Note</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Do not use this feedback form to request immediate emergency assistance. For urgent medical emergencies, accidents, or police help, call the toll-free services below immediately.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-slate-800 rounded-xl flex items-center justify-between border border-slate-700">
                <div>
                  <span className="font-bold text-white block">Medical Ambulance</span>
                  <span className="text-slate-400 text-[10px]">24/7 State Emergency Dispatch</span>
                </div>
                <a href="tel:108" className="px-3 py-1 bg-emergency-600 text-white rounded font-bold">108</a>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl flex items-center justify-between border border-slate-700">
                <div>
                  <span className="font-bold text-white block">Police Control Room</span>
                  <span className="text-slate-400 text-[10px]">State Police Emergency Desk</span>
                </div>
                <a href="tel:100" className="px-3 py-1 bg-blue-600 text-white rounded font-bold">100</a>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl flex items-center justify-between border border-slate-700">
                <div>
                  <span className="font-bold text-white block">National Disaster (DDMA)</span>
                  <span className="text-slate-400 text-[10px]">Disaster Relief Management</span>
                </div>
                <a href="tel:1077" className="px-3 py-1 bg-orange-600 text-white rounded font-bold">1077</a>
              </div>
            </div>
          </div>

          {/* Institutional Contact */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs text-xs text-slate-600">
            <h4 className="font-bold text-slate-900 text-sm">Academic Project Office</h4>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>Vellore Institute of Technology (VIT), Katpadi, Vellore, Tamil Nadu 632014</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>emergency.finder@vit.ac.in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
