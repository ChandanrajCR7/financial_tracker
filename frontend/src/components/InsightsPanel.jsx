import { useFinance } from '../context/FinanceContext';

export default function InsightsPanel() {
  const { transactions, totalIncome, totalExpense, balance, darkMode } = useFinance();

  if (transactions.length === 0) return null;

  // Avg daily spend (last 30 days)
  const last30 = transactions.filter(t => {
    const d = new Date(t.date);
    const diff = (new Date() - d) / (1000 * 60 * 60 * 24);
    return t.type === 'expense' && diff <= 30;
  });
  const avgDailySpend = last30.length > 0 ? (last30.reduce((s, t) => s + t.amount, 0) / 30).toFixed(0) : 0;

  // Most expensive day of week
  const dayTotals = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    const day = new Date(t.date).toLocaleDateString('en-IN', { weekday: 'long' });
    dayTotals[day] = (dayTotals[day] || 0) + t.amount;
  });
  const topDay = Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0];

  // This month vs last month expenses
  const now = new Date();
  const thisMonth = transactions.filter(t => {
    const d = new Date(t.date);
    return t.type === 'expense' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, t) => s + t.amount, 0);

  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = transactions.filter(t => {
    const d = new Date(t.date);
    return t.type === 'expense' && d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
  }).reduce((s, t) => s + t.amount, 0);

  const monthDiff = lastMonth > 0 ? (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(0) : null;

  // Top 3 expense categories
  const catTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});
  const top3 = Object.entries(catTotals).sort((a, b) => b[1] - a[1]).slice(0, 3);

  // Savings rate
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  // Subscription total
  const subscriptionTotal = transactions
    .filter(t => t.type === 'expense' && (t.category === 'Subscriptions' || t.category === 'Entertainment'))
    .reduce((s, t) => s + t.amount, 0);

  const card = (icon, title, value, sub, accent) => (
    <div className={`rounded-2xl p-5 shadow hover:shadow-md transition-shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
      </div>
      <p className={`text-2xl font-extrabold ${accent}`}>{value}</p>
      {sub && <p className={`text-xs mt-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>{sub}</p>}
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className={`text-lg font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>💡 Insights</h2>
        <p className={`text-sm mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Data-driven view of your money habits</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {card('📅', 'Avg Daily Spend', `₹${Number(avgDailySpend).toLocaleString('en-IN')}`, 'over the last 30 days', 'text-violet-500')}
        {card('📆', 'Heaviest Spend Day', topDay ? topDay[0] : '—', topDay ? `₹${topDay[1].toLocaleString('en-IN')} total` : '', 'text-rose-500')}
        {card('📉', 'Month vs Last Month', monthDiff !== null ? `${monthDiff > 0 ? '+' : ''}${monthDiff}%` : 'N/A',
          monthDiff !== null ? (monthDiff > 0 ? '⬆ Spending increased' : '⬇ Spending decreased') : 'Insufficient data',
          monthDiff === null ? 'text-slate-400' : monthDiff > 0 ? 'text-rose-500' : 'text-emerald-500'
        )}
        {card('💾', 'Savings Rate', `${savingsRate}%`, savingsRate >= 20 ? '✅ Great savings habit!' : 'Aim for at least 20%', savingsRate >= 20 ? 'text-emerald-500' : 'text-amber-500')}
      </div>

      {/* Top spending categories */}
      <div className={`rounded-2xl p-5 shadow ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <p className={`text-sm font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>🏆 Top Spending Categories</p>
        <div className="flex flex-col gap-3">
          {top3.map(([cat, amt], i) => {
            const pct = totalExpense > 0 ? ((amt / totalExpense) * 100).toFixed(1) : 0;
            const colors = ['bg-violet-500', 'bg-emerald-500', 'bg-amber-400'];
            return (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    #{i + 1} {cat}
                  </span>
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>
                    ₹{amt.toLocaleString('en-IN')} · {pct}%
                  </span>
                </div>
                <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <div className={`h-full rounded-full ${colors[i]} transition-all duration-700`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subscriptions callout */}
      {subscriptionTotal > 0 && (
        <div className={`rounded-2xl p-4 flex items-center gap-4 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow`}>
          <div className="text-3xl">📱</div>
          <div>
            <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              You spend ₹{subscriptionTotal.toLocaleString('en-IN')} on subscriptions & entertainment
            </p>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Review your subscriptions — cancel ones you don't use regularly
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
