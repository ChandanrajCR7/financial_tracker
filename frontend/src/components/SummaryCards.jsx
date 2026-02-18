import { useFinance } from '../context/FinanceContext';

function Card({ label, amount, icon, gradient, darkMode, sub }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default ${
        darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'
      }`}
    >
      {/* Gradient blob */}
      <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 ${gradient}`}></div>

      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {label}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${gradient} shadow`}>
          {icon}
        </div>
      </div>

      <p className="text-3xl font-extrabold tracking-tight">
        ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </p>

      {sub && (
        <p className={`mt-1 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>{sub}</p>
      )}

      <div className={`mt-4 h-1 rounded-full ${gradient} opacity-60`}></div>
    </div>
  );
}

export default function SummaryCards({ onAddClick }) {
  const { balance, totalIncome, totalExpense, darkMode, transactions } = useFinance();
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  return (
    <section id="dashboard" className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <Card
        label="Total Balance"
        amount={balance}
        icon="💰"
        gradient="bg-gradient-to-br from-violet-500 to-purple-600"
        darkMode={darkMode}
        sub={`Savings rate: ${savingsRate}%`}
      />
      <Card
        label="Total Income"
        amount={totalIncome}
        icon="📈"
        gradient="bg-gradient-to-br from-emerald-400 to-teal-500"
        darkMode={darkMode}
        sub={`${transactions.filter(t => t.type === 'income').length} transactions`}
      />
      <Card
        label="Total Expenses"
        amount={totalExpense}
        icon="📉"
        gradient="bg-gradient-to-br from-rose-400 to-pink-600"
        darkMode={darkMode}
        sub={`${transactions.filter(t => t.type === 'expense').length} transactions`}
      />
    </section>
  );
}
