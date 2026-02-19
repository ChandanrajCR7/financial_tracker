import Charts from '../components/Charts';
import InsightsPanel from '../components/InsightsPanel';
import Suggestions from '../components/Suggestions';
import { useFinance } from '../context/FinanceContext';

export default function AnalyticsPage() {
  const { darkMode, transactions, totalIncome, totalExpense, balance } = useFinance();

  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;
  const topExpense = [...transactions]
    .filter(t => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)[0];

  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});
  const topCategory = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0];

  const stat = (label, value, sub, color) => (
    <div className={`rounded-2xl p-5 shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
      <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
      <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
      {sub && <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>{sub}</p>}
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Analytics</h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Visual breakdown of your spending patterns</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stat('Savings Rate', `${savingsRate}%`, 'of total income saved', savingsRate >= 20 ? 'text-emerald-500' : 'text-rose-500')}
        {stat('Total Transactions', transactions.length, `${transactions.filter(t=>t.type==='income').length} income · ${transactions.filter(t=>t.type==='expense').length} expense`, 'text-violet-500')}
        {stat('Biggest Expense', topExpense ? `₹${topExpense.amount.toLocaleString('en-IN')}` : '—', topExpense?.title, 'text-rose-500')}
        {stat('Top Category', topCategory ? topCategory[0] : '—', topCategory ? `₹${topCategory[1].toLocaleString('en-IN')} spent` : '', 'text-amber-500')}
      </div>

      <Charts />

      <InsightsPanel />

      <Suggestions />
    </div>
  );
}
