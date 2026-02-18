import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import Navbar from './components/Navbar';
import AddTransactionModal from './components/AddTransactionModal';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import AnalyticsPage from './pages/AnalyticsPage';

function Layout() {
  const { darkMode } = useFinance();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-violet-50/50'}`}>
      <Navbar onAddClick={() => setShowModal(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-emerald-500 text-white text-3xl shadow-2xl hover:scale-110 hover:shadow-violet-400 transition-all duration-200 flex items-center justify-center z-40"
        aria-label="Add transaction"
      >
        +
      </button>

      {showModal && (
        <AddTransactionModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <FinanceProvider>
        <Layout />
      </FinanceProvider>
    </BrowserRouter>
  );
}
