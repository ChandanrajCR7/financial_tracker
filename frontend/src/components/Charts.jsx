import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useFinance } from '../context/FinanceContext';

const PIE_COLORS = [
  '#7c3aed', '#10b981', '#f43f5e', '#f59e0b', '#3b82f6',
  '#ec4899', '#14b8a6', '#8b5cf6', '#22c55e', '#ef4444',
];

const CustomTooltip = ({ active, payload, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`px-3 py-2 rounded-xl shadow-lg text-sm font-semibold ${darkMode ? 'bg-slate-700 text-white' : 'bg-white text-slate-800 border border-violet-100'}`}>
        <p>{payload[0].name}</p>
        <p className="text-violet-500">₹{payload[0].value.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

export default function Charts() {
  const { transactions, darkMode } = useFinance();

  // Expense breakdown by category
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  // Monthly income vs expense (last 6 months)
  const monthlyData = {};
  transactions.forEach(t => {
    const d = new Date(t.date);
    const key = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
    if (!monthlyData[key]) monthlyData[key] = { month: key, income: 0, expense: 0 };
    monthlyData[key][t.type] += t.amount;
  });
  const barData = Object.values(monthlyData).slice(-6);

  const axisColor = darkMode ? '#94a3b8' : '#94a3b8';
  const gridColor = darkMode ? '#334155' : '#f1f5f9';

  return (
    <section id="charts" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Pie Chart */}
      <div className={`rounded-2xl p-5 shadow-md ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <h3 className={`font-bold text-base mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          💸 Expense Breakdown
        </h3>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Legend
                formatter={(value) => (
                  <span className={`text-xs font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>No expense data</p>
          </div>
        )}
      </div>

      {/* Bar Chart */}
      <div className={`rounded-2xl p-5 shadow-md ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <h3 className={`font-bold text-base mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          📊 Monthly Overview
        </h3>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Legend
                formatter={(value) => (
                  <span className={`text-xs font-medium capitalize ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{value}</span>
                )}
              />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>No monthly data</p>
          </div>
        )}
      </div>
    </section>
  );
}
