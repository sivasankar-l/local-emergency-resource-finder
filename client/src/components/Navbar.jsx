import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  MapPin,
  Info,
  PhoneCall,
  UserCheck,
  LogOut,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { isAuthenticated, admin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: t('nav_home'), path: '/', icon: ShieldAlert },
    { name: t('nav_find_resources'), path: '/resources', icon: Search },
    { name: t('nav_map'), path: '/map', icon: MapPin },
    { name: t('nav_about'), path: '/about', icon: Info },
    { name: t('nav_contact'), path: '/contact', icon: PhoneCall },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-emergency-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-emergency-600 flex items-center justify-center text-white shadow-md shadow-emergency-600/30">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  EmergencyFinder
                </span>
                <span className="text-[10px] font-bold bg-emergency-600/20 text-emergency-400 border border-emergency-500/30 px-1.5 py-0.5 rounded">
                  VIT IIP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
                Local Resource Response Network
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-800 text-emergency-400 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right actions: Language toggle & Admin */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Switcher */}
            <button
              onClick={() => toggleLanguage()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              title="Toggle English / தமிழ்"
              aria-label="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-emergency-400" />
              <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* Admin Portal link */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 border border-emerald-500/30 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin ({admin?.name?.split(' ')[0] || 'Portal'})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 hover:text-white transition-colors"
              >
                {t('nav_admin')}
              </Link>
            )}

            {/* Quick 112 emergency dialer button */}
            <a
              href="tel:112"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs tracking-wide shadow transition-all active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS 112</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => toggleLanguage()}
              className="px-2.5 py-1 rounded border border-slate-700 bg-slate-800 text-xs font-bold text-slate-200"
            >
              {lang === 'en' ? 'தமிழ்' : 'EN'}
            </button>
            <a
              href="tel:112"
              className="px-2.5 py-1 rounded bg-emergency-600 text-white text-xs font-bold"
            >
              112
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-slate-800 text-emergency-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 text-slate-400" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          <div className="pt-4 border-t border-slate-800 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-emerald-400 font-medium"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Admin Dashboard ({admin?.name})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-lg text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav_logout')}</span>
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                {t('nav_admin')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
