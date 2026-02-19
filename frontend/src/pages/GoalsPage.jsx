import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

const COLORS = ['violet', 'emerald', 'amber', 'rose', 'blue', 'teal'];
const COLOR_MAP = {
  violet: { bar: 'bg-violet-500', light: 'bg-violet-100', text: 'text-violet-600', ring: 'ring-violet-400' },
  emerald: { bar: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-600', ring: 'ring-emerald-400' },
  amber: { bar: 'bg-amber-400', light: 'bg-amber-100', text: 'text-amber-600', ring: 'ring-amber-400' },
  rose: { bar: 'bg-rose-500', light: 'bg-rose-100', text: 'text-rose-600', ring: 'ring-rose-400' },
  blue: { bar: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600', ring: 'ring-blue-400' },
  teal: { bar: 'bg-teal-500', light: 'bg-teal-100', text: 'text-teal-600', ring: 'ring-teal-400' },
};

const EMOJIS = ['🎯', '✈️', '💻', '🏠', '🚗', '💍', '📚', '🛡️', '💰', '🏋️', '🎓', '🎸'];

const defaultForm = { title: '', emoji: '🎯', target: '', saved: '', deadline: '', color: 'violet' };

function GoalModal({ onClose, editData, darkMode }) {
  const { addGoal, updateGoal } = useFinance();
  const [form, setForm] = useState(editData ? { ...editData, target: String(editData.target), saved: String(editData.saved) } : defaultForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Required';
    if (!form.target || isNaN(form.target) || Number(form.target) <= 0) e.target = 'Enter valid amount';
    if (form.saved && (isNaN(form.saved) || Number(form.saved) < 0)) e.saved = 'Enter valid amount';
    if (!form.deadline) e.deadline = 'Required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const data = { ...form, target: parseFloat(form.target), saved: parseFloat(form.saved || 0) };
    editData ? updateGoal(editData.id, data) : addGoal(data);
    onClose();
  };

  const inp = `w-full rounded-xl px-3 py-2.5 text-sm border outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
    darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-violet-100 text-slate-800'
  }`;
  const lbl = `block text-xs font-semibold mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl p-6 ${darkMode ? 'bg-slate-800 text-white' : 'bg-white'}`}
        style={{ animation: 'slideUp 0.25s ease-out' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold">{editData ? '✏️ Edit Goal' : '🎯 New Savings Goal'}</h2>
          <button onClick={onClose} className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Emoji picker */}
          <div>
            <label className={lbl}>Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(em => (
                <button key={em} type="button" onClick={() => setForm(f => ({ ...f, emoji: em }))}
                  className={`w-9 h-9 rounded-xl text-lg transition-all hover:scale-110 ${form.emoji === em ? 'bg-violet-100 ring-2 ring-violet-400 scale-110' : darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={lbl}>Goal Name *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Vacation to Goa" className={`${inp} ${errors.title ? 'border-rose-400' : ''}`} />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* Target & Saved */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Target (₹) *</label>
              <input type="number" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                placeholder="50000" className={`${inp} ${errors.target ? 'border-rose-400' : ''}`} />
              {errors.target && <p className="text-xs text-rose-500 mt-1">{errors.target}</p>}
            </div>
            <div>
              <label className={lbl}>Already Saved (₹)</label>
              <input type="number" value={form.saved} onChange={e => setForm(f => ({ ...f, saved: e.target.value }))}
                placeholder="0" className={inp} />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className={lbl}>Target Date *</label>
            <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
              className={`${inp} ${errors.deadline ? 'border-rose-400' : ''}`} />
            {errors.deadline && <p className="text-xs text-rose-500 mt-1">{errors.deadline}</p>}
          </div>

          {/* Color */}
          <div>
            <label className={lbl}>Color Theme</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                  className={`w-7 h-7 rounded-full transition-all hover:scale-110 ${COLOR_MAP[c].bar} ${form.color === c ? 'ring-2 ring-offset-2 scale-110' : ''} ${darkMode ? 'ring-offset-slate-800' : 'ring-offset-white'} ${COLOR_MAP[c].ring}`} />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border ${darkMode ? 'border-slate-600 text-slate-300' : 'border-slate-200 text-slate-500'}`}>
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-emerald-500 text-white shadow hover:scale-[1.02] transition-all">
              {editData ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function GoalCard({ goal, darkMode, onEdit }) {
  const { deleteGoal, updateGoal } = useFinance();
  const pct = Math.min((goal.saved / goal.target) * 100, 100);
  const c = COLOR_MAP[goal.color] || COLOR_MAP.violet;
  const remaining = goal.target - goal.saved;
  const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  const [addingFunds, setAddingFunds] = useState(false);
  const [fundAmount, setFundAmount] = useState('');

  const addFunds = () => {
    const amt = parseFloat(fundAmount);
    if (!isNaN(amt) && amt > 0) {
      updateGoal(goal.id, { saved: Math.min(goal.saved + amt, goal.target) });
      setFundAmount('');
      setAddingFunds(false);
    }
  };

  return (
    <div className={`rounded-2xl p-5 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl ${c.light} flex items-center justify-center text-2xl`}>{goal.emoji}</div>
          <div>
            <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>{goal.title}</p>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
              {daysLeft > 0 ? `${daysLeft} days left` : '⚠️ Deadline passed'} · {new Date(goal.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => onEdit(goal)} className={`p-1.5 rounded-lg text-xs ${darkMode ? 'hover:bg-violet-600 text-violet-400 hover:text-white' : 'hover:bg-violet-100 text-violet-500'} transition-colors`}>✏️</button>
          <button onClick={() => deleteGoal(goal.id)} className={`p-1.5 rounded-lg text-xs ${darkMode ? 'hover:bg-rose-600 text-rose-400 hover:text-white' : 'hover:bg-rose-100 text-rose-500'} transition-colors`}>🗑️</button>
        </div>
      </div>

      {/* Progress bar */}
      <div className={`h-3 rounded-full mb-3 overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
        <div className={`h-full rounded-full transition-all duration-700 ${c.bar}`} style={{ width: `${pct}%` }} />
      </div>

      <div className="flex items-center justify-between text-xs mb-3">
        <span className={`font-bold ${c.text}`}>{pct.toFixed(0)}% complete</span>
        <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>
          ₹{goal.saved.toLocaleString('en-IN')} / ₹{goal.target.toLocaleString('en-IN')}
        </span>
      </div>

      {pct < 100 && (
        <div className={`text-xs px-3 py-1.5 rounded-xl inline-block ${c.light} ${c.text} font-medium mb-3`}>
          ₹{remaining.toLocaleString('en-IN')} remaining
        </div>
      )}

      {pct >= 100 && (
        <div className="text-xs px-3 py-1.5 rounded-xl inline-block bg-emerald-100 text-emerald-600 font-bold mb-3">
          🎉 Goal Achieved!
        </div>
      )}

      {/* Add funds */}
      {pct < 100 && (
        addingFunds ? (
          <div className="flex gap-2 mt-1">
            <input autoFocus type="number" value={fundAmount} onChange={e => setFundAmount(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addFunds(); if (e.key === 'Escape') setAddingFunds(false); }}
              placeholder="Amount to add"
              className={`flex-1 rounded-xl px-3 py-2 text-sm border outline-none focus:ring-2 focus:ring-violet-500 ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-violet-100'}`} />
            <button onClick={addFunds} className={`px-3 py-2 rounded-xl text-sm font-bold ${c.bar} text-white`}>Add</button>
            <button onClick={() => setAddingFunds(false)} className={`px-3 py-2 rounded-xl text-sm ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>✕</button>
          </div>
        ) : (
          <button onClick={() => setAddingFunds(true)}
            className={`w-full py-2 rounded-xl text-sm font-semibold border-2 border-dashed transition-colors ${darkMode ? 'border-slate-600 text-slate-400 hover:border-violet-500 hover:text-violet-400' : 'border-slate-200 text-slate-400 hover:border-violet-400 hover:text-violet-500'}`}>
            + Add Funds
          </button>
        )
      )}
    </div>
  );
}

export default function GoalsPage() {
  const { goals, darkMode } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [editGoal, setEditGoal] = useState(null);

  const totalTargeted = goals.reduce((s, g) => s + g.target, 0);
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const achieved = goals.filter(g => g.saved >= g.target).length;

  const handleEdit = (g) => { setEditGoal(g); setShowModal(true); };
  const handleClose = () => { setShowModal(false); setEditGoal(null); };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Savings Goals</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Track and achieve your financial milestones</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-emerald-500 text-white text-sm font-bold shadow hover:scale-105 transition-all">
          + New Goal
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Goals', value: goals.length, sub: `${achieved} achieved`, color: 'text-violet-500', bg: darkMode ? 'bg-slate-800' : 'bg-white' },
          { label: 'Total Targeted', value: `₹${(totalTargeted/1000).toFixed(1)}k`, sub: 'across all goals', color: 'text-amber-500', bg: darkMode ? 'bg-slate-800' : 'bg-white' },
          { label: 'Total Saved', value: `₹${(totalSaved/1000).toFixed(1)}k`, sub: `${totalTargeted > 0 ? ((totalSaved/totalTargeted)*100).toFixed(0) : 0}% of targets`, color: 'text-emerald-500', bg: darkMode ? 'bg-slate-800' : 'bg-white' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-5 shadow ${s.bg}`}>
            <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Goals grid */}
      {goals.length === 0 ? (
        <div className={`rounded-2xl p-12 text-center shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <p className="text-5xl mb-4">🎯</p>
          <p className={`font-bold text-base mb-1 ${darkMode ? 'text-white' : 'text-slate-700'}`}>No goals yet</p>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Create your first savings goal to get started</p>
          <button onClick={() => setShowModal(true)} className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-emerald-500 text-white text-sm font-bold">
            + Create Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map(g => <GoalCard key={g.id} goal={g} darkMode={darkMode} onEdit={handleEdit} />)}
        </div>
      )}

      {showModal && <GoalModal onClose={handleClose} editData={editGoal} darkMode={darkMode} />}
    </div>
  );
}
