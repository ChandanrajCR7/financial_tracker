import { useState, useEffect } from 'react';
import { useFinance, CATEGORIES } from '../context/FinanceContext';

const today = new Date().toISOString().split('T')[0];

const defaultForm = {
  title: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  date: today,
  note: '',
};

export default function AddTransactionModal({ onClose, editData }) {
  const { addTransaction, updateTransaction, darkMode } = useFinance();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editData) setForm({ ...editData, amount: String(editData.amount) });
    else setForm(defaultForm);
  }, [editData]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!form.date) e.date = 'Date is required';
    return e;
  };

  const handleChange = (field, value) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'type') {
        updated.category = CATEGORIES[value][0];
      }
      return updated;
    });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    setTimeout(() => {
      const data = { ...form, amount: parseFloat(form.amount) };
      if (editData) updateTransaction(editData.id, data);
      else addTransaction(data);
      setSaving(false);
      onClose();
    }, 300);
  };

  const inputClass = `w-full rounded-xl px-3 py-2.5 text-sm border outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
    darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-violet-100 text-slate-800 placeholder-slate-400'
  }`;

  const labelClass = `block text-xs font-semibold mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-md rounded-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto ${
          darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'
        }`}
        style={{ animation: 'slideUp 0.25s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold">
              {editData ? '✏️ Edit Transaction' : '➕ New Transaction'}
            </h2>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {editData ? 'Update your transaction details' : 'Record a new income or expense'}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg hover:scale-110 transition-transform ${
              darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Type Toggle */}
          <div className={`flex rounded-xl p-1 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
            {['income', 'expense'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange('type', type)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all duration-200 ${
                  form.type === type
                    ? type === 'income'
                      ? 'bg-emerald-500 text-white shadow'
                      : 'bg-rose-500 text-white shadow'
                    : darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {type === 'income' ? '📈 Income' : '📉 Expense'}
              </button>
            ))}
          </div>

          {/* Title */}
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              placeholder="e.g. Monthly Salary"
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              className={`${inputClass} ${errors.title ? 'border-rose-400' : ''}`}
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className={labelClass}>Amount (₹) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-violet-500">₹</span>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={e => handleChange('amount', e.target.value)}
                className={`${inputClass} pl-8 ${errors.amount ? 'border-rose-400' : ''}`}
              />
            </div>
            {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>}
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Category</label>
              <select value={form.category} onChange={e => handleChange('category', e.target.value)} className={inputClass}>
                {CATEGORIES[form.type].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={e => handleChange('date', e.target.value)}
                className={`${inputClass} ${errors.date ? 'border-rose-400' : ''}`}
              />
              {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className={labelClass}>Note (optional)</label>
            <textarea
              rows={2}
              placeholder="Add a short note..."
              value={form.note}
              onChange={e => handleChange('note', e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                darkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-emerald-500 text-white shadow hover:shadow-violet-300 hover:scale-[1.02] transition-all disabled:opacity-60"
            >
              {saving ? '...' : editData ? 'Update' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
