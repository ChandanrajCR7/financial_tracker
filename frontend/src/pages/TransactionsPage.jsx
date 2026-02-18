import { useFinance } from '../context/FinanceContext';
import TransactionList from '../components/TransactionList';

export default function TransactionsPage() {
  const { darkMode } = useFinance();

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div>
        <h1 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          Transactions
        </h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Manage, search and filter all your income and expenses
        </p>
      </div>

      <TransactionList />
    </div>
  );
}
