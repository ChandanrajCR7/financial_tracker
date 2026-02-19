import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';

function ProfileDropdown({ darkMode, onClose }) {
  const { transactions, balance, totalIncome, totalExpense, setDarkMode } = useFinance();

  const [name, setName] = useState(() => localStorage.getItem('cashcompass_name') || 'User');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  const saveName = () => {
    const trimmed = draft.trim() || 'User';
    setName(trimmed);
    localStorage.setItem('cashcompass_name', trimmed);
    setEditing(false);
  };

  const exportCSV = () => {
    const header = 'Title,Amount,Type,Category,Date,Note';
    const rows = transactions.map(t =>
      `"${t.title}",${t.amount},${t.type},${t.category},${t.date},"${t.note || ''}"`
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cashcompass_transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const clearData = () => {
    if (window.confirm('Clear all transactions? This cannot be undone.')) {
      localStorage.removeItem('cashcompass_transactions');
      window.location.reload();
    }
  };

  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const panel = darkMode
    ? 'bg-slate-800 border-slate-700 text-white'
    : 'bg-white border-violet-100 text-slate-800';

  return (
    <div className={`absolute right-0 top-12 w-72 rounded-2xl border shadow-2xl z-50 overflow-hidden ${panel}`}
      style={{ animation: 'slideUp 0.2s ease-out' }}>

      {/* Profile header */}
      <div className="bg-gradient-to-br from-violet-600 to-emerald-500 px-5 py-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white/25 flex items-center justify-center text-white font-extrabold text-xl shadow-inner flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          {editing ? (
            <div className="flex gap-2 items-center">
              <input
                autoFocus
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditing(false); }}
                className="bg-white/20 text-white placeholder-white/60 rounded-lg px-2 py-1 text-sm w-full outline-none border border-white/40 focus:border-white"
              />
              <button onClick={saveName} className="text-white/80 hover:text-white text-xs font-bold">✓</button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 group">
              <p className="text-white font-bold text-base truncate">{name}</p>
              <button
                onClick={() => { setDraft(name); setEditing(true); }}
                className="text-white/50 hover:text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                title="Edit name"
              >✏️</button>
            </div>
          )}
          <p className="text-white/70 text-xs mt-0.5">{transactions.length} transactions recorded</p>
        </div>
      </div>

      {/* Stats */}
      <div className={`grid grid-cols-3 divide-x text-center py-3 ${darkMode ? 'divide-slate-700 border-b border-slate-700' : 'divide-violet-50 border-b border-violet-50'}`}>
        <div className="px-2">
          <p className="text-xs text-emerald-500 font-bold">₹{(totalIncome/1000).toFixed(1)}k</p>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Income</p>
        </div>
        <div className="px-2">
          <p className="text-xs text-rose-500 font-bold">₹{(totalExpense/1000).toFixed(1)}k</p>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Expense</p>
        </div>
        <div className="px-2">
          <p className={`text-xs font-bold ${balance >= 0 ? 'text-violet-500' : 'text-rose-500'}`}>
            ₹{(Math.abs(balance)/1000).toFixed(1)}k
          </p>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Balance</p>
        </div>
      </div>

      {/* Menu items */}
      <div className="p-2 flex flex-col gap-0.5">
        <button
          onClick={() => setDarkMode(d => !d)}
          className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-violet-50'}`}
        >
          <span className="text-base">{darkMode ? '☀️' : '🌙'}</span>
          Switch to {darkMode ? 'Light' : 'Dark'} Mode
        </button>

        <button
          onClick={exportCSV}
          className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-violet-50'}`}
        >
          <span className="text-base">⬇️</span>
          Export as CSV
        </button>

        <div className={`my-1 h-px ${darkMode ? 'bg-slate-700' : 'bg-violet-50'}`} />

        <button
          onClick={clearData}
          className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors"
        >
          <span className="text-base">🗑️</span>
          Clear All Data
        </button>
      </div>
    </div>
  );
}

