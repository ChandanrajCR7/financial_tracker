import { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

const SAMPLE_TRANSACTIONS = [
  { id: 1, title: 'Salary', amount: 5000, type: 'income', category: 'Salary', date: '2026-02-01', note: 'Monthly salary' },
  { id: 2, title: 'Rent', amount: 1200, type: 'expense', category: 'Housing', date: '2026-02-02', note: 'Monthly rent' },
  { id: 3, title: 'Groceries', amount: 320, type: 'expense', category: 'Food', date: '2026-02-05', note: 'Weekly groceries' },
  { id: 4, title: 'Freelance Project', amount: 800, type: 'income', category: 'Freelance', date: '2026-02-08', note: 'Web design gig' },
  { id: 5, title: 'Netflix', amount: 18, type: 'expense', category: 'Entertainment', date: '2026-02-10', note: 'Subscription' },
  { id: 6, title: 'Gym', amount: 45, type: 'expense', category: 'Health', date: '2026-02-11', note: 'Monthly membership' },
  { id: 7, title: 'Electric Bill', amount: 95, type: 'expense', category: 'Utilities', date: '2026-02-12', note: '' },
  { id: 8, title: 'Dinner Out', amount: 65, type: 'expense', category: 'Food', date: '2026-02-14', note: 'Valentine dinner' },
  { id: 9, title: 'Bonus', amount: 1000, type: 'income', category: 'Salary', date: '2026-02-15', note: 'Performance bonus' },
  { id: 10, title: 'Spotify', amount: 10, type: 'expense', category: 'Entertainment', date: '2026-02-16', note: 'Subscription' },
  { id: 11, title: 'Transport', amount: 60, type: 'expense', category: 'Transport', date: '2026-02-17', note: 'Monthly pass' },
  { id: 12, title: 'Online Course', amount: 29, type: 'expense', category: 'Education', date: '2026-02-18', note: 'React course' },
];

export const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Bonus', 'Business', 'Rental Income', 'Pension', 'Side Income', 'Gift', 'Refund', 'Other'],
  expense: ['Food', 'Housing', 'Transport', 'Entertainment', 'Health', 'Utilities', 'Education', 'Shopping', 'Insurance', 'Subscriptions', 'Travel', 'Personal Care', 'Dining Out', 'Clothing', 'EMI / Loan', 'Taxes', 'Charity', 'Other'],
};

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem('fintrack_transactions');
    return stored ? JSON.parse(stored) : SAMPLE_TRANSACTIONS;
  });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('fintrack_theme') === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('fintrack_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fintrack_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const addTransaction = (tx) => {
    const newTx = { ...tx, id: Date.now() };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const updateTransaction = (id, updated) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        totalIncome,
        totalExpense,
        balance,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
