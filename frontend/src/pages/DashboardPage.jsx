import { useState } from 'react';
import SummaryCards from '../components/SummaryCards';
import Charts from '../components/Charts';
import AddTransactionModal from '../components/AddTransactionModal';
import { useFinance } from '../context/FinanceContext';

export default function DashboardPage() {
  const { darkMode } = useFinance();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div>
        <h1 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          Dashboard
        </h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Overview of your finances at a glance
        </p>
      </div>

      <SummaryCards />
      <Charts />

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
