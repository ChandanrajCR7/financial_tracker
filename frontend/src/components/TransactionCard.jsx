import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

const CATEGORY_ICONS = {
  Salary: '💼', Freelance: '💻', Investment: '📊', Bonus: '🎯',
  Business: '🏢', 'Rental Income': '🏘️', Pension: '🪙', 'Side Income': '💡',
  Gift: '🎁', Refund: '↩️',
  Food: '🍔', Housing: '🏠', Transport: '🚗', Entertainment: '🎬',
  Health: '💊', Utilities: '⚡', Education: '📚', Shopping: '🛍️',
  Insurance: '🛡️', Subscriptions: '📱', Travel: '✈️', 'Personal Care': '🧴',
  'Dining Out': '🍽️', Clothing: '👗', 'EMI / Loan': '🏦', Taxes: '🧾',
  Charity: '❤️', Other: '📦',
};

export default function TransactionCard({ transaction, onEdit }) {
  const { deleteTransaction, darkMode } = useFinance();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => deleteTransaction(transaction.id), 300);
  };

  const isIncome = transaction.type === 'income';

  return (
    <div
      className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
        deleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      } ${
        darkMode
          ? 'bg-slate-800 border-slate-700 hover:border-violet-500'
          : 'bg-white border-violet-50 hover:border-violet-200'
      }`}
    >
      {/* Category Icon */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm ${
          isIncome
            ? 'bg-emerald-100 dark:bg-emerald-900/30'
            : 'bg-rose-100 dark:bg-rose-900/30'
        }`}
      >
        {CATEGORY_ICONS[transaction.category] || '💰'}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          {transaction.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              isIncome
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-600'
            }`}
          >
            {transaction.category}
          </span>
          <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
            {new Date(transaction.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>
        {transaction.note && (
          <p className={`text-xs mt-0.5 truncate ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            {transaction.note}
          </p>
        )}
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0">
        <p
          className={`font-extrabold text-base ${
            isIncome ? 'text-emerald-500' : 'text-rose-500'
          }`}
        >
          {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onEdit(transaction)}
          className={`p-2 rounded-lg text-xs font-semibold transition-all hover:scale-110 ${
            darkMode ? 'bg-slate-700 hover:bg-violet-600 text-violet-400 hover:text-white' : 'bg-violet-50 hover:bg-violet-600 text-violet-600 hover:text-white'
          }`}
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={handleDelete}
          className={`p-2 rounded-lg text-xs font-semibold transition-all hover:scale-110 ${
            darkMode ? 'bg-slate-700 hover:bg-rose-600 text-rose-400 hover:text-white' : 'bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white'
          }`}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
