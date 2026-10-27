import React from 'react';
import {
  ShieldAlert,
  GraduationCap,
  Users,
  Code2,
  CheckCircle2,
  Compass,
  Cpu,
  Database,
  Globe2,
  Zap,
  PhoneCall
} from 'lucide-react';

export const About = () => {
  const teamMembers = [
    { reg: '24MIC0120', name: 'NARENDIRAN', role: 'Full Stack Integration & Testing' },
    { reg: '24MIC0146', name: 'SIVASANKAR', role: 'Backend Architecture & API Services' },
    { reg: '24MID0003', name: 'RISHI.H', role: 'Database Engineering & Geocoding' },
    { reg: '24MID0213', name: 'RUPESHWAR', role: 'Frontend & Leaflet Mapping Integration' },
    { reg: '24MID0280', name: 'KRISHNAKUMAR', role: 'Authentication & Security Verification' },
    { reg: '24MID0344', name: 'MARIAROOSO', role: 'Localization & Mobile Responsiveness' },
    { reg: '24MID0349', name: 'RAMAKRISHNAN', role: 'QA Testing & Documentation' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emergency-50 border border-emergency-200 text-xs font-bold text-emergency-700">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Vellore Institute of Technology (VIT) • IIP Project</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About Local Emergency Resource Finder
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          An Innovative Project (IIP) architected to deliver immediate, location-aware emergency resource discovery across Vellore and surrounding districts.
        </p>
      </div>

      {/* Problem & Proposed Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-emergency-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">The Emergency Discovery Problem</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In medical crises, road accidents, or natural disasters, individuals often scramble across multiple fragmented platforms, out-of-date directories, or unverified social media leads to locate working emergency facilities. Every delay during golden-hour trauma reduces survivability.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Our Engineered Solution</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Local Emergency Resource Finder delivers an uncluttered, high-contrast, bilingual interface that instantly acquires the user’s coordinates (or manual landmark search) and uses the Haversine geospatial proximity algorithm to index verified emergency services sorted by real-time distance.
          </p>
        </div>
      </div>

      {/* Project Objectives */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Compass className="w-5 h-5 text-emergency-400" />
          <span>Core Project Objectives</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Multi-category resource filtering covering all 7 essential emergency tiers.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Accurate GPS location acquisition with graceful manual geocoding fallback.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Direct one-tap phone dialer and navigation links without intermediary barriers.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Bilingual English and Tamil support honoring regional accessibility requirements.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Offline resilience via Service Worker caching and verified emergency helplines.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Administrative governance portal with JWT authentication and audit trails.</span>
          </div>
        </div>
      </div>

      {/* Team Details */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emergency-600" />
              <span>Project Team Members</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Vellore Institute of Technology (VIT) • Innovative Project (IIP)
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            Frontend / UI-UX Lead
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <div
              key={member.reg}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 hover:border-slate-300 transition"
            >
              <span className="font-mono text-xs font-bold text-emergency-700 bg-emergency-50 px-2 py-0.5 rounded border border-emergency-100">
                {member.reg}
              </span>
              <h3 className="font-bold text-slate-900 text-sm">{member.name}</h3>
              <p className="text-[11px] text-slate-500">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-slate-700" />
          <span>Full Stack Technology Architecture</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">Frontend</span>
            <p className="text-slate-600">React.js, Vite, Tailwind CSS, React Router v6, Lucide Icons</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">Mapping</span>
            <p className="text-slate-600">React Leaflet, OpenStreetMap Tiles, Nominatim Geocoding</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">Backend</span>
            <p className="text-slate-600">Node.js, Express.js REST API, Helmet, CORS, Rate-Limiting</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">Database & Auth</span>
            <p className="text-slate-600">MongoDB, Mongoose ORM, JWT Tokens, Bcrypt Password Hashing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
