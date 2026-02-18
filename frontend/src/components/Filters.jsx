import { useFinance, CATEGORIES } from '../context/FinanceContext';

export default function Filters({ search, setSearch, filterType, setFilterType, filterCategory, setFilterCategory, sortOrder, setSortOrder }) {
  const { darkMode } = useFinance();

  const allCategories = filterType === 'income'
    ? CATEGORIES.income
    : filterType === 'expense'
    ? CATEGORIES.expense
    : [...new Set([...CATEGORIES.income, ...CATEGORIES.expense])].sort();

  const base = `rounded-xl px-3 py-2 text-sm font-medium border outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
    darkMode
      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
      : 'bg-white border-violet-100 text-slate-700 placeholder-slate-400'
  }`;

  return (
    <section className={`rounded-2xl p-4 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`}>
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="flex-1 min-w-[180px] relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`${base} pl-8 w-full`}
          />
        </div>

        {/* Type filter */}
        <select value={filterType} onChange={e => { setFilterType(e.target.value); setFilterCategory('all'); }} className={base}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Category filter */}
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className={base}>
          <option value="all">All Categories</option>
          {allCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Sort */}
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className={base}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>

        {/* Clear */}
        {(search || filterType !== 'all' || filterCategory !== 'all') && (
          <button
            onClick={() => { setSearch(''); setFilterType('all'); setFilterCategory('all'); }}
            className="px-3 py-2 rounded-xl text-sm font-semibold bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors"
          >
            ✕ Clear
          </button>
        )}
      </div>
    </section>
  );
}
