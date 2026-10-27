import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, HeartHandshake, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  const team = [
    { reg: '24MIC0120', name: 'NARENDIRAN' },
    { reg: '24MIC0146', name: 'SIVASANKAR' },
    { reg: '24MID0003', name: 'RISHI.H' },
    { reg: '24MID0213', name: 'RUPESHWAR' },
    { reg: '24MID0280', name: 'KRISHNAKUMAR' },
    { reg: '24MID0344', name: 'MARIAROOSO' },
    { reg: '24MID0349', name: 'RAMAKRISHNAN' }
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-sm">
      {/* Critical Emergency Disclaimer Banner */}
      <div className="bg-red-950/70 border-b border-red-900/40 text-red-200 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-emergency-500 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-red-100 uppercase tracking-wider block sm:inline">
              {t('disclaimer_title')}:{' '}
            </span>
            <span>{t('disclaimer_text')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Project Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emergency-600 flex items-center justify-center text-white">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-base">EmergencyFinder</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Academic Innovative Project (IIP) designed to streamline rapid location-based emergency resource discovery in Vellore and surrounding regions.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              <p className="font-semibold text-slate-300">Vellore Institute of Technology (VIT)</p>
              <p>School of Information Technology and Engineering</p>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white transition">Find Resources Near Me</Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition">Interactive Emergency Map</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">About Project & Architecture</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">Contact & Verification Feedback</Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-white transition">Administrator Portal</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Instant Helplines */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Emergency Helplines</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between py-1 border-b border-slate-800">
                <span>National Emergency</span>
                <a href="tel:112" className="text-emergency-400 font-bold hover:underline">112</a>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-800">
                <span>Medical Ambulance</span>
                <a href="tel:108" className="text-emergency-400 font-bold hover:underline">108</a>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-800">
                <span>Police Control Room</span>
                <a href="tel:100" className="text-emergency-400 font-bold hover:underline">100</a>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-800">
                <span>Fire & Rescue</span>
                <a href="tel:101" className="text-emergency-400 font-bold hover:underline">101</a>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-800">
                <span>Disaster Management</span>
                <a href="tel:1077" className="text-emergency-400 font-bold hover:underline">1077</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Project Team */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <h4 className="text-white font-semibold text-sm">VIT Project Team (IIP)</h4>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-800 text-[11px] space-y-1">
              <p className="text-emerald-400 font-semibold mb-1">Frontend / UI-UX Lead & Developers:</p>
              {team.map((m) => (
                <div key={m.reg} className="flex justify-between items-center text-slate-300">
                  <span className="font-mono text-slate-400">{m.reg}</span>
                  <span className="font-medium">{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 Local Emergency Resource Finder. Academic Innovative Project (IIP) at VIT Vellore.</p>
          <div className="flex items-center gap-4">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>OpenStreetMap Tiles & Nominatim Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
