import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import TransactionCard from './TransactionCard';
import Filters from './Filters';
import AddTransactionModal from './AddTransactionModal';

export default function TransactionList() {
  const { transactions, darkMode } = useFinance();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [editingTx, setEditingTx] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (tx) => {
    setEditingTx(tx);
    setShowEditModal(true);
  };

  let filtered = transactions.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      (t.note || '').toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || t.type === filterType;
    const matchCat = filterCategory === 'all' || t.category === filterCategory;
    return matchSearch && matchType && matchCat;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortOrder === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortOrder === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sortOrder === 'highest') return b.amount - a.amount;
    if (sortOrder === 'lowest') return a.amount - b.amount;
    return 0;
  });

  return (
    <section id="transactions" className="flex flex-col gap-4">
      <Filters
        search={search} setSearch={setSearch}
        filterType={filterType} setFilterType={setFilterType}
        filterCategory={filterCategory} setFilterCategory={setFilterCategory}
        sortOrder={sortOrder} setSortOrder={setSortOrder}
      />

      <div className={`rounded-2xl shadow-md overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${darkMode ? 'border-slate-700' : 'border-violet-50'}`}>
          <h2 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            Transactions
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-violet-100 text-violet-600'}`}>
              {filtered.length}
            </span>
          </h2>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2 p-4">
          {filtered.length === 0 ? (
            <div className="text-center py-14">
              <p className="text-4xl mb-3">🔍</p>
              <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                No transactions found
              </p>
            </div>
          ) : (
            filtered.map(tx => (
              <TransactionCard key={tx.id} transaction={tx} onEdit={handleEdit} />
            ))
          )}
        </div>
      </div>

      {showEditModal && (
        <AddTransactionModal
          onClose={() => { setShowEditModal(false); setEditingTx(null); }}
          editData={editingTx}
        />
      )}
    </section>
  );
}