export default function Navbar({ onAddClick }) {
  const { darkMode, setDarkMode } = useFinance();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const name = localStorage.getItem('cashcompass_name') || 'User';
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md border-b ${
      darkMode
        ? 'bg-slate-900/90 border-slate-700 text-white'
        : 'bg-white/90 border-violet-100 text-slate-800'
    } shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="19" stroke="url(#cg1)" strokeWidth="2"/>
                {/* Compass ticks */}
                <line x1="20" y1="2" x2="20" y2="7" stroke="url(#cg1)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="20" y1="33" x2="20" y2="38" stroke="url(#cg1)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="2" y1="20" x2="7" y2="20" stroke="url(#cg1)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="33" y1="20" x2="38" y2="20" stroke="url(#cg1)" strokeWidth="2" strokeLinecap="round"/>
                {/* Compass needle */}
                <polygon points="20,9 22.2,20 20,18 17.8,20" fill="#7c3aed"/>
                <polygon points="20,31 22.2,20 20,22 17.8,20" fill="#10b981"/>
                {/* Rupee symbol */}
                <text x="20" y="22" textAnchor="middle" fontSize="9" fontWeight="bold" fill="url(#cg1)" fontFamily="Arial">₹</text>
                <defs>
                  <linearGradient id="cg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7c3aed"/>
                    <stop offset="1" stopColor="#10b981"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-violet-500 to-emerald-500 bg-clip-text text-transparent">
              CashCompass
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {[['Dashboard', '/dashboard'], ['Transactions', '/transactions'], ['Analytics', '/analytics'], ['Goals', '/goals']].map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-violet-500 border-b-2 border-violet-500 pb-0.5'
                      : darkMode ? 'text-slate-300 hover:text-violet-400' : 'text-slate-600 hover:text-violet-500'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                darkMode ? 'bg-violet-600' : 'bg-slate-200'
              }`}
              aria-label="Toggle dark mode"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow transition-transform duration-300 flex items-center justify-center text-xs ${
                  darkMode ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white'
                }`}
              >
                {darkMode ? '🌙' : '☀️'}
              </span>
            </button>

            {/* Add Transaction */}
            <button
              onClick={onAddClick}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-emerald-500 text-white text-sm font-semibold shadow-md hover:shadow-violet-300 hover:scale-105 transition-all duration-200"
            >
              <span className="text-lg leading-none">+</span> Add Transaction
            </button>

            {/* Avatar with dropdown */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(o => !o)}
                className={`w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:scale-110 transition-transform shadow ring-2 ring-offset-2 ${
                  profileOpen
                    ? 'ring-violet-500'
                    : 'ring-transparent'
                } ${darkMode ? 'ring-offset-slate-900' : 'ring-offset-white'}`}
                aria-label="Profile menu"
              >
                {initials}
              </button>

              {profileOpen && (
                <ProfileDropdown darkMode={darkMode} onClose={() => setProfileOpen(false)} />
              )}
            </div>

            {/* Mobile menu btn */}
            <button
              className="md:hidden p-2 rounded-lg"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className={`w-5 h-0.5 mb-1 transition-all ${darkMode ? 'bg-white' : 'bg-slate-700'}`}></div>
              <div className={`w-5 h-0.5 mb-1 transition-all ${darkMode ? 'bg-white' : 'bg-slate-700'}`}></div>
              <div className={`w-5 h-0.5 transition-all ${darkMode ? 'bg-white' : 'bg-slate-700'}`}></div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className={`md:hidden pb-4 flex flex-col gap-3 border-t pt-3 ${darkMode ? 'border-slate-700' : 'border-violet-100'}`}>
            {[['Dashboard', '/dashboard'], ['Transactions', '/transactions'], ['Analytics', '/analytics'], ['Goals', '/goals']].map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-semibold px-2 py-1 rounded-lg ${
                    isActive
                      ? 'text-violet-500 bg-violet-50'
                      : darkMode ? 'text-slate-300' : 'text-slate-600'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <button
              onClick={() => { onAddClick(); setMenuOpen(false); }}
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-emerald-500 text-white text-sm font-semibold"
            >
              + Add Transaction
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
