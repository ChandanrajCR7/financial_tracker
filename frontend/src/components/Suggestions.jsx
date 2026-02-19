import { useFinance } from '../context/FinanceContext';

function generateSuggestions(transactions, totalIncome, totalExpense, balance, goals) {
  const tips = [];
  if (transactions.length === 0) return tips;

  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  // Savings rate
  if (savingsRate < 10) {
    tips.push({ icon: '🚨', title: 'Very low savings rate', desc: `You're saving only ${savingsRate.toFixed(1)}% of your income. Try cutting discretionary spending to reach at least 20%.`, severity: 'high' });
  } else if (savingsRate < 20) {
    tips.push({ icon: '⚠️', title: 'Improve your savings rate', desc: `You're saving ${savingsRate.toFixed(1)}% of income. Financial experts recommend saving at least 20%.`, severity: 'medium' });
  } else {
    tips.push({ icon: '✅', title: 'Great savings habit!', desc: `You're saving ${savingsRate.toFixed(1)}% of your income — keep it up!`, severity: 'good' });
  }

  // Category warnings
  const catTotals = transactions.filter(t => t.type === 'expense')
    .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});

  const foodTotal = (catTotals['Food'] || 0) + (catTotals['Dining Out'] || 0);
  if (totalExpense > 0 && (foodTotal / totalExpense) > 0.3) {
    tips.push({ icon: '🍔', title: 'High food spending', desc: `Food & dining makes up ${((foodTotal / totalExpense) * 100).toFixed(0)}% of your expenses. Meal prepping can help reduce this.`, severity: 'medium' });
  }

  const entertainmentTotal = (catTotals['Entertainment'] || 0) + (catTotals['Subscriptions'] || 0);
  if (totalExpense > 0 && (entertainmentTotal / totalExpense) > 0.15) {
    tips.push({ icon: '📱', title: 'Review subscriptions', desc: `Entertainment & subscriptions use ${((entertainmentTotal / totalExpense) * 100).toFixed(0)}% of your budget. Consider auditing unused services.`, severity: 'medium' });
  }

  const shoppingTotal = (catTotals['Shopping'] || 0) + (catTotals['Clothing'] || 0);
  if (totalExpense > 0 && (shoppingTotal / totalExpense) > 0.2) {
    tips.push({ icon: '🛍️', title: 'Curb impulse shopping', desc: `Shopping accounts for ${((shoppingTotal / totalExpense) * 100).toFixed(0)}% of expenses. Try a 24-hour rule before any non-essential purchase.`, severity: 'medium' });
  }

  // Goals suggestions
  if (goals.length === 0) {
    tips.push({ icon: '🎯', title: 'Set a savings goal', desc: "You haven't set any savings goals. Goals give your savings a purpose — try adding one in the Goals section!", severity: 'info' });
  } else {
    const overdueGoals = goals.filter(g => new Date(g.deadline) < new Date() && g.saved < g.target);
    if (overdueGoals.length > 0) {
      tips.push({ icon: '⏰', title: `${overdueGoals.length} overdue goal${overdueGoals.length > 1 ? 's' : ''}`, desc: `"${overdueGoals[0].title}" has passed its deadline. Consider updating the deadline or adding funds.`, severity: 'high' });
    }
  }

  // Emergency fund check
  const monthlyExpenses = totalExpense;
  const emergencyGoal = goals.find(g => g.title.toLowerCase().includes('emergency'));
  if (!emergencyGoal && monthlyExpenses > 0) {
    tips.push({ icon: '🛡️', title: 'Build an emergency fund', desc: `Experts recommend keeping 3–6 months of expenses (₹${(monthlyExpenses * 3).toLocaleString('en-IN')}+) as emergency savings.`, severity: 'info' });
  }

  // Income diversity
  const incomeTypes = [...new Set(transactions.filter(t => t.type === 'income').map(t => t.category))];
  if (incomeTypes.length === 1) {
    tips.push({ icon: '💡', title: 'Diversify income streams', desc: "You rely on a single income source. Consider freelancing, investments, or a side hustle to reduce financial risk.", severity: 'info' });
  }

  // Positive streak
  if (balance > 0 && savingsRate >= 20) {
    tips.push({ icon: '🌟', title: 'You\'re on track!', desc: "Your balance is positive and savings rate is healthy. Consider investing surplus funds in SIP or FD for long-term growth.", severity: 'good' });
  }

  return tips;
}

const SEVERITY_STYLES = {
  high: { bg: 'bg-rose-50', border: 'border-rose-200', icon_bg: 'bg-rose-100', text: 'text-rose-700', sub: 'text-rose-600' },
  medium: { bg: 'bg-amber-50', border: 'border-amber-200', icon_bg: 'bg-amber-100', text: 'text-amber-700', sub: 'text-amber-600' },
  good: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon_bg: 'bg-emerald-100', text: 'text-emerald-700', sub: 'text-emerald-600' },
  info: { bg: 'bg-violet-50', border: 'border-violet-200', icon_bg: 'bg-violet-100', text: 'text-violet-700', sub: 'text-violet-600' },
};

const DARK_SEVERITY_STYLES = {
  high: { bg: 'bg-rose-900/20', border: 'border-rose-800', icon_bg: 'bg-rose-900/40', text: 'text-rose-400', sub: 'text-rose-300' },
  medium: { bg: 'bg-amber-900/20', border: 'border-amber-800', icon_bg: 'bg-amber-900/40', text: 'text-amber-400', sub: 'text-amber-300' },
  good: { bg: 'bg-emerald-900/20', border: 'border-emerald-800', icon_bg: 'bg-emerald-900/40', text: 'text-emerald-400', sub: 'text-emerald-300' },
  info: { bg: 'bg-violet-900/20', border: 'border-violet-800', icon_bg: 'bg-violet-900/40', text: 'text-violet-400', sub: 'text-violet-300' },
};

export default function Suggestions() {
  const { transactions, totalIncome, totalExpense, balance, goals, darkMode } = useFinance();
  const tips = generateSuggestions(transactions, totalIncome, totalExpense, balance, goals);

  if (tips.length === 0) return null;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className={`text-lg font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>🤖 Smart Suggestions</h2>
        <p className={`text-sm mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Personalized tips based on your financial data</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tips.map((tip, i) => {
          const s = darkMode ? DARK_SEVERITY_STYLES[tip.severity] : SEVERITY_STYLES[tip.severity];
          return (
            <div key={i} className={`rounded-2xl p-4 border flex gap-4 ${s.bg} ${s.border}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${s.icon_bg}`}>
                {tip.icon}
              </div>
              <div>
                <p className={`text-sm font-bold ${s.text}`}>{tip.title}</p>
                <p className={`text-xs mt-1 leading-relaxed ${s.sub}`}>{tip.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
